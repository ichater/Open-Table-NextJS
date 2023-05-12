import Link from "next/link";
import { Restaurant } from "..";
import Price from "../../components/Price";
import { calculateReviewRatingAverage } from "../../../utils/calculateReviewRatingAverage";

type Props = {
  restaurant: Restaurant;
};
export default function RestaurantCard({ restaurant }: Props) {
  const { name, cuisine, location, price, main_image, reviews } = restaurant;
  console.log(reviews[0] ? reviews[0].rating : "not here");

  const reviewRatingString = (rating: number): string => {
    if (rating > 0 && rating < 1) return "Its shit";
    if (rating > 1 && rating < 2) return "Its not the best";
    if (rating > 2 && rating < 3) return "Mediocre";
    if (rating > 3 && rating < 4) return "Getting there";
    if (rating > 4 && rating < 5) return "Very good";
    if (rating === 5) return "Do not miss it!";
    return "No ratings";
  };

  const ratingText =
    reviews.length > 0
      ? reviewRatingString(calculateReviewRatingAverage(reviews))
      : "No reviews";

  return (
    <div className="border-b flex pb-5">
      <img src={main_image} alt="" className="w-44 rounded" />
      <div className="pl-5">
        <h2 className="text-3xl">{name}</h2>
        <div className="flex items-start">
          <div className="flex mb-2">*****</div>
          <p className="ml-2 text-sm">{ratingText}</p>
        </div>
        <div className="mb-9">
          <div className="font-light flex text-reg">
            <Price price={price} />
            <p className="mr-4">{cuisine.name}</p>
            <p className="mr-4">{location.name}</p>
          </div>
        </div>
        <div className="text-red-600">
          <Link href="">View more information</Link>
        </div>
      </div>
    </div>
  );
}
