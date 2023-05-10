import React from "react";
import Header from "./components/Header";
import Head from "next/head";

export default function RestaurantLayout({ children, name, slug }: any) {
  return (
    <>
      <Head>
        <title>{name}</title>
        <link rel="icon" href="" />
      </Head>
      <main>
        <Header name={slug} />
        <div className="flex m-auto w-2/3 justify-between items-start 0 -mt-11">
          {children}
        </div>
      </main>
    </>
  );
}
