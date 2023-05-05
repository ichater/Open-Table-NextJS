import Header from "./components/Header";
import Form from "./components/Form";
import Head from "./head";

export default function Reserve() {
  return (
    <>
      <Head />
      <div className="border-t h-screen">
        <div className="py-9 w-3/5 m-auto">
          <Header />
          <Form />
        </div>
      </div>
    </>
  );
}
