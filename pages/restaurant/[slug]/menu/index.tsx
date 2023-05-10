import Layout from "../layout";
import RestaurantNavbar from "../components/NavBar";
import Menu from "../components/Menu";
import { prisma } from "../../../../server/db/client";

export default function ResturantMenu({ restaurant }: any) {
  const { slug, name, items } = restaurant;
  return (
    <>
      <Layout name={name} slug={slug}>
        <div className="bg-white w-[100%] rounded p-3 shadow">
          <RestaurantNavbar slug={slug} />
          <Menu items={items} />
        </div>
      </Layout>
    </>
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
