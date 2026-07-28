import { useTranslation } from "react-i18next";
import { useState } from "react";
import Reveal from "./Reveal.tsx";
import photos from "../services/photos.ts";
import ModalPhoto from "./ModalPhoto.tsx";

const Portfolio = () => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const half = Math.ceil(photos.length / 2);
  const left = photos.slice(0, half);
  const right = photos.slice(half);

  const renderPhotos = (items: typeof photos, offset = 0) =>
    items.map((photo, idx) => (
      <Reveal key={photo.id}>
        <button
          type="button"
          onClick={() => setCurrentIndex(idx + offset)}
          style={{ padding: 0, border: 0, background: "none" }}
        >
          <img
            src={photo.src}
            alt={photo.alt}
            style={{ width: "100%", cursor: "pointer" }}
            loading="lazy"
          />
        </button>
      </Reveal>
    ));

  return (
    <>
      <div className="padding-64 content text-light-grey" id="photos">
        <h2>{t("photo.title")}</h2>
        <hr style={{ width: "200px" }} className="opacity" />
        <div className="row-padding" style={{ margin: "0 -16px" }}>
          <div className="half">{renderPhotos(left)}</div>
          <div className="half">{renderPhotos(right, half)}</div>
        </div>
      </div>

      {currentIndex !== null && (
        <ModalPhoto
          photos={photos}
          index={currentIndex}
          onClose={() => setCurrentIndex(null)}
          onChange={setCurrentIndex}
        />
      )}
    </>
  );
};

export default Portfolio;
