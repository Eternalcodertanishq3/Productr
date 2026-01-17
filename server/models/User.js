const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    fullName: { type: String, default: 'New User' },
    phone: { type: String },
    bio: { type: String },
    profilePic: { type: String }, // Base64 string for simplicity
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
