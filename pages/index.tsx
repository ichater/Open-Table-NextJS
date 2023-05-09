import Header from "./components/Header";
import RestaurantCard from "./components/RestaurantCard";
import { prisma } from "../server/db/client";
import { Cuisine, Location, PRICE } from "@prisma/client";

export type RestaurantCardType = {
  id: number;
  name: string;
  main_image: string;
  cuisine: Cuisine;
  location: Location;
  price: PRICE;
  slug: string;
};

type Props = {
  restaurants: RestaurantCardType[];
};

export default function Home({ restaurants }: Props) {
  return (
    <main>
      <Header />
      <div className="py-3 px-36 mt-10 flex flex-wrap justify-center">
        {restaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </div>
    </main>
  );
}

// export default Home;

export async function getServerSideProps() {
  const restaurants = await prisma.restaurant.findMany({
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
}
