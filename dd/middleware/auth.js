const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const secret = process.env.JWT_SECRET || 'beauty_in_balance_token_key_123';
            
            let decoded;
            try {
                decoded = jwt.verify(token, secret);
            } catch (jwtErr) {
                console.error('JWT Verification Error:', jwtErr.message);
                return res.status(401).json({ message: 'Security Token Expired or Invalid!' });
            }

            // EMERGENCY ADMIN BYPASS (Matches the login logic)
            if (decoded.id === '111111111111111111111111') {
                req.user = { 
                    _id: '111111111111111111111111', 
                    name: 'Nipuni', 
                    isAdmin: true 
                };
                return next();
            }

            try {
                req.user = await User.findById(decoded.id).select('-password');
                if (!req.user) {
                    return res.status(401).json({ message: 'User not found in database!' });
                }
            } catch (dbErr) {
                console.error('DB User Find Error:', dbErr.message);
                return res.status(500).json({ message: 'Database error verifying user: ' + dbErr.message });
            }
            
            return next();
        } catch (error) {
            console.error('Auth Middleware General Error:', error.message);
            return res.status(500).json({ message: 'Server authentication error!' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'No Security Token provided!' });
    }
};

module.exports = { protect };
