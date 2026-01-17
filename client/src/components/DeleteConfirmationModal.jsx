import React from 'react';
import Modal from './Modal';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, productName }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Delete Product" maxWidth="max-w-sm">
            <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">Are you sure?</h3>
                <p className="text-sm text-gray-500 mb-6">
                    You are about to delete <strong>{productName}</strong>. This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-center">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 rounded-lg text-white hover:bg-red-700 font-medium"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default DeleteConfirmationModal;
