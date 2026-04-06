const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const secret = process.env.JWT_SECRET || 'beauty_in_balance_token_key_123';
            const decoded = jwt.verify(token, secret);

            // EMERGENCY ADMIN BYPASS (Matches the login logic)
            if (decoded.id === '111111111111111111111111') {
                req.user = { 
                    _id: '111111111111111111111111', 
                    name: 'Nipuni (Admin)', 
                    isAdmin: true 
                };
                return next();
            }

            req.user = await User.findById(decoded.id).select('-password');
            if (!req.user) {
                return res.status(401).json({ message: 'User not found in database!' });
            }
            
            return next();
        } catch (error) {
            console.error('Auth Middleware Error:', error.message);
            return res.status(401).json({ message: 'Security Token Expired or Invalid!' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'No Security Token provided!' });
    }
};

module.exports = { protect };
