import React, { Suspense } from "react";
import Header from "./components/Header";
import Head from "next/head";
import Loading from "./loading";

export default function RestaurantLayout({
  children,
  name,
  slug,
}: {
  children: JSX.Element;
  name: string;
  slug: string;
}) {
  return (
    <>
      <Head>
        <title>{name}</title>
        <link rel="icon" href="" />
      </Head>
      <main>
        <Header name={slug} />
        <Suspense fallback={<Loading />}>
          <div className="flex m-auto w-2/3 justify-between items-start 0 -mt-11">
            {children}
          </div>
        </Suspense>
      </main>
    </>
  );
}
