import React from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const DashboardLayout = ({ children, title = "Products", searchValue, onSearch }) => {
    return (
        <div className="flex bg-[#F8F9FA] min-h-screen">
            <Sidebar searchValue={searchValue} onSearch={onSearch} />
            <div className="flex-1 ml-0 md:ml-64 flex flex-col pb-16 md:pb-0 transition-all duration-300">
                <Navbar title={title} searchValue={searchValue} onSearch={onSearch} />
                <main className="px-4 md:px-8 pt-6 pb-8 flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center p-3 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                <a href="/home" className={`flex flex-col items-center gap-1 text-xs font-medium ${window.location.pathname.includes('/home') ? 'text-[#0F1C50]' : 'text-gray-400'}`}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                    Home
                </a>
                <a href="/products" className={`flex flex-col items-center gap-1 text-xs font-medium ${window.location.pathname.includes('/products') ? 'text-[#0F1C50]' : 'text-gray-400'}`}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                    Products
                </a>
                <a href="/profile" className={`flex flex-col items-center gap-1 text-xs font-medium ${window.location.pathname.includes('/profile') ? 'text-[#0F1C50]' : 'text-gray-400'}`}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    Profile
                </a>
            </div>
        </div>
    );
};

export default DashboardLayout;
