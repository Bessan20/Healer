// Import Express Router
const express = require("express");
const router = express.Router();

// Import the controllers and validators
const {
  getMyMedicines,
  createMedicine,
  adjustMedicineTime,
  uploadFile,
  deleteMedicineByUser,
  deleteMedicineByDoctor,
} = require("../controllers/medicineController.js");

const { protect } = require("../controllers/authController.js");
const { protectDoctor } = require("../controllers/doctorController.js");

// Route to get all appointments
router.route("/getMyMedicine").get(protect, getMyMedicines);

// Route to create a new appointment
router.route("/createMedicne").post(protectDoctor, uploadFile, createMedicine);

// Route to cancel an appointment
router.route("/updateStartTime/:id").put(protect, adjustMedicineTime);

router.delete("/delete/:medicineId", protect, deleteMedicineByUser);

router.delete(
  "/delete/by-doctor/:medicineId",
  protectDoctor,
  deleteMedicineByDoctor
);

// Export the router
module.exports = router;
