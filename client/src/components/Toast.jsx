import React, { useEffect } from 'react';
import { Check, Warning, X } from 'phosphor-react';

const Toast = ({ message, type = 'success', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const icons = {
        success: (
            <div className="bg-[#10B981] rounded text-white p-0.5">
                <Check weight="bold" size={12} />
            </div>
        ),
        error: (
            <div className="bg-red-500 rounded text-white p-0.5">
                <X weight="bold" size={12} />
            </div>
        ),
        info: (
            <div className="bg-blue-500 rounded text-white p-0.5">
                <Warning weight="bold" size={12} />
            </div>
        )
    };

    return (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-[9999] bg-white shadow-xl rounded-md px-4 py-2.5 flex items-center gap-3 min-w-[300px] border border-gray-100 animate-slideUp">
            <div className="flex-shrink-0">
                {icons[type]}
            </div>
            <div className="flex-1">
                <p className="text-[#344054] font-medium text-sm">{message}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 ml-2">
                <X size={16} />
            </button>
        </div>
    );
};

export default Toast;
