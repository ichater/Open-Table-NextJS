import Layout from "../layout";
import RestaurantNavbar from "../components/NavBar";
import Menu from "../components/Menu";
import { prisma } from "../../../../server/db/client";
import { Item } from "@prisma/client";

interface MenuData {
  id: string;
  name: string;
  items: Item[];
  slug: string;
}

type Props = {
  restaurant: MenuData;
};

export default function ResturantMenu({ restaurant }: Props) {
  const { slug, items } = restaurant;
  return (
    <div className="bg-white w-[100%] rounded p-3 shadow">
      <RestaurantNavbar slug={slug} />
      <Menu items={items} />
    </div>
  );
}

export const getServerSideProps = async (context: any) => {
  const { slug } = context.query;
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      items: true,
      slug: true,
    },
  });

  if (!restaurant) {
    throw new Error();
  }
  return {
    props: {
      restaurant: JSON.parse(JSON.stringify(restaurant)),
    },
  };
};

ResturantMenu.getLayout = function getLayout(
  page: JSX.Element,
  pageProps: Props
) {
  const { name, slug } = pageProps.restaurant;
  return (
    <Layout name={name} slug={slug}>
      {page}
    </Layout>
  );
};
