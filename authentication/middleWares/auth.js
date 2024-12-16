const jwt = require('jsonwebtoken');
const User = require('../model/user');

const userAuth = async (req, res, next) => {
    try {
        // Get the Authorization header
        // const authHeader = req.headers['authorization'];
        const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1];
        // if (!authHeader) {
        //     return res.status(401).json({ error: "Authorization header is missing" });
        // }

        // Extract the token after "Bearer"
        if (!token) {
            return res.status(401).json({ error: "Token is missing" });
        }

        // Verify token
        const decodeObject = jwt.decode(token, 'shhh');
        console.log('Decoded Token:', decodeObject); // Debugging log

        const { _id } = decodeObject;

        // Find the user in the database
        const user = await User.findById(_id);
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        // Attach user to request object
        req.user = user;
        next();
    } catch (err) {
        console.error("Authentication Error:", err);

        // Handle specific JWT errors
        if (err instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ error: "Invalid token" });
        }
        if (err instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ error: "Token has expired" });
        }

        res.status(500).json({ error: "Server error: " + err.message });
    }
};

module.exports = { userAuth };
