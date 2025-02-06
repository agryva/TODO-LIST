import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            onClick={handleOutsideClick}
        >
            <div
                className="bg-white p-6 rounded-lg shadow-lg w-full md:w-1/2 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="absolute top-3 right-[1.3rem] text-gray-600 hover:text-gray-900"
                    onClick={onClose}
                >
                    ✕
                </button>

                {children}
            </div>
        </div>
    );
}

export default Modal;