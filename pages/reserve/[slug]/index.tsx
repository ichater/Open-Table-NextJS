import Header from "./components/Header";
import Form from "./components/Form";
import Head from "./head";
import { prisma } from "../../../server/db/client";
import { Review } from "@prisma/client";
import { useRouter } from "next/router";

export interface Restaurant {
  id: string;
  name: string;
  images: string[];
  description: string;
  slug: string;
  reviews: Review[];
  open_time: string;
  close_time: string;
  main_image: string;
}
type Props = {
  restaurant: Restaurant;
  slug: string;
};

export default function Reserve({ restaurant }: Props) {
  const router = useRouter();
  const { date, partySize } = router.query;
  console.log(date);
  const confirmedPartySize: string =
    typeof partySize === "string" ? partySize : partySize ? partySize[0] : "";
  return (
    <>
      <Head />
      <div className="border-t h-screen">
        <div className="py-9 w-3/5 m-auto">
          <Header
            image={restaurant.main_image}
            name={restaurant.name}
            date={typeof date === "string" ? date : date ? date[0] : ""}
            partySize={confirmedPartySize}
          />
          <Form />
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context: any) {
  const { slug } = context.query;

  const restaurant = await prisma.restaurant.findUnique({
    where: { slug },
  });
  if (!restaurant) {
    context.res.statusCode = 404;
    return { notFound: true };
  }

  return {
    props: {
      restaurant: JSON.parse(JSON.stringify(restaurant)),
      slug,
    },
  };
}
