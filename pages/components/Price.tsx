import { PRICE } from "@prisma/client";
import React from "react";

export default function Price({ price }: { price: PRICE }) {
  const renderPrice = (pri: PRICE) => {
    if (pri === PRICE.CHEAP) {
      return (
        <>
          <span>$$</span>
          <span className="text-gray-400">$$</span>
        </>
      );
    }
    if (pri === PRICE.REGULAR) {
      return (
        <>
          <span>$</span>
          <span className="text-gray-400">$$$</span>
        </>
      );
    }
    if (pri === PRICE.EXPENSIVE) {
      return <span>$$$$</span>;
    }
  };
  return <p className="flex mr-3">{renderPrice(price)}</p>;
}
