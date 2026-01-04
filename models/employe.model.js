const mongoose = require("mongoose");

const EmployeRegister = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    department: {
        type: String,
        require
    },
    salary: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        require: true
    }
}, { timestamps: true });

module.exports = mongoose.model("EmployeUsers", EmployeRegister);
