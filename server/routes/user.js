const router = require('express').Router();
const User = require('../models/User');

// GET /api/user/:id
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// PUT /api/user/:id
router.put('/:id', async (req, res) => {
    try {
        const { fullName, email, phone, bio, profilePic } = req.body;

        // Find and Update
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { fullName, email, phone, bio, profilePic },
            { new: true } // Return updated doc
        );

        if (!user) return res.status(404).json({ message: 'User not found' });

        console.log(`Profile updated for user: ${user.fullName} (${user.email})`);
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

module.exports = router;
