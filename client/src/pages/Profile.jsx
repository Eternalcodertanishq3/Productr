import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { PencilIcon } from '../components/Icons';
import Toast from '../components/Toast';
import api from '../services/api';

const Profile = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [imagePreview, setImagePreview] = useState(null); // Place holder for real image
    const [toast, setToast] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        bio: '',
    });

    useEffect(() => {
        const loadUserData = async () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const user = JSON.parse(storedUser);
                try {
                    // Fetch fresh data from API
                    const res = await api.get(`/user/${user._id}`);
                    const data = res.data;

                    setFormData({
                        fullName: data.fullName || '',
                        email: data.email || '',
                        phone: data.phone || '',
                        bio: data.bio || ''
                    });
                    if (data.profilePic) setImagePreview(data.profilePic);
                } catch (error) {
                    console.error("Failed to load user data", error);
                    // Fallback to stored data if API fails
                    setFormData({
                        fullName: user.fullName || '',
                        email: user.email || '',
                        phone: user.phone || '',
                        bio: user.bio || ''
                    });
                }
            }
        };
        loadUserData();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result); // This Base64 string will be sent to API
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();

        const storedUser = localStorage.getItem('user');
        if (!storedUser) return;
        const user = JSON.parse(storedUser);

        try {
            const payload = {
                ...formData,
                profilePic: imagePreview // Send the Base64 image
            };

            const res = await api.put(`/user/${user._id}`, payload);

            // Update local storage to reflect changes immediately across app
            localStorage.setItem('user', JSON.stringify(res.data));

            // Dispatch event so Navbar updates instantly
            window.dispatchEvent(new Event('userUpdated'));

            console.log('✅ Profile updated successfully:', res.data);

            setToast({ message: 'Profile updated successfully!', type: 'success' });
        } catch (error) {
            console.error(error);
            const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to update profile';
            setToast({ message: errorMessage, type: 'error' });
        }
    };

    return (
        <DashboardLayout
            title="Profile"
            searchValue={searchTerm}
            onSearch={setSearchTerm}
        >
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
            <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-8">My Profile</h2>

                <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                    {/* Header / Image Section */}
                    <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-50 shadow-inner">
                                <img
                                    src={imagePreview || "https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff&size=150"}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <label className="absolute bottom-0 right-0 bg-[#0F1C50] text-white p-2.5 rounded-full cursor-pointer hover:bg-blue-900 transition shadow-lg border-2 border-white">
                                <PencilIcon className="w-4 h-4 text-white" />
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </label>
                        </div>

                        <div className="text-center md:text-left">
                            <h3 className="text-xl font-bold text-gray-900">{formData.fullName}</h3>
                            <p className="text-gray-500">{formData.email}</p>
                            <p className="text-sm text-blue-600 font-medium mt-1">Change Profile Photo</p>
                        </div>
                    </div>

                    {/* Form Section */}
                    <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-1 md:col-span-2">
                            <h4 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Personal Information</h4>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F1C50] focus:border-transparent outline-none transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F1C50] focus:border-transparent outline-none transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F1C50] focus:border-transparent outline-none transition"
                            />
                        </div>

                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Bio / Role</label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleInputChange}
                                rows="3"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F1C50] focus:border-transparent outline-none transition resize-none"
                            ></textarea>
                        </div>

                        <div className="col-span-1 md:col-span-2 flex justify-end mt-4">
                            <button
                                type="submit"
                                className="px-8 py-3 bg-[#0F1C50] text-white font-medium rounded-lg hover:bg-blue-900 transition shadow-md hover:shadow-lg transform active:scale-95"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Profile;
