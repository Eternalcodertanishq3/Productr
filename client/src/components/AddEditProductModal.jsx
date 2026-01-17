import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { X, UploadSimple } from 'phosphor-react';
import api from '../services/api';
import Toast from './Toast';

const AddEditProductModal = ({ isOpen, onClose, onSuccess, productToEdit }) => {
    const isEdit = !!productToEdit;
    const [toast, setToast] = useState(null); // { message, type }

    const [formData, setFormData] = useState({
        name: '',
        type: '',
        stock: '',
        mrp: '',
        sellingPrice: '',
        brand: '',
        images: [],
        exchangeEligible: 'Yes'
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (productToEdit) {
            setFormData({
                name: productToEdit.name || '',
                type: productToEdit.type || '',
                stock: productToEdit.stock || '',
                mrp: productToEdit.mrp || '',
                sellingPrice: productToEdit.sellingPrice || '',
                brand: productToEdit.brand || '',
                images: productToEdit.images || [],
                exchangeEligible: productToEdit.exchangeEligible || 'Yes'
            });
        } else {
            // Reset
            setFormData({
                name: '', type: '', stock: '', mrp: '', sellingPrice: '', brand: '', images: [], exchangeEligible: 'Yes'
            });
        }
        setErrors({});
    }, [productToEdit, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);

        // Convert to Base64
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, images: [...prev.images, reader.result] }));
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = "Please enter product name";
        if (!formData.type) newErrors.type = "Please select product type";
        if (!formData.stock) newErrors.stock = "Please enter stock";
        if (!formData.mrp) newErrors.mrp = "Please enter MRP";
        if (!formData.sellingPrice) newErrors.sellingPrice = "Please enter Selling Price";
        if (!formData.brand) newErrors.brand = "Please enter Brand Name";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) {
            setToast({ message: "Please fill all required fields", type: 'error' });
            return;
        }
        setLoading(true);
        try {
            if (isEdit) {
                await api.put(`/products/${productToEdit.id}`, formData);
                console.log("✅ Product Updated Successfully:", formData);
                setToast({ message: "Product updated successfully!", type: 'success' });
            } else {
                await api.post('/products', formData);
                console.log("✅ Product Created Successfully:", formData);
                setToast({ message: "Product added Successfully", type: 'success' });
            }
            // Delay close to show success
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 1000);
        } catch (err) {
            console.error(err);
            const errorMessage = err.response?.data?.message || "Failed to save product";
            setToast({ message: errorMessage, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? "Edit Product" : "Add Product"} maxWidth="max-w-xl">
                <div className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full border rounded-lg p-2 outline-none focus:ring-1 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    {/* Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Type</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className={`w-full border rounded-lg p-2 outline-none bg-white ${errors.type ? 'border-red-500' : 'border-gray-300'}`}
                        >
                            <option value="">Select product type</option>
                            <option value="Foods">Foods</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Clothes">Clothes</option>
                            <option value="Beauty Products">Beauty Products</option>
                            <option value="Others">Others</option>
                        </select>
                    </div>

                    {/* Grid for Numbers */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity Stock</label>
                            <input
                                name="stock" type="number"
                                value={formData.stock} onChange={handleChange}
                                className={`w-full border rounded-lg p-2 outline-none ${errors.stock ? 'border-red-500' : 'border-gray-300'}`}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">MRP</label>
                            <input
                                name="mrp" type="number"
                                value={formData.mrp} onChange={handleChange}
                                className={`w-full border rounded-lg p-2 outline-none ${errors.mrp ? 'border-red-500' : 'border-gray-300'}`}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price</label>
                            <input
                                name="sellingPrice" type="number"
                                value={formData.sellingPrice} onChange={handleChange}
                                className={`w-full border rounded-lg p-2 outline-none ${errors.sellingPrice ? 'border-red-500' : 'border-gray-300'}`}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name</label>
                            <input
                                name="brand"
                                value={formData.brand} onChange={handleChange}
                                className={`w-full border rounded-lg p-2 outline-none ${errors.brand ? 'border-red-500' : 'border-gray-300'}`}
                            />
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                            <span>Upload Product Images</span>
                            <span className="text-blue-900 cursor-pointer relative">
                                Add More Photos
                                <input type="file" multiple onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                            </span>
                        </label>

                        <div className="border border-dashed border-gray-300 rounded-lg p-4 min-h-[100px] flex gap-4 overflow-x-auto items-center">
                            {formData.images.length === 0 && (
                                <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer text-gray-400 hover:text-blue-600 transition py-4">
                                    <UploadSimple size={24} />
                                    <span className="text-xs font-medium mt-1">Browse to upload</span>
                                    <input type="file" multiple onChange={handleImageUpload} className="hidden" />
                                </label>
                            )}
                            {formData.images.map((img, i) => (
                                <div key={i} className="relative w-16 h-16 flex-shrink-0 border rounded bg-gray-50 flex items-center justify-center">
                                    <img src={img} alt="Preview" className="max-w-full max-h-full object-contain" />
                                    <button onClick={() => removeImage(i)} className="absolute -top-2 -right-2 bg-white rounded-full shadow border p-0.5">
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Exchange */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Exchange or return eligibility</label>
                        <select
                            name="exchangeEligible"
                            value={formData.exchangeEligible}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg p-2 outline-none bg-white"
                        >
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>

                    <div className="pt-4">
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full bg-[#101460] text-white py-3 rounded-lg font-medium hover:bg-blue-900 transition"
                        >
                            {loading ? 'Saving...' : (isEdit ? 'Update' : 'Create')}
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default AddEditProductModal;
