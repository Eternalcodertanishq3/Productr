import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import Toast from '../components/Toast';

import { LogoIcon } from '../components/Icons';

const Login = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/send-otp', { email });
            navigate('/otp', { state: { email } });
        } catch (error) {
            console.error(error);
            setToast({ message: 'Failed to send OTP. Please try again.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-full bg-white relative">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
            {/* Left Section - Abstract & Card */}
            <div className="hidden lg:flex w-1/2 p-3 items-center justify-center bg-white">
                <div className="relative w-full h-full rounded-[40px] overflow-hidden">
                    {/* Static Background Image */}
                    <img
                        src="/login-bg.png"
                        alt="Background"
                        className="absolute inset-0 w-full h-full object-cover"
                    />

                    {/* Card Overlay */}
                    <div className="relative z-10 w-full h-full flex items-center justify-center">
                        <div
                            className="relative group overflow-hidden"
                            style={{
                                width: '312px',
                                height: '480px',
                                borderRadius: '48px',
                                boxShadow: '0px 8px 34px 0px #00000052'
                            }}
                        >
                            {/* Runner Image - Zoom Fixed */}
                            <img src="/login-runner.png"
                                alt="Runner"
                                className="absolute inset-0 w-full h-full object-cover"
                            />

                            {/* Gloss/Highlight Overlay (Now Under Shadow) */}
                            <div
                                className="absolute top-[20px] left-1/2 -translate-x-1/2 rounded-[32px]"
                                style={{
                                    width: '266px',
                                    height: '118px',
                                    background: '#FFFFFF66',
                                    filter: 'blur(40px)',
                                    mixBlendMode: 'plus-lighter',
                                    pointerEvents: 'none'
                                }}
                            />

                            {/* Top Dark Shadow Gradient (Now On Top) */}
                            <div className="absolute top-0 left-0 w-full h-[120px] bg-gradient-to-b from-black/60 via-black/10 to-transparent pointer-events-none mix-blend-multiply" />

                            <div className="absolute bottom-8 left-0 right-0 text-center text-white px-4">
                                <h2 className="text-2xl font-bold leading-tight">Uplist your<br />product to market</h2>
                            </div>
                        </div>
                    </div>

                    <div className="absolute top-8 left-8 flex items-center gap-2 z-20">
                        <h1 className="text-2xl font-bold text-[#071074] tracking-tight">Productr</h1>
                        <div className="text-orange-500">
                            <LogoIcon />
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Section - Form */}
            <div className="w-full lg:w-1/2 relative flex flex-col justify-center items-center h-full px-8">
                <div className="w-full max-w-[380px] -mt-40">
                    <h2 className="text-3xl font-bold text-[#1A1A2E] mb-8">Login to your Productr Account</h2>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email or Phone number</label>
                            <input
                                type="text"
                                placeholder="Enter email or phone number"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#0F1C50] text-white py-3 rounded-lg font-medium hover:bg-blue-900 transition disabled:opacity-70"
                        >
                            {loading ? 'Sending OTP...' : 'Login'}
                        </button>
                    </form>
                </div>

                <div className="absolute bottom-12 w-[380px] max-w-[90%] border border-gray-200 p-6 rounded-xl text-center bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
                    <p className="text-gray-500 text-sm">Don't have a Productr Account</p>
                    <Link to="/signup" className="text-[#0F1C50] font-bold text-base mt-1 inline-block">SignUp Here</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
