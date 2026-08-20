import { ContactsProvider } from "./ContactsProvider";
import UseTodosContext from "./ContactsUseContext";
import { useTranslation } from "react-i18next";

function Contacts() {
  const { t } = useTranslation();

  return (
    <div className="content padding-32">
      <h2 className="padding-16">{t("messages.title")}</h2>
      <ContactsProvider>
        <UseTodosContext />
      </ContactsProvider>
    </div>
  );
}

export default Contacts;
