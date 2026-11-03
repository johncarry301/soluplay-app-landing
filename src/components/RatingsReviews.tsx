import { useState } from "react";
import { ratings } from "../config/site.config";
import { ArrowRightIcon, MoreIcon, StarIcon } from "../icons";

function Stars({ value, size = 16 }: { value: number; size?: number }) {
  return (
    <span className="stars" role="img" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <StarIcon
          key={n}
          size={size}
          className={n <= Math.round(value) ? "stars__on" : "stars__off"}
        />
      ))}
    </span>
  );
}

export default function RatingsReviews() {
  const [showAll, setShowAll] = useState(false);
  const total = ratings.distribution.reduce((sum, row) => sum + row.count, 0);
  const top = ratings.distribution[0]?.count || 1;
  const visible = showAll ? ratings.reviews : ratings.reviews.slice(0, ratings.visibleReviews);

  return (
    <section className="section" aria-labelledby="ratings-heading">
      <div className="ratings__head">
        <h2 className="section__heading" id="ratings-heading">
          Ratings &amp; Reviews
          {ratings.demo && <span className="tag">{ratings.demoLabel}</span>}
        </h2>
        {ratings.reviews.length > ratings.visibleReviews && (
          <button
            type="button"
            className="link-btn"
            aria-expanded={showAll}
            onClick={() => setShowAll((v) => !v)}
          >
            <span>{showAll ? "Show less" : "See all"}</span>
            <ArrowRightIcon size={18} className={showAll ? "link-btn__arrow is-up" : "link-btn__arrow"} />
          </button>
        )}
      </div>

      <div className="ratings__summary">
        <div className="ratings__score">
          <span className="ratings__average">{ratings.average.toFixed(1)}</span>
          <Stars value={ratings.average} size={19} />
          <span className="ratings__count">
            ({ratings.count.toLocaleString("en-US")} reviews)
          </span>
        </div>

        <ul className="ratings__bars">
          {ratings.distribution.map((row) => (
            <li key={row.stars} className="bar">
              <span className="bar__label">{row.stars}</span>
              <StarIcon size={14} className="bar__star" />
              <span className="bar__track">
                <span
                  className="bar__fill"
                  style={{ width: `${Math.max(4, (row.count / top) * 100)}%` }}
                />
              </span>
              <span className="bar__value">{row.count.toLocaleString("en-US")}</span>
              <span className="sr-only">
                {((row.count / total) * 100).toFixed(1)} percent of sample ratings
              </span>
            </li>
          ))}
        </ul>
      </div>

      <ul className="reviews">
        {visible.map((review) => (
          <li className="review" key={review.name}>
            <span className={`avatar avatar--${review.tone}`}>{review.initials}</span>
            <div className="review__body">
              <div className="review__meta">
                <span className="review__name">{review.name}</span>
                <MoreIcon size={18} className="review__more" />
              </div>
              <div className="review__line">
                <Stars value={review.stars} size={14} />
                <span className="review__when">{review.when}</span>
              </div>
              <p className="review__text">{review.text}</p>
            </div>
          </li>
        ))}
      </ul>

      {ratings.demo && (
        <p className="ratings__note">
          These ratings and reviews are placeholders shown to demonstrate the layout. They are not
          feedback from real users.
        </p>
      )}
    </section>
  );
}
