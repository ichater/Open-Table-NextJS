import Head from "./head";
import Header from "./components/Header";
import RestaurantCard from "./components/RestaurantCard";
import SideBar from "./components/SideBar";
import { prisma } from "../../server/db/client";

export default function search({ restaurants }: any) {
  console.log(restaurants);
  return (
    <>
      <Head />
      <Header />
      <div className="flex py-4 m-auto w-2/3 justify-between items-start">
        <SideBar />
        <div className="w-5/6">
          <RestaurantCard />
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = async (context: any) => {
  const { city } = context.query;
  if (!city) return { props: { restaurants: [] } };

  const restaurants = await prisma.restaurant.findMany({
    where: {
      location: {
        name: {
          equals: city.toLowerCase(),
        },
      },
    },
    select: {
      id: true,
      name: true,
      main_image: true,
      slug: true,
      cuisine: true,
      location: true,
      price: true,
    },
  });

  return {
    props: {
      restaurants: JSON.parse(JSON.stringify(restaurants)),
    },
  };
};
