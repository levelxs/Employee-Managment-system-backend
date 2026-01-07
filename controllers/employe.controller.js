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

//Employee dashboard data 
exports.employeeDashboard = async (req, res) => {
    try {
        // 1️⃣ Total Employees
        const totalEmployees = await Employee.countDocuments();

        // 2️⃣ Status wise count
        const activeEmployees = await Employee.countDocuments({ status: "Active" });
        const inactiveEmployees = await Employee.countDocuments({ status: "Inactive" });

        // 3️⃣ Total Salary (Revenue / Cost)
        const salaryResult = await Employee.aggregate([
            {
                $group: {
                    _id: null,
                    totalSalary: { $sum: "$salary" }
                }
            }
        ]);

        const totalSalary = salaryResult[0]?.totalSalary || 0;

        // 4️⃣ All Employees (for table)
        const employees = await Employee.find()
            .sort({ createdAt: -1 })
            .select("name email department salary status createdAt");

        res.status(200).json({
            success: true,
            dashboard: {
                totalEmployees,
                activeEmployees,
                inactiveEmployees,
                totalSalary
            },
            employees
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Dashboard data fetch failed",
            error: error.message
        });
    }
};
