import { useState, useEffect } from 'react';
import { LogoIcon, HomeIcon, ProductIcon, SearchIcon } from './Icons';
import { UserCircle } from 'phosphor-react';
import { Link } from 'react-router-dom';

const Navbar = ({ title, searchValue, onSearch }) => {
    const [user, setUser] = useState({
        fullName: 'Demo User',
        email: 'demo@productr.com',
        profilePic: null
    });

    const loadUser = () => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    };

    useEffect(() => {
        loadUser();

        // Listen for custom event from Profile page
        window.addEventListener('userUpdated', loadUser);

        return () => {
            window.removeEventListener('userUpdated', loadUser);
        };
    }, []);

    const defaultImage = "https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff&size=128";

    return (
        <header className="h-16 bg-gradient-to-r from-[#FFF5F7] via-[#fefeea] to-[#EBF0FF] border-b border-gray-100 flex items-center justify-between px-8">
            <div className="flex items-center gap-4">
                <span className="text-gray-500">
                    {title === 'Home' ? <HomeIcon fill="#6B7280" /> : <ProductIcon fill="#6B7280" />}
                </span>
                <h2 className="text-lg font-medium text-gray-700">{title}</h2>
            </div>

            <div className="flex items-center gap-4">
                <div className="bg-[#F3F4F6] rounded-lg flex items-center px-4 py-2 text-gray-500 text-sm w-96 mr-8 focus-within:ring-2 focus-within:ring-blue-500/20 transition">
                    <span className="mr-3"><SearchIcon stroke="#6B7280" /></span>
                    <input
                        type="text"
                        placeholder="Search Services, Products"
                        className="bg-transparent border-none outline-none text-gray-700 w-full placeholder-gray-500"
                        value={searchValue}
                        onChange={(e) => onSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded-full transition relative group">
                    <Link to="/profile" className="flex items-center gap-2">
                        <img
                            src={user.profilePic || defaultImage}
                            alt="User"
                            className="w-9 h-9 rounded-full object-cover border border-white shadow-sm"
                        />
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.5 4.5L6 8L9.5 4.5" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Link>

                    {/* Simple Dropdown on Hover */}
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <div className="p-3 border-b border-gray-50">
                            <p className="text-sm font-medium text-gray-800">{user.fullName || 'User'}</p>
                            <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        </div>
                        <button
                            onClick={() => {
                                // Simple logout logic
                                localStorage.clear();
                                window.location.href = '/login';
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition first:rounded-t-lg last:rounded-b-lg"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

// Simple Icon helper if needed, or import
const HandbagIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
)

export default Navbar;
