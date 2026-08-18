import { Outlet } from "react-router-dom";
import MyHelmet from "./Helmet.tsx";
import NavbarMain from "./NavbarMain.tsx";
import Footer from "./Footer.tsx";

const LayoutMain = () => {
  return (
    <>
      <MyHelmet />
      <NavbarMain />
      <main>
        <Outlet />
      </main>
      <div className="padding-large">
        <Footer />
      </div>
    </>
  );
};

export default LayoutMain;
