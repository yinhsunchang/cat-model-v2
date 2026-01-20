import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

interface ModalProps {
  photos: {
    src: string;
    altKey: string;
  }[];
  index: number;
  onClose: () => void;
  onChange: (next: number) => void;
}

const Modal = ({ photos, index, onClose, onChange }: ModalProps) => {
  const { t } = useTranslation();

  const startX = useRef<number | null>(null);
  const photo = photos[index];

  /* Previous / Next arrows + ESC */
  const prev = () => onChange((index - 1 + photos.length) % photos.length);
  const next = () => onChange((index + 1) % photos.length);
  
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [index]);

  /* Swipe gestures */
  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current === null) return;
    const diff = e.changedTouches[0].clientX - startX.current;
    if (diff > 50) prev();
    if (diff < -50) next();
    startX.current = null;
  };

  return (
    <div className="modal black" onClick={onClose}>
      <div
        className="modal-content animate-zoom center transparent padding-64"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Close (X) button */}
        <span className="button large black display-topright" onClick={onClose}>
          <i className="fa fa-remove"></i>
        </span>
        
        {/* Previous / Next arrows */}
        <span className="button left large black display-left" onClick={prev} style={{ cursor: "pointer" }}>
          &#10094;
        </span>
        <span className="button right large black display-right" onClick={next} style={{ cursor: "pointer" }}>
          &#10095;
        </span>

        {/* Image captions */}
        <img src={photo.src} alt={t(photo.altKey)} className="image" />
        <p className="opacity large">{t(photo.altKey)}</p>

        {/* Thumbnail strip */}
        <div className="thumb-strip" onClick={(e) => e.stopPropagation()}>
          {photos.map((p, i) => (
            <img 
            key={i} src={p.src} alt={t(p.altKey)}
            className={`thumb ${i === index ? "active" : ""}`}
            onClick={() => onChange(i)}
          />
          ))}
        </div>

      </div>
    </div>
  );
};


export default Modal
