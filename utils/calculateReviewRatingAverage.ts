import { Review } from "@prisma/client";

export const calculateReviewRatingAverage = (reviews: Review[]): number =>
  reviews.length > 0
    ? reviews.map((review) => review.rating).reduce((acc, cur) => acc + cur) /
      reviews.length
    : 0;
