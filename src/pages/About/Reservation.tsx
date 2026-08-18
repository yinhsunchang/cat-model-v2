import { useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "./Modal";
import ReservationForm from "./ReservationForm";

const Reservation = () => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="button black padding-large"
        onClick={() => setOpen(true)}
      >
        {t("about.price.reserve")}
      </button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="container black">
          <button
            type="button"
            aria-label="Close reservation"
            className="button display-topright large"
            onClick={() => setOpen(false)}
          >
            <i className="fa fa-times xlarge" aria-hidden="true" />
          </button>
          <h1>{t("about.reserve.title")}</h1>
        </div>

        <div className="container">
          <p className="padding light-grey">{t("about.reserve.notice")}</p>
          <ReservationForm />
        </div>
      </Modal>
    </>
  );
};

export default Reservation;
