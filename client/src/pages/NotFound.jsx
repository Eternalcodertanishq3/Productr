import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-center px-4">
            <h1 className="text-9xl font-bold text-gray-200">404</h1>
            <h2 className="text-3xl font-bold text-gray-800 mt-4">Page Not Found</h2>
            <p className="text-gray-500 mt-2 mb-8 max-w-md">
                The page you are looking for doesn't exist or has been moved.
            </p>
            <Link
                to="/products"
                className="bg-[#101460] text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-900 transition"
            >
                Go Back Home
            </Link>
        </div>
    );
};

export default NotFound;
