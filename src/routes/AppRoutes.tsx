import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ScrollToTop } from "./ScrollToTop.ts";
import LayoutMain from "../layouts/LayoutMain.tsx";
import PageAbout from "../pages/about/PageAbout.tsx";
import PagePortfolio from "../pages/portfolio/PagePortfolio.tsx";
import PageBox from "../pages/box/PageBox.tsx";
import Encyclopedia from "../pages/box/Encyclopedia.tsx";
import Films from "../pages/box/Films.tsx";
import PageContact from "../pages/contact/PageContact.tsx";
import Page404 from "../pages/404/Page404.tsx";
const CatModel = () => {
  return (
    <>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <ScrollToTop />
        <Routes>
          <Route element={<LayoutMain />}>
            <Route path="/" element={<PageAbout />} />
            <Route path="/portfolio" element={<PagePortfolio />} />
            <Route path="/box" element={<PageBox />}>
              <Route index element={<Navigate to="encyclopedia" replace />} />
              <Route path="encyclopedia" element={<Encyclopedia />} />
              <Route path="films" element={<Films />} />
            </Route>
            <Route path="/contact" element={<PageContact />} />
          </Route>
          <Route path="*" element={<Page404 />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default CatModel;
