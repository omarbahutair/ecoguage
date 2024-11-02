import { useEffect } from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
  children?: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  useEffect(() => {
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };

    window.addEventListener('keydown', onEscape);

    return () => {
      window.removeEventListener('keydown', onEscape);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className={`fixed inset-0 bg-black bg-opacity-30 z-[999999] flex items-center justify-center p-4 opacity-0 ${isOpen ? 'animate-fade-in' : 'animate-fade-out'}`}
      onClick={onClose}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="min-w-full sm:min-w-[512px] w-fit p-8 bg-white relative rounded"
      >
        <button onClick={onClose} className="absolute top-2 right-3">
          <i className="fa-solid fa-xmark text-xl" />
        </button>
        {children}
      </div>
    </div>,
    document.getElementById('modal') as HTMLElement,
  );
}
