import { Review } from "@prisma/client";

export const calculateReviewRatingAverage = (reviews: Review[]): number =>
  reviews.map((review) => review.rating).reduce((acc, cur) => acc + cur) /
  reviews.length;
