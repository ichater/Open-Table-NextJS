import RestaurantNavbar from "./components/NavBar";
import Title from "./components/Title";
import Rating from "./components/Rating";
import Description from "./components/Description";
import Images from "./components/Images";
import Reviews from "./components/Reviews";
import ReservationCard from "./components/ReservationCard";
import Layout from "./layout";
import { prisma } from "../../../server/db/client";
import { Review } from "@prisma/client";
import { Time } from "../../../utils/convertToDisplayTime";

export interface Restaurant {
  id: string;
  name: string;
  images: string[];
  description: string;
  slug: string;
  reviews: Review[];
  open_time: string;
  close_time: string;
}

type Props = {
  restaurant: Restaurant;
};

export default function Restaurant({ restaurant }: Props) {
  const { slug, name, images, description, reviews, open_time, close_time } =
    restaurant;
  return (
    <>
      <div className="bg-white w-[70%] rounded p-3 shadow">
        <RestaurantNavbar slug={slug} />
        <Title name={name} />
        <Rating reviews={reviews} />
        <Description description={description} />
        <Images images={images} />
        <Reviews reviews={reviews} />
      </div>
      <div className="w-[27%] relative text-reg">
        <ReservationCard
          openTime={open_time as Time}
          closeTime={close_time as Time}
          slug={slug}
        />
      </div>
    </>
  );
}

export const getServerSideProps = async (context: any) => {
  const { slug } = context.query;
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      images: true,
      description: true,
      slug: true,
      reviews: true,
      open_time: true,
      close_time: true,
    },
  });

  if (!restaurant) {
    context.res.statusCode = 404;
    return { notFound: true };
  }
  return {
    props: {
      restaurant: JSON.parse(JSON.stringify(restaurant)),
    },
  };
};

Restaurant.getLayout = function getLayout(page: JSX.Element, pageProps: Props) {
  const { restaurant } = pageProps;
  return (
    <Layout name={restaurant.name} slug={restaurant.slug}>
      {page}
    </Layout>
  );
};
