import Layout from "../layout";
import RestaurantNavbar from "../components/NavBar";
import Menu from "../components/Menu";

export default function ResturantMenu() {
  return (
    <>
      <div className="bg-white w-[100%] rounded p-3 shadow">
        <RestaurantNavbar />
        <Menu />
      </div>
    </>
  );
}

ResturantMenu.getLayout = function getLayout(page: JSX.Element) {
  return <Layout pageTitle="Restaurant menu">{page}</Layout>;
};
