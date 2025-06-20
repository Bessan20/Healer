// Import Express Router
const express = require("express");
const router = express.Router();

// Import the controllers and validators
const {
  getMyMedicines,
  createMedicines,
  adjustMedicineTime,
} = require("../controllers/medicineController.js");

const { protect } = require("../controllers/authController.js");
const { protectDoctor } = require("../controllers/doctorController.js");

// Route to get all appointments
router.route("/getMyMedicine").get(protect, getMyMedicines);

// Route to create a new appointment
router.route("/createMedicne").post(protectDoctor, createMedicines);

// Route to cancel an appointment
router.route("/updateStartTime/:id").put(protect, adjustMedicineTime);

// Export the router
module.exports = router;
