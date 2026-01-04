const jwt = require("jsonwebtoken");
const Employee = require("../models/login.model");

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Access denied, token missing" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const employee = await Employee.findById(decoded.id).select("-password");
        if (!employee) {
            return res.status(401).json({ message: "Invalid token" });
        }

        req.employee = employee;
        next();

    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }
};

module.exports = authMiddleware;
