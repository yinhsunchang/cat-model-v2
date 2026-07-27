import { createPortal } from "react-dom";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ open, onClose, children }: ModalProps) {
  if (!open) return null;

  return createPortal(
    <div className="modal dark-grey padding" onClick={onClose}>
      <div
        className="modal-content animate-zoom mobile"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}
