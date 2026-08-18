import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "./ScrollToTop.ts";
import LayoutMain from "../layouts/LayoutMain.tsx";
import PageAbout from "../pages/About/PageAbout.tsx";
import PagePortfolio from "../pages/Portfolio/PagePortfolio.tsx";
import PageContact from "../pages/Contact/PageContact.tsx";

const CatModel = () => {
  return (
    <>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <ScrollToTop />
        <Routes>
          <Route element={<LayoutMain />}>
            <Route path="/" element={<PageAbout />} />
            <Route path="/portfolio" element={<PagePortfolio />} />
            <Route path="/contact" element={<PageContact />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default CatModel;
