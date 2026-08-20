import { SubscribersProvider } from "./SubscribersProvider";
import SubscribersUseContext from "./SubscribersUseContext";
import { useTranslation } from "react-i18next";

function Subscribers() {
  const { t } = useTranslation();

  return (
    <div className="content padding-32">
      <h2 className="padding-16">{t("subscribers.title")}</h2>
      <SubscribersProvider>
        <SubscribersUseContext />
      </SubscribersProvider>
    </div>
  );
}

export default Subscribers;
