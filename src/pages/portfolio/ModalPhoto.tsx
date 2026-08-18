import { useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import type { Photo } from "../../types/photo";

interface ModalPhotoProps {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onChange: (next: number) => void;
}

const ModalPhoto = ({ photos, index, onClose, onChange }: ModalPhotoProps) => {
  const { t } = useTranslation();

  const startX = useRef<number | null>(null);
  const thumbRefs = useRef<(HTMLImageElement | null)[]>([]);
  const stripRef = useRef<HTMLDivElement | null>(null);
  const photo = photos[index];

  /* Previous / Next arrows + ESC */
  const prev = useCallback(
    () => onChange((index - 1 + photos.length) % photos.length),
    [index, photos.length, onChange]
  );
  const next = useCallback(
    () => onChange((index + 1) % photos.length),
    [index, photos.length, onChange]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          prev();
          break;
        case "ArrowRight":
          next();
          break;
      }
    };

    window.addEventListener("keydown", handler);

    return () => window.removeEventListener("keydown", handler);
  }, [onClose, prev, next]);

  useEffect(() => {
    const strip = stripRef.current;
    const thumb = thumbRefs.current[index];

    if (!strip || !thumb) return;

    const left = thumb.offsetLeft - (strip.clientWidth - thumb.clientWidth) / 2;

    strip.scrollTo({
      left: Math.max(0, left),
      behavior: "smooth",
    });
  }, [index]);

  if (!photo) return null;

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
    <div
      className="modal black"
      role="dialog"
      aria-modal="true"
      aria-label={t(photo.alt)}
      onClick={onClose}
    >
      <div
        className="modal-content animate-zoom center transparent padding-64 mobile"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Close (X) button */}
        <button
          className="button large black display-topright"
          onClick={onClose}
          aria-label="Close"
        >
          <i className="fa fa-remove"></i>
        </button>

        {/* Previous / Next arrows */}
        <button
          className="button left large black display-left"
          onClick={prev}
          aria-label="Previous photo"
        >
          &#10094;
        </button>
        <button
          className="button right large black display-right"
          onClick={next}
          aria-label="Next photo"
        >
          &#10095;
        </button>

        {/* Image captions */}
        <img
          src={photo.src}
          alt={t(photo.alt)}
          className="image"
          data-testid="main-photo"
        />
        <p className="opacity large">{t(photo.alt)}</p>

        {/* Thumbnail strip */}
        <div
          ref={stripRef}
          className="thumb-strip"
          onClick={(e) => e.stopPropagation()}
        >
          {photos.map((photo, thumbIndex) => (
            <img
              ref={(el) => {
                thumbRefs.current[thumbIndex] = el;
              }}
              key={photo.id}
              src={photo.src}
              alt={t(photo.alt)}
              className={`thumb ${thumbIndex === index ? "active" : ""}`}
              onClick={() => onChange(thumbIndex)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModalPhoto;
