import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../Config/Env.js";
import User from "../Models/User.model.js";

const authorize = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || typeof authHeader !== 'string') {
        return res.status(401).json({ success: false, message: "Unauthorized", error: "Authorization header is missing or invalid" });
    }

    if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: "Unauthorized", error: "Invalid authorization format" });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized", error: "Token is missing" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized", error: "User not found" });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Unauthorized", error: error.message });
    }
};

export default authorize;