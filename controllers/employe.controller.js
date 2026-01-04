const Employee = require("../models/employe.model");

//Create operation - register employee
exports.registerEmployee = async (req, res) => {
    const { name, email, department, salary, status } = req.body;

    //all field are required
    if (!name || !email || !department || !salary || !status) {
        return res.status(400).json({ message: "All fields are required" });
    }

    //if user is already exist
    try {
        const existingEmployee = await Employee.findOne({
            email: email.toLowerCase(),
        });

        if (existingEmployee) {
            return res.status(400).json({
                message: "Employee already exists",
            });
        }

        //create employee
        const employee = await Employee.create({
            name,
            email: email.toLowerCase(),
            department,
            salary,
            status,
        });

        res.status(201).json({
            message: "Employee registered successfully",
            employee,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


//read operation - show all data

exports.showData = async function (req, res) {

    try {
        const employe = await Employee.find()
        res.json(employe)
    } catch (error) {
        console.log(error);

    }
}

//Update employe data

exports.updateEmploye = async function (req, res) {
    try {
        const employe = await Employee.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        res.json(employe)
    } catch (error) {
        console.log(error);

    }
}

//Delete employee
exports.deleteEmploye = async function (req, res) {
    try {
        const employe = await Employee.findByIdAndDelete(req.params.id);

        if (!employe) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Employee deleted successfully",
            data: employe
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
