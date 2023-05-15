import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>OpenTable</title>
        <link rel="icon" href="/search.ico" />
      </Head>
      <body>
        <main className="bg-gray-100 min-h-screen w-screen">
          <main className="max-w-screen-2xl m-auto bg-white">
            <Main />{" "}
          </main>
        </main>
        <NextScript />{" "}
      </body>
    </Html>
  );
}
