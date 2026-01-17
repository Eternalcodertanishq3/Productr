import React from 'react';
import { TrashIcon, PencilIcon } from './Icons';

const ProductCard = ({ product, onEdit, onDelete, onTogglePublish }) => {

    // Fallback Image
    // If the image is a data URL (base64) or a full http URL, use it.
    // If it's a filename like "image.png", we assume it's in public folder.
    const imageSrc = (product.images && product.images.length > 0)
        ? product.images[0]
        : '/product-demo-1.png'; // Make the fallback one of the demo images if available

    return (
        <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-xl hover:-translate-y-1 transition duration-300 relative ring-1 ring-gray-950/5">
            {/* Image Area */}
            <div className="relative h-48 bg-gray-50 flex items-center justify-center p-4">
                <img src={imageSrc} alt={product.name} className="max-h-full object-contain" />
                {/* Dots indicator mimicking carousel if multiple */}
                {product.images && product.images.length > 1 && (
                    <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                        {product.images.map((_, i) => (
                            <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
                        ))}
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-bold text-gray-900 mb-4 line-clamp-1" title={product.name}>{product.name}</h3>

                <div className="space-y-3 text-sm text-gray-400 flex-1">
                    <div className="flex justify-between items-center">
                        <span>Product type -</span>
                        <span className="text-[#344054] text-base">{product.type}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Quantity Stock -</span>
                        <span className="text-[#344054] text-base">{product.stock}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>MRP -</span>
                        <span className="text-[#344054] text-base font-medium">₹ {product.mrp}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Selling Price -</span>
                        <span className="text-[#344054] text-base font-medium">₹ {product.sellingPrice}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Brand Name -</span>
                        <span className="text-[#344054] text-base">{product.brand}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span>Total Number of images -</span>
                        <span className="text-[#344054] text-base">{product.images ? product.images.length : 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Exchange Eligibility -</span>
                        <span className="text-[#344054] text-base font-medium uppercase">{product.exchangeEligible}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex gap-2">
                    <button
                        onClick={() => onTogglePublish(product)}
                        className={`flex-1 py-2 rounded-lg text-sm font-semibold transition
                        ${product.isPublished
                                ? 'bg-[#40C010] hover:bg-green-600 text-white' // Publish Button Green
                                : 'bg-[#101460] hover:bg-blue-900 text-white'   // Publish Button Blue
                            }`}
                    >
                        {product.isPublished ? 'Unpublish' : 'Publish'}
                    </button>

                    <button
                        onClick={() => onEdit(product)}
                        className="flex-1 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-2"
                    >
                        <PencilIcon />
                        Edit
                    </button>

                    <button
                        onClick={() => onDelete(product)}
                        className="w-10 flex items-center justify-center border border-gray-200 rounded-lg text-gray-400 hover:text-red-500 hover:border-red-200 transition"
                    >
                        <TrashIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
