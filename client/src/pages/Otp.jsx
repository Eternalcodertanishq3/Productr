import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Otp = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email || 'test@example.com';

    // OTP State (Array for 6 boxes)
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const inputRefs = useRef([]);

    const handleChange = (index, value) => {
        if (isNaN(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next
        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleVerify = async () => {
        const code = otp.join('');
        if (code.length < 6) return; // Wait for full code

        setLoading(true);
        setError('');
        try {
            // Pass email along with OTP for verification
            const res = await api.post('/auth/verify-otp', { otp: code, email });

            // Save token and user details
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            console.log('✅ Login/Signup successful:', res.data.user);

            navigate('/products');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-full bg-white">
            {/* Left Section - Reused Abstract */}
            {/* Left Section - Reused Abstract */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden">
                <div className="absolute inset-0 bg-white">
                    <img src="/login-bg.png" alt="Background" className="w-full h-full object-cover opacity-90" />
                </div>
                <div className="relative z-10 m-auto">
                    <div className="w-[300px] h-[400px] rounded-[40px] shadow-2xl relative overflow-hidden">
                        <img src="/login-runner.png"
                            alt="Runner"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute bottom-8 left-0 right-0 text-center text-white px-4">
                            <h2 className="text-2xl font-bold leading-tight">Uplist your<br />product to market</h2>
                        </div>
                    </div>
                </div>
                <div className="absolute top-8 left-8 flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-white tracking-tight">Productr</h1>
                </div>
            </div>

            {/* Right Section - OTP Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-8 lg:px-24">
                <div className="w-full max-w-md">
                    <h2 className="text-3xl font-bold text-[#1A1A2E] mb-8">Login to your Productr Account</h2>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP</label>
                        <div className="flex gap-2 justify-between">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={el => inputRefs.current[index] = el}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className={`w-12 h-12 text-center border rounded-lg focus:ring-2 focus:ring-blue-900 outline-none text-lg font-bold
                                ${error ? 'border-red-500 bg-red-50' : 'border-gray-300'}
                            `}
                                />
                            ))}
                        </div>
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    </div>

                    <button
                        onClick={handleVerify}
                        disabled={loading}
                        className="w-full bg-[#0F1C50] text-white py-3 rounded-lg font-medium hover:bg-blue-900 transition"
                    >
                        {loading ? 'Verifying...' : 'Enter your OTP'}
                    </button>

                    <p className="text-center mt-4 text-xs text-gray-500">
                        Didn't receive OTP? <span className="text-[#0F1C50] font-bold cursor-pointer">Resend in 20s</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Otp;
