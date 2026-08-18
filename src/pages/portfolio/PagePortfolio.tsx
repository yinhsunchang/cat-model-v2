import { Suspense, lazy } from "react";
import HeaderPortfolio from "./HeaderPortfolio.tsx";
import { useTranslation } from "react-i18next";

const Portfolio = lazy(() => import("./Portfolio.tsx"));

const PagePortfolio = () => {
  const { t } = useTranslation();

  return (
    <>
      <HeaderPortfolio />
      <div className="padding-large">
        <Suspense
          fallback={
            <div className="large center">
              <i className="fa fa-refresh fa-spin large margin-right" />
              {t("loading")}
            </div>
          }
        >
          <Portfolio />
        </Suspense>
      </div>
    </>
  );
};

export default PagePortfolio;
