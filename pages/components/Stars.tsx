import React from "react";
import fullStar from "../../public/icons/full-star.png";
import halfStar from "../../public/icons/half-star.png";
import emptyStar from "../../public/icons/empty-star.png";
import Image from "next/image";
import { Review } from "@prisma/client";
import { calculateReviewRatingAverage } from "../../utils/calculateReviewRatingAverage";

export default function Stars({ reviews }: { reviews: Review[] }) {
  const rating = reviews.length > 0 ? calculateReviewRatingAverage(reviews) : 0;
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      const difference = parseFloat((rating - i).toFixed(1));
      if (difference >= 1) stars.push(fullStar);
      else if (difference < 1 && difference > 0) {
        if (difference <= 0.2) stars.push(emptyStar);
        else if (difference > 0.2 && difference <= 0.6) stars.push(halfStar);
        else stars.push(fullStar);
      } else stars.push(emptyStar);
    }
    return stars;
  };
  const starArr = renderStars(rating);
  return (
    <div className="flex items-center">
      {starArr.map((star) => (
        <Image src={star} alt="full star" className="w-4 h-4 mr-1" />
      ))}
    </div>
  );
}
