import React from "react";
import Header from "./components/Header";
import Head from "next/head";

export default function RestaurantLayout({
  children,
  pageTitle = "null",
}: {
  children: React.ReactNode;
  pageTitle: string;
}) {
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <link rel="icon" href="" />
      </Head>
      <main>
        <Header />
        <div className="flex m-auto w-2/3 justify-between items-start 0 -mt-11">
          {children}
        </div>
      </main>
    </>
  );
}
