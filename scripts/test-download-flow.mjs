/* ------------------------------------------------------------------ *
 * Download-flow test
 *
 * Boots the landing page in headless Chrome, reads the release
 * manifest, and clicks both download rows. It proves that a click
 * actually hands a file to the browser, that the visitor stays on the
 * page, and that a missing manifest degrades to the "link will be
 * available soon" notice instead of a broken button.
 *
 *   node scripts/test-download-flow.mjs            dev server + local fixture
 *   node scripts/test-download-flow.mjs --preview  built site + missing manifest
 * ------------------------------------------------------------------ */

import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { setTimeout as sleep } from "node:timers/promises";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PREVIEW = process.argv.includes("--preview");
const PORT = Number(process.env.TEST_PORT || (PREVIEW ? 4183 : 4181));
const CDP_PORT = Number(process.env.TEST_CDP_PORT || (PREVIEW ? 9337 : 9336));
const BASE = `http://127.0.0.1:${PORT}`;

const CHROME_CANDIDATES = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  process.env.CHROME_PATH,
].filter(Boolean);

const FIXTURE_APK = join(ROOT, "test-fixtures", "SoluPlay.apk");

const failures = [];
const notes = [];

function check(name, ok, detail = "") {
  if (ok) {
    console.log(`  PASS  ${name}${detail ? ` — ${detail}` : ""}`);
  } else {
    failures.push(`${name}${detail ? ` — ${detail}` : ""}`);
    console.log(`  FAIL  ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

/* ----------------------------- CDP client -------------------------- */

class Cdp {
  constructor(socket) {
    this.socket = socket;
    this.nextId = 0;
    this.pending = new Map();
    this.events = [];
  }

  static async connect(url) {
    const socket = new WebSocket(url);
    await new Promise((resolve, reject) => {
      socket.addEventListener("open", resolve, { once: true });
      socket.addEventListener("error", () => reject(new Error("CDP socket failed")), {
        once: true,
      });
    });

    const cdp = new Cdp(socket);
    socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (message.id && cdp.pending.has(message.id)) {
        const { resolve: done, reject } = cdp.pending.get(message.id);
        cdp.pending.delete(message.id);
        if (message.error) reject(new Error(message.error.message));
        else done(message.result);
        return;
      }
      if (message.method) cdp.events.push(message);
    });
    return cdp;
  }

  send(method, params = {}) {
    const id = ++this.nextId;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.socket.send(JSON.stringify({ id, method, params }));
      setTimeout(() => {
        if (this.pending.has(id)) {
          this.pending.delete(id);
          reject(new Error(`${method} timed out`));
        }
      }, 20000);
    });
  }

  async evaluate(expression) {
    const result = await this.send("Runtime.evaluate", {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    if (result.exceptionDetails) {
      throw new Error(
        result.exceptionDetails.exception?.description || "evaluate failed",
      );
    }
    return result.result.value;
  }
}

/* ------------------------------- helpers --------------------------- */

async function waitForTarget(port, timeoutMs = 20000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/list`);
      const targets = await response.json();
      const page = targets.find((t) => t.type === "page" && t.webSocketDebuggerUrl);
      if (page) return page;
    } catch {
      /* Chrome is still starting. */
    }
    await sleep(200);
  }
  throw new Error("Chrome did not expose a page target");
}

async function waitForServer(url, timeoutMs = 30000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url, { redirect: "follow" });
      if (response.status < 500) return;
    } catch {
      /* Not up yet. */
    }
    await sleep(250);
  }
  throw new Error(`server did not start at ${url}`);
}

async function poll(cdp, expression, timeoutMs = 15000) {
  const deadline = Date.now() + timeoutMs;
  let last = null;
  while (Date.now() < deadline) {
    last = await cdp.evaluate(expression);
    if (last) return last;
    await sleep(200);
  }
  return last;
}

function downloadFiles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((name) => !name.endsWith(".crdownload"));
}

/**
 * Chrome's own component updates (a CRX) also land in the download
 * folder, so only the APK downloads are counted.
 */
function apkDownloads(cdp) {
  const begun = cdp.events.filter(
    (event) =>
      event.method === "Browser.downloadWillBegin" &&
      (event.params.suggestedFilename || "").startsWith("SoluPlay"),
  );
  const guids = begun.map((event) => event.params.guid);
  const completed = cdp.events
    .filter(
      (event) =>
        event.method === "Browser.downloadProgress" &&
        event.params.state === "completed",
    )
    .map((event) => event.params.guid)
    .filter((guid) => guids.includes(guid));

  return { guids, completed };
}

async function waitFor(predicate, timeoutMs = 15000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const value = predicate();
    if (value) return value;
    await sleep(150);
  }
  return predicate();
}

async function openMenu(cdp) {
  const isOpen = await cdp.evaluate(`!!document.querySelector('.dl__menu')`);
  if (!isOpen) await cdp.evaluate(`document.querySelector('.dl__trigger').click()`);
  await sleep(300);
}

function ensureFixtureApk() {
  if (existsSync(FIXTURE_APK)) return;
  mkdirSync(dirname(FIXTURE_APK), { recursive: true });
  const body = Buffer.alloc(4096, 0x20);
  Buffer.from("SoluPlay download-flow test fixture. Not an installable APK.\n").copy(body);
  writeFileSync(FIXTURE_APK, body);
  notes.push("created the local test fixture APK (4 KB placeholder)");
}

/* -------------------------------- main ----------------------------- */

async function main() {
  const chromePath = CHROME_CANDIDATES.find((candidate) => existsSync(candidate));
  if (!chromePath) throw new Error("Google Chrome was not found on this PC");

  ensureFixtureApk();

  const downloadDir = join(tmpdir(), `soluplay-download-test-${Date.now()}`);
  const profileDir = join(tmpdir(), `soluplay-chrome-profile-${Date.now()}`);
  mkdirSync(downloadDir, { recursive: true });

  const viteArgs = PREVIEW
    ? [
        "node_modules/vite/bin/vite.js",
        "preview",
        "--host",
        "127.0.0.1",
        "--port",
        String(PORT),
        "--strictPort",
      ]
    : [
        "node_modules/vite/bin/vite.js",
        "--host",
        "127.0.0.1",
        "--port",
        String(PORT),
        "--strictPort",
      ];

  const server = spawn(process.execPath, viteArgs, {
    cwd: ROOT,
    stdio: "ignore",
  });

  const chrome = spawn(
    chromePath,
    [
      "--headless=new",
      "--disable-gpu",
      "--no-sandbox",
      "--hide-scrollbars",
      `--remote-debugging-port=${CDP_PORT}`,
      `--user-data-dir=${profileDir}`,
      "about:blank",
    ],
    { stdio: "ignore" },
  );

  let cdp = null;
  try {
    await waitForServer(`${BASE}/`);
    const target = await waitForTarget(CDP_PORT);
    cdp = await Cdp.connect(target.webSocketDebuggerUrl);

    await cdp.send("Page.enable");
    await cdp.send("Runtime.enable");
    await cdp.send("Network.enable");
    await cdp.send("Browser.setDownloadBehavior", {
      behavior: "allow",
      downloadPath: downloadDir,
      eventsEnabled: true,
    });

    if (PREVIEW) {
      // The published manifest is not on GitHub yet, so the request is cut
      // off on purpose: this run proves the built site survives a missing
      // manifest instead of shipping a broken button.
      await cdp.send("Network.setBlockedURLs", { urls: ["*raw.githubusercontent.com*"] });
    }

    await cdp.send("Page.navigate", { url: `${BASE}/` });
    await poll(cdp, `!!document.querySelector('.dl__trigger')`, 20000);

    const consoleErrors = () =>
      cdp.events.filter(
        (event) =>
          event.method === "Runtime.exceptionThrown" ||
          (event.method === "Runtime.consoleAPICalled" && event.params.type === "error"),
      ).length;

    if (PREVIEW) {
      console.log("\nBuilt site — manifest unavailable");
      await sleep(4500);

      const releaseText = await cdp.evaluate(
        `document.querySelector('.release')?.textContent?.trim() || ''`,
      );
      check("no version is claimed without a manifest", releaseText === "", releaseText);

      const before = await cdp.evaluate(`location.href`);
      await openMenu(cdp);
      await cdp.evaluate(`document.querySelectorAll('.dl__item')[0].click()`);
      await sleep(600);

      const notice = await cdp.evaluate(
        `document.querySelector('.dl__notice')?.textContent?.trim() || ''`,
      );
      check(
        "the button explains that the link is not ready",
        notice.toLowerCase().includes("available soon"),
        notice,
      );

      const after = await cdp.evaluate(`location.href`);
      check("the visitor stays on the landing page", before === after, after);

      check("no console errors", consoleErrors() === 0, `${consoleErrors()} error(s)`);
    } else {
      console.log("\nDev server — manifest served by the local fixture");

      const releaseText = await poll(
        cdp,
        `(document.querySelector('.release')?.textContent || '').includes('Version 0.1.0') ? document.querySelector('.release').textContent.trim() : ''`,
        20000,
      );
      check("the version from the manifest is displayed", !!releaseText, releaseText);

      for (const [index, label] of [
        [0, "Android Phone & Tablet"],
        [1, "Android TV & TV Boxes"],
      ]) {
        await openMenu(cdp);

        const meta = await cdp.evaluate(
          `document.querySelectorAll('.dl__item-meta')[${index}]?.textContent?.trim() || ''`,
        );
        check(`${label}: shows the manifest version`, meta.includes("v0.1.0"), meta);

        const before = await cdp.evaluate(`location.href`);
        const guidsBefore = new Set(apkDownloads(cdp).guids);

        await cdp.evaluate(`document.querySelectorAll('.dl__item')[${index}].click()`);

        const notice = await poll(
          cdp,
          `(document.querySelector('.dl__notice')?.textContent || '').includes('download started') ? document.querySelector('.dl__notice').textContent.trim() : ''`,
          5000,
        );
        check(
          `${label}: the page reports the download`,
          notice.toLowerCase().includes("download started"),
          notice,
        );

        const started = await waitFor(() => {
          const fresh = apkDownloads(cdp).guids.filter((guid) => !guidsBefore.has(guid));
          return fresh.length > 0 ? fresh : false;
        });
        check(`${label}: the click starts a download`, !!started, `${started}`);

        const finished = await waitFor(() => {
          const fresh = apkDownloads(cdp).guids.filter((guid) => !guidsBefore.has(guid));
          return fresh.length > 0 && apkDownloads(cdp).completed.includes(fresh[0]);
        });
        check(`${label}: the file finishes downloading`, finished === true, `${finished}`);

        const savedFile = downloadFiles(downloadDir).find((name) =>
          name.startsWith("SoluPlay"),
        );
        check(`${label}: the file lands on disk`, !!savedFile, savedFile || "no file");

        const after = await cdp.evaluate(`location.href`);
        check(`${label}: the visitor stays on the landing page`, before === after, after);
      }

      check("no console errors", consoleErrors() === 0, `${consoleErrors()} error(s)`);

      if (process.env.DEBUG_NET === "1") {
        const urls = cdp.events
          .filter((event) => event.method === "Network.requestWillBeSent")
          .map((event) => event.params.request.url);
        console.log(`\n  requests:\n${urls.map((url) => `    ${url}`).join("\n")}`);

        const downloads = cdp.events.filter(
          (event) => event.method === "Browser.downloadWillBegin",
        );
        console.log(
          `\n  downloads:\n${downloads
            .map(
              (event) =>
                `    ${event.params.suggestedFilename} <- ${event.params.url}`,
            )
            .join("\n")}`,
        );
      }

      const saved = downloadFiles(downloadDir).map((name) => {
        const file = join(downloadDir, name);
        return `${name} (${statSync(file).size} bytes)`;
      });
      notes.push(`downloaded into the test folder: ${saved.join(", ") || "nothing"}`);
    }
  } finally {
    if (cdp) {
      await Promise.race([cdp.send("Browser.close").catch(() => {}), sleep(1500)]);
    }
    chrome.kill();
    server.kill();
    await sleep(500);
    rmSync(profileDir, { recursive: true, force: true });
    if (process.env.KEEP === "1") {
      console.log(`\n  kept the download folder: ${downloadDir}`);
    } else {
      rmSync(downloadDir, { recursive: true, force: true });
    }
  }

  console.log("");
  notes.forEach((note) => console.log(`  note  ${note}`));

  if (failures.length > 0) {
    console.error(`\n${failures.length} check(s) failed:\n${failures.map((f) => `  - ${f}`).join("\n")}`);
    process.exit(1);
  }
  console.log("\nAll checks passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
