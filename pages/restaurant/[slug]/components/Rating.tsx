import React from "react";
import Stars from "../../../components/Stars";
import { calculateReviewRatingAverage } from "../../../../utils/calculateReviewRatingAverage";

export default function Rating({ reviews }: any) {
  const reviewAverage = calculateReviewRatingAverage(reviews);
  return (
    <div className="flex items-end">
      <div className="ratings mt-2 flex items-center">
        {reviewAverage ? <Stars reviews={reviews} /> : null}
        <p className="text-reg ml-3">{reviewAverage ? reviewAverage : null}</p>
      </div>
      <div>
        <p className={reviewAverage ? "text-reg ml-4" : "text-reg ml-1"}>
          {reviews.length ? reviews.length : 0} Reviews
        </p>
      </div>
    </div>
  );
}
