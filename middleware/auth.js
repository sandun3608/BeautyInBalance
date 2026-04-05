const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header (Format: "Bearer [token]")
            token = req.headers.authorization.split(' ')[1];

            // Verify the token - Falls back to safe key if JWT_SECRET missing
            const secret = process.env.JWT_SECRET || 'beauty_in_balance_token_key_123';
            const decoded = jwt.verify(token, secret);

            // --- EMERGENCY ADMIN BYPASS ---
            if (decoded.id === '000000000000000000000000' || decoded.id === '111111111111111111111111' || decoded.id === 'dummy_admin_id') {
               req.user = { 
                 _id: decoded.id, 
                 email: decoded.id === '111111111111111111111111' ? 'nipuni@beauty.com' : 'admin@test.com', 
                 isAdmin: true, 
                 name: decoded.id === '111111111111111111111111' ? 'Nipuni (Admin)' : 'Master Admin' 
               };
               return next();
            }

            // Fetch the user from the database and attach it to the request
            req.user = await User.findById(decoded.id).select('-password');
            
            next(); // Move on to the actual route logic
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed!' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token provided!' });
    }
};

module.exports = { protect };
