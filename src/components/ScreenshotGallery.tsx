import { useCallback, useEffect, useRef, useState } from "react";
import { screenshots } from "../config/site.config";
import { MOCK_SCREENS } from "./screens/MockScreens";
import { ChevronLeftIcon, ChevronRightIcon } from "../icons";

export default function ScreenshotGallery() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ prev: false, next: false });

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    setEdges({
      prev: track.scrollLeft > 4,
      next: track.scrollLeft < max - 4,
    });
  }, []);

  useEffect(() => {
    measure();
    const track = trackRef.current;
    if (!track) return;
    track.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      track.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  const nudge = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>(".shot");
    const step = card ? card.offsetWidth + 16 : track.clientWidth * 0.8;
    track.scrollBy({ left: step * direction, behavior: "smooth" });
  };

  const showControls = edges.prev || edges.next;

  return (
    <section className="gallery" aria-label="App screenshots">
      <div className="gallery__viewport">
        {showControls && (
          <button
            type="button"
            className="gallery__nav gallery__nav--prev"
            onClick={() => nudge(-1)}
            disabled={!edges.prev}
          >
            <ChevronLeftIcon size={20} />
            <span className="sr-only">Previous screenshots</span>
          </button>
        )}

        <div className="gallery__track" ref={trackRef}>
          {screenshots.map((shot) => {
            const Mock = MOCK_SCREENS[shot.mock];
            return (
              <figure className="shot" key={shot.id}>
                <figcaption className="shot__caption">
                  <span className="shot__title">{shot.title}</span>
                  <span className="shot__subtitle">{shot.subtitle}</span>
                </figcaption>
                {shot.src ? (
                  <img className="shot__image" src={shot.src} alt={`${shot.title} — ${shot.subtitle}`} />
                ) : (
                  <div className="shot__mock">
                    <Mock />
                  </div>
                )}
              </figure>
            );
          })}
        </div>

        {showControls && (
          <button
            type="button"
            className="gallery__nav gallery__nav--next"
            onClick={() => nudge(1)}
            disabled={!edges.next}
          >
            <ChevronRightIcon size={20} />
            <span className="sr-only">Next screenshots</span>
          </button>
        )}
      </div>
    </section>
  );
}
