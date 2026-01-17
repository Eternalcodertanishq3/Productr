import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import ProductCard from '../components/ProductCard';
import AddEditProductModal from '../components/AddEditProductModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { Plus } from 'phosphor-react';
import { EmptyStateIcon } from '../components/Icons';
import SkeletonCard from '../components/SkeletonCard';
import api from '../services/api';

import { useLocation } from 'react-router-dom';

const Dashboard = () => {
    const location = useLocation();
    const pageTitle = location.pathname.includes('/home') ? 'Home' : 'Products';

    const [products, setProducts] = useState([]);
    const [activeTab, setActiveTab] = useState('published'); // 'published' | 'unpublished'
    const [loading, setLoading] = useState(true);

    // Values derived from Tab
    const isPublishedTab = activeTab === 'published';

    // Modals State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState(null);
    const [productToDelete, setProductToDelete] = useState(null);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            // Fetch based on active tab ONLY if on Home page
            let url = '/products';
            if (pageTitle === 'Home') {
                url += `?published=${isPublishedTab}`;
            }

            const res = await api.get(url);
            setProducts(res.data);
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [activeTab, pageTitle]);

    const handlePublishToggle = async (product) => {
        try {
            await api.patch(`/products/${product.id}/publish`);
            console.log("✅ Product Publish Status Toggled for ID:", product.id);
            // Refresh list (item will disappear from current tab)
            fetchProducts();
        } catch (error) {
            console.error("Failed to toggle publish", error);
        }
    };

    const handleEdit = (product) => {
        setProductToEdit(product);
        setIsAddModalOpen(true);
    };

    const handleDeleteClick = (product) => {
        setProductToDelete(product);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!productToDelete) return;
        try {
            await api.delete(`/products/${productToDelete.id}`);
            console.log("✅ Product Deleted Successfully, ID:", productToDelete.id);
            setIsDeleteModalOpen(false);
            setProductToDelete(null);
            fetchProducts();
        } catch (error) {
            console.error("Failed to delete", error);
        }
    };

    const [searchTerm, setSearchTerm] = useState('');

    // ... existing useEffects ...

    // Filter Products based on Search
    const filteredProducts = products.filter(product => {
        if (!searchTerm) return true;
        const lowerTerm = searchTerm.toLowerCase();
        return (
            product.name?.toLowerCase().includes(lowerTerm) ||
            product.brand?.toLowerCase().includes(lowerTerm) ||
            product.type?.toLowerCase().includes(lowerTerm)
        );
    });

    return (
        <DashboardLayout
            title={pageTitle}
            searchValue={searchTerm}
            onSearch={setSearchTerm}
        >
            {/* Header Area */}
            <div className="flex flex-col gap-2 mb-6">
                {pageTitle === 'Products' && (
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-600">Products</h2>
                        <button
                            onClick={() => { setProductToEdit(null); setIsAddModalOpen(true); }}
                            className="flex items-center gap-2 text-gray-600 text-lg font-medium hover:text-gray-900 transition"
                        >
                            <Plus size={24} />
                            Add Products
                        </button>
                    </div>
                )}

                {/* Tabs - Only for Home Page */}
                {pageTitle === 'Home' && (
                    <div className="flex gap-8 mb-4 border-b border-gray-100">
                        <button
                            onClick={() => setActiveTab('published')}
                            className={`transition text-xl pb-3 border-b-2 
                                ${activeTab === 'published' ? 'font-bold text-[#344054] border-[#0EA5E9]' : 'font-medium text-gray-400 hover:text-gray-600 border-transparent'}
                            `}
                        >
                            Published
                        </button>
                        <button
                            onClick={() => setActiveTab('unpublished')}
                            className={`transition text-xl pb-3 border-b-2
                                ${activeTab === 'unpublished' ? 'font-bold text-[#344054] border-[#0EA5E9]' : 'font-medium text-gray-400 hover:text-gray-600 border-transparent'}
                            `}
                        >
                            Unpublished
                        </button>
                    </div>
                )}
            </div>

            {/* Grid or Empty State */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                        <SkeletonCard key={n} />
                    ))}
                </div>
            ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
                    {filteredProducts.map(product => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onEdit={handleEdit}
                            onDelete={handleDeleteClick}
                            onTogglePublish={handlePublishToggle}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="mb-4">
                        <div className="text-blue-900">
                            <EmptyStateIcon />
                        </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No {isPublishedTab ? 'Published' : 'Unpublished'} Products</h3>
                    <p className="text-gray-400 text-sm max-w-xs">
                        Your {isPublishedTab ? 'Published' : 'Unpublished'} Products will appear here.
                        {!isPublishedTab && " Create your first product to publish"}
                    </p>
                    {!isPublishedTab && (
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="mt-6 bg-[#101460] text-white px-6 py-2 rounded-lg font-medium"
                        >
                            Add your Products
                        </button>
                    )}
                </div>
            )}

            {/* Modals */}
            <AddEditProductModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                productToEdit={productToEdit}
                onSuccess={fetchProducts}
            />

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                productName={productToDelete?.name}
            />

        </DashboardLayout>
    );
};

export default Dashboard;
