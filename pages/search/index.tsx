import Head from "./head";
import Header from "./components/Header";
import RestaurantCard from "./components/RestaurantCard";
import SideBar from "./components/SideBar";
import { prisma } from "../../server/db/client";
import { Cuisine, Location, PRICE } from "@prisma/client";
import { GetServerSideProps } from "next";

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  cuisine: Cuisine;
  location: Location;
  price: PRICE;
}

type Props = {
  restaurants: Restaurant[];
};

export default function search({ restaurants }: Props) {
  console.log(restaurants);
  return (
    <>
      <Head />
      <Header />
      <div className="flex py-4 m-auto w-2/3 justify-between items-start">
        <SideBar />
        <div className="w-5/6">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<{
  restaurants: Restaurant[];
}> = async ({ query }) => {
  const { city } = query;
  if (!city) return { props: { restaurants: [] } };

  const restaurants = await prisma.restaurant.findMany({
    where: {
      location: {
        name: {
          equals: Array.isArray(city)
            ? city[0].toLowerCase()
            : city.toLowerCase(),
        },
      },
    },
    select: {
      id: true,
      name: true,
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
