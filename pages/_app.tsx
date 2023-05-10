import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import "../styles/globals.css";
import type { AppProps } from "next/app";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

interface MyAppProps extends AppProps {
  Component: any & {
    getLayout?: (page: React.ReactNode, props: any) => React.ReactNode;
  };
}

export default function App({ Component, pageProps }: MyAppProps) {
  const getLayout = Component.getLayout ?? ((page: React.ReactNode) => page);
  return getLayout(<Component {...pageProps} />, pageProps);
}
