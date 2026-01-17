import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { LogoIcon, HomeIcon, ProductIcon, SearchIcon } from './Icons';
import { ChartBar } from 'phosphor-react';

const Sidebar = ({ searchValue, onSearch }) => {
    const location = useLocation();
    const isActive = (path) => location.pathname.includes(path);

    return (
        <aside className="w-64 bg-[#1D222B] text-white flex-col fixed h-full transition-all duration-300 border-r border-[#2D303E] hidden md:flex z-50">
            {/* Logo Area */}
            <div className="h-20 flex items-center px-6">
                <div className="flex items-center gap-2 font-bold text-2xl tracking-tight">
                    <span className="text-white">Productr</span>
                    <div className="text-orange-500">
                        <LogoIcon />
                    </div>
                </div>
            </div>

            {/* Search Area */}
            <div className="px-4 mb-6">
                <div className="bg-[#252A40] rounded-lg flex items-center px-4 py-2 text-gray-400 text-sm focus-within:ring-2 focus-within:ring-blue-500/50 transition border border-transparent">
                    <SearchIcon className="w-4 h-4 text-gray-400 mr-2" />
                    <input
                        type="text"
                        placeholder="Search"
                        className="bg-transparent border-none outline-none text-white w-full placeholder-gray-500"
                        value={searchValue}
                        onChange={(e) => onSearch && onSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-2">
                <Link to="/home" className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition
                    ${isActive('/home') ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}
                `}>
                    <HomeIcon fill={isActive('/home') ? "white" : "#9CA3AF"} />
                    Home
                </Link>

                <Link to="/analytics" className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition
                    ${isActive('/analytics') ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}
                `}>
                    <ChartBar size={20} weight={isActive('/analytics') ? "fill" : "regular"} className={isActive('/analytics') ? "text-white" : "text-gray-400"} />
                    Analytics
                </Link>

                <Link to="/products" className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition
                    ${isActive('/products') ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}
                `}>
                    <ProductIcon fill={isActive('/products') ? "white" : "#9CA3AF"} />
                    Products
                </Link>
            </nav>
        </aside >
    );
};

export default Sidebar;
