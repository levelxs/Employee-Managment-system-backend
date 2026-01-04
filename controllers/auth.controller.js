const Users = require("../models/login.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

//REGISTER 
exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    try {

        const employeeExist = await Users.findOne({ email });
        if (employeeExist) {
            return res.status(400).json({ message: "Employee already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const employee = await Users.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: "Employee Registered Successfully",
            employee
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/* LOGIN */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const employee = await Users.findOne({ email });
        if (!employee) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, employee.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: employee._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            success: true,
            message: "Login successful",
            token: token

        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/* LOGOUT */
exports.logout = async (req, res) => {
    res.json({ message: "Logout successful (Client side token delete)" });
};

/* PROTECTED HOME */
exports.home = async (req, res) => {
    res.json({
        message: `Welcome ${req.employee.name}`,
        employee: req.employee
    });
};

// forgot password
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await Users.findOne({ email });
        if (!user)
            return res.status(404).json({ message: "User not found" });

        const resetToken = crypto.randomBytes(32).toString("hex");

        user.resetPasswordToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 min

        await user.save();

        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

       //  await sendEmail(
       //      user.email,
       //      "Password Reset",
       //      `<p>Click to reset password:</p>
       // <a href="${resetUrl}">${resetUrl}</a>`
       //  );

        res.json({ message: "Reset link sent to email" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// RESET PASSWORD
exports.resetPassword = async (req, res) => {
    try {
        const resetToken = crypto
            .createHash("sha256")
            .update(req.params.token)
            .digest("hex");

        const user = await Users.findOne({
            resetPasswordToken: resetToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user)
            return res.status(400).json({ message: "Invalid or expired token" });

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.json({ message: "Password reset successful" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
