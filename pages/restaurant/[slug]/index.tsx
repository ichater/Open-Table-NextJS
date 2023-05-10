import RestaurantNavbar from "./components/NavBar";
import Title from "./components/Title";
import Rating from "./components/Rating";
import Description from "./components/Description";
import Images from "./components/Images";
import Reviews from "./components/Reviews";
import ReservationCard from "./components/ReservationCard";
import Layout from "./layout";
import { prisma } from "../../../server/db/client";

export default function Restaurant({ restaurant }: any) {
  const { slug, name, images, description } = restaurant;
  return (
    <>
      <Layout name={name} slug={slug}>
        <div className="bg-white w-[70%] rounded p-3 shadow">
          <RestaurantNavbar slug={slug} />
          <Title name={name} />
          <Rating />
          <Description description={description} />
          <Images images={images} />
          <Reviews />
        </div>
        <div className="w-[27%] relative text-reg">
          <ReservationCard />
        </div>
      </Layout>
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
    },
  });

  if (!restaurant) {
    throw new Error();
  }
  return {
    props: {
      restaurant: JSON.parse(JSON.stringify(restaurant)),
    },
  };
};
