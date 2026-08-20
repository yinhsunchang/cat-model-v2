import { Outlet } from "react-router-dom";
import SidebarAdmin from "./SidebarAdmin.tsx";
import NavbarAdmin from "./NavbarAdmin.tsx";
import Footer from "./Footer.tsx";

const LayoutAdmin = () => {
  return (
    <>
      <SidebarAdmin />
      <NavbarAdmin />
      <div className="padding-large" id="main">
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default LayoutAdmin;
