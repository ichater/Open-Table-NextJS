import { Cuisine, Location, PRICE } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

type Props = {
  cuisines: Cuisine[];
  locations: Location[];
};

export default function SideBar({ cuisines, locations }: Props) {
  const router = useRouter();

  const prices = [
    { price: PRICE.CHEAP, label: "$" },
    { price: PRICE.REGULAR, label: "$$" },
    { price: PRICE.EXPENSIVE, label: "$$$" },
  ];

  const handleLocationClick = (locationName: string) => {
    router.push({
      pathname: "/search",
      query: {
        ...router.query,
        city: locationName,
      },
    });
  };

  const handleCuisineClick = (cuisineName: string) => {
    router.push({
      pathname: "/search",
      query: {
        ...router.query,
        cuisine: cuisineName,
      },
    });
  };

  const handlePriceClick = (price: string) => {
    router.push({
      pathname: "/search",
      query: {
        ...router.query,
        price,
      },
    });
  };

  return (
    <div className="w-1/5">
      <div className="border-b pb-4">
        <h1 className="mb-2">Region</h1>
        {locations.map((location) => (
          <div key={location.id}>
            <button
              className="font-light text-reg capitalize"
              onClick={() => handleLocationClick(location.name)}
            >
              {location.name}
            </button>
          </div>
        ))}
      </div>
      <div className="border-b pb-4 mt-3">
        <h1 className="mb-2">Cuisine</h1>
        {cuisines.map((cuisine) => (
          <div key={cuisine.id}>
            <button
              className="font-light text-reg capitalize"
              onClick={() => handleCuisineClick(cuisine.name)}
            >
              {cuisine.name}
            </button>
          </div>
        ))}
      </div>
      <div className="mt-3 pb-4">
        <h1 className="mb-2">Price</h1>
        <div className="flex">
          {prices.map((price) => (
            <button
              key={price.price}
              className="border w-full text-reg font-light rounded-l p-2"
              onClick={() => {
                handlePriceClick(price.price.toLocaleLowerCase());
              }}
            >
              {price.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
