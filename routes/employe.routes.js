const express = require("express");
const router = express.Router();
const {
    registerEmployee,
    showData,
    updateEmploye,
    deleteEmploye,
    employeeDashboard,
} = require("../controllers/employe.controller");

// Employee Routes
router.post("/register", registerEmployee);
router.get("/showData", showData);
router.put("/update/:id", updateEmploye);
router.delete("/delete/:id", deleteEmploye);
router.get("/dashboardData", employeeDashboard);



module.exports = router;
