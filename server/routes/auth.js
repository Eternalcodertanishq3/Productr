const router = require('express').Router();
const User = require('../models/User');

// Mock Store for OTPs
const otpStore = {};

// POST /api/auth/send-otp
router.post('/send-otp', (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    // Generate Mock OTP
    const otp = '123456';
    otpStore[email] = otp;

    console.log(`OTP for ${email}: ${otp}`);
    res.status(200).json({ message: 'OTP sent successfully' });
});

// POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: 'Email and OTP are required' });
    }

    // Verify OTP (Backdoor or Store)
    const storedOtp = otpStore[email];
    if (otp === '123456' || otp === storedOtp) {

        try {
            // Find or Create User
            let user = await User.findOne({ email });
            if (!user) {
                user = new User({ email, fullName: email.split('@')[0] });
                await user.save();
                console.log(`New user created: ${email}`);
            }

            console.log(`Login successful for: ${email}`);

            return res.status(200).json({
                message: 'Login successful',
                token: `mock-jwt-token-${user._id}`,
                user
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Server Error during login' });
        }
    }

    res.status(400).json({ message: 'Invalid OTP' });
});

module.exports = router;

module.exports = router;
