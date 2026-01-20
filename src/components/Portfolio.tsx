import { useTranslation } from "react-i18next";
import { useState } from "react";
import photo from "../ts/photo";
import Modal from "./Modal.tsx";

const Portfolio = () => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  
  // put the images evenly into two columns
  const half = Math.ceil(photo.length / 2);
  const left = photo.slice(0, half);
  const right = photo.slice(half);

  return (
    <>
    <div className="padding-64 content" id="photos">
      <h2 className="text-light-grey">{t("photo.title")}</h2>
      <hr style={{width:'200px'}} className="opacity" />

      <div className="row-padding" style={{margin:'0 -16px'}}>
        <div className="half">
        {left.map(({ src, altKey }, idx) => {
              const realIndex = idx;
              return (
                <img
                  key={realIndex}
                  src={src}
                  alt={altKey}
                  style={{ width: "100%", cursor: "pointer" }}
                  loading="lazy"
                  onClick={() => setCurrentIndex(realIndex)}
                />
              );
            })}
        </div>

        <div className="half">
        {right.map(({ src, altKey }, idx) => {
              const realIndex = idx + left.length;
              return (
                <img
                  key={realIndex}
                  src={src}
                  alt={altKey}
                  style={{ width: "100%", cursor: "pointer" }}
                  loading="lazy"
                  onClick={() => setCurrentIndex(realIndex)}
                />
              );
            })}
        </div>
      </div>
    </div>
    
    {/* Modal */}
    {currentIndex !== null && (
      <Modal
        photos={photo}
        index={currentIndex}
        onClose={() => setCurrentIndex(null)}
        onChange={setCurrentIndex}
      />
    )}
    </>
  );
}

export default Portfolio
