import React from "react";
import Header from "./components/Header";
import Head from "next/head";
import NavBar from "../../components/NavBar";
import AuthContext from "../../context/AuthContext";

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
        <AuthContext>
          <NavBar />
          <Header name={slug} />
          <div className="flex m-auto w-2/3 justify-between items-start 0 -mt-11">
            {children}
          </div>
        </AuthContext>
      </main>
    </>
  );
}
