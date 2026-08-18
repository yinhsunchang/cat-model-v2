import Reservation from "./Reservation.tsx";
import { useTranslation } from "react-i18next";

interface PricePlanProps {
  title: string;
  price: number;
  unit: string;
}

function PricePlan({ title, price, unit }: PricePlanProps) {
  return (
    <div className="half margin-bottom">
      <ul className="ul white center hover-opacity-off">
        <li className="dark-grey xlarge padding-32">{title}</li>
        <li className="padding-16">
          <h2>$ {price}</h2>
          <span className="opacity">{unit}</span>
        </li>
        <li className="light-grey padding-24">
          <Reservation />
        </li>
      </ul>
    </div>
  );
}

function PriceCard() {
  const { t } = useTranslation();

  const plans = [
    {
      title: t("about.price.plan1"),
      price: 20,
      unit: t("about.price.unit"),
    },
    {
      title: t("about.price.plan2"),
      price: 30,
      unit: t("about.price.unit"),
    },
  ];

  return (
    <>
      <h3 className="padding-16">{t("about.price.title")}</h3>
      <div className="row-padding" style={{ margin: "0 -16px" }}>
        {plans.map((plan) => (
          <PricePlan
            key={plan.title}
            title={plan.title}
            price={plan.price}
            unit={plan.unit}
          ></PricePlan>
        ))}
      </div>
    </>
  );
}

export default PriceCard;
