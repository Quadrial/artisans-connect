// src/components/Modal/Modal.tsx
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center">
          {title && <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>}
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            &times;
          </button>
        </div>
        <div className="mt-2 px-7 py-3">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
