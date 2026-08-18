import { useTranslation } from "react-i18next";
import CountUp from "react-countup";

interface StatCardProps {
  value: number;
  label: string;
}

function StatItem({ value, label }: StatCardProps) {
  return (
    <div className="quarter section">
      <span className="xlarge">
        <CountUp end={value} duration={5} autoAnimate autoAnimateDelay={1000} />
        +
      </span>
      <br />
      {label}
    </div>
  );
}

function StatCard() {
  const { t } = useTranslation();

  const stats = [
    {
      id: 0,
      value: 18,
      label: t("about.stats.partners"),
    },
    {
      id: 1,
      value: 68,
      label: t("about.stats.projects"),
    },
    {
      id: 2,
      value: 39,
      label: t("about.stats.clients"),
    },
    {
      id: 3,
      value: 53,
      label: t("about.stats.meetings"),
    },
  ];

  return (
    <div className="row center padding-16 section light-grey">
      {stats.map((stat) => (
        <StatItem key={stat.id} value={stat.value} label={stat.label} />
      ))}
    </div>
  );
}

export default StatCard;
