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
  main_image: string;
}

type Props = {
  restaurants: Restaurant[];
  cuisines: Cuisine[];
  locations: Location[];
};

export default function search({ restaurants, cuisines, locations }: Props) {
  return (
    <>
      <Head />
      <Header />
      <div className="flex py-4 m-auto w-2/3 justify-between items-start">
        <SideBar cuisines={cuisines} locations={locations} />
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
  const cuisines = await prisma.cuisine.findMany();

  const locations = await prisma.location.findMany();

  const cuisineLocationObject = {
    cuisines: JSON.parse(JSON.stringify(cuisines)),
    locations: JSON.parse(JSON.stringify(locations)),
  };

  const { city } = query;

  if (!city)
    return {
      props: {
        restaurants: [],
        ...cuisineLocationObject,
      },
    };
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
      main_image: true,
    },
  });

  return {
    props: {
      restaurants: JSON.parse(JSON.stringify(restaurants)),
      ...cuisineLocationObject,
    },
  };
};
