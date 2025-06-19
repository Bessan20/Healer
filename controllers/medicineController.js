const asyncHandler = require("express-async-handler");
const Medicine = require("../models/medicineModel");

function isValidTimeFormat(timeStr) {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(timeStr);
}

function generateTimes(startTimeStr, numberOfTimes) {
  const [startHour, startMin] = startTimeStr.split(":").map(Number);
  const interval = 24 / numberOfTimes;

  const times = [];
  for (let i = 0; i < numberOfTimes; i++) {
    const hour = (startHour + i * interval) % 24;
    const hourFormatted = Math.floor(hour).toString().padStart(2, "0");
    const minuteFormatted = startMin.toString().padStart(2, "0");
    times.push(`${hourFormatted}:${minuteFormatted}`);
  }
  return times;
}

exports.createMedicines = asyncHandler(async (req, res, next) => {
  const doctorId = req.doctor._id;
  const medicinesData = req.body.medicines;

  if (!Array.isArray(medicinesData) || medicinesData.length === 0) {
    return res.status(400).json({
      message: "You must provide an array of medicines.",
    });
  }

  const medicinesToInsert = [];

  for (const med of medicinesData) {
    const { time, NumberOfTimes } = med;

    // Validate time format
    if (!isValidTimeFormat(time)) {
      return res.status(400).json({
        message: `Invalid time format "${time}". Expected HH:mm (e.g., 09:30).`,
      });
    }

    // Validate NumberOfTimes
    if (
      !Number.isInteger(NumberOfTimes) ||
      NumberOfTimes <= 0 ||
      NumberOfTimes > 24 ||
      24 % NumberOfTimes !== 0
    ) {
      return res.status(400).json({
        message: `Invalid NumberOfTimes "${NumberOfTimes}". Must be a positive integer ≤ 24 and divide 24 evenly.`,
      });
    }

    const times = generateTimes(time, NumberOfTimes);

    medicinesToInsert.push({
      ...med,
      doctorId,
      time: times,
    });
  }

  const createdMedicines = await Medicine.insertMany(medicinesToInsert);

  res.status(201).json({
    status: "success",
    results: createdMedicines.length,
    data: createdMedicines,
  });
});

// @desc    Get all medicines for the logged-in user (patient)
// @route   GET /api/medicines/my-medicines
// @access  Private (User only)
exports.getMyMedicines = asyncHandler(async (req, res, next) => {
  const patientId = req.user._id;

  const medicines = await Medicine.find({ patientId }).populate(
    "doctorId",
    "name email"
  );

  res.status(200).json({
    status: "success",
    results: medicines.length,
    data: medicines,
  });
});

// ✅ تعديل وقت العلاج بناءً على الوقت الجديد وعدد الجرعات
exports.adjustMedicineTime = asyncHandler(async (req, res, next) => {
  const { startTime } = req.body;
  const { id: medicineId } = req.params;

  // تحقق من صحة تنسيق الوقت
  if (!isValidTimeFormat(startTime)) {
    return res.status(400).json({
      message: "Invalid time format. Please use HH:mm format (e.g., 09:00).",
    });
  }

  // الحصول على العلاج والتأكد إنه خاص باليوزر الحالي
  const medicine = await Medicine.findOne({
    _id: medicineId,
    patientId: req.user._id,
  });

  if (!medicine) {
    return res.status(404).json({ message: "Medicine not found." });
  }

  // إعادة توليد المواعيد
  const updatedTimes = generateTimes(startTime, medicine.NumberOfTimes);

  // تحديث وحفظ
  medicine.time = updatedTimes;
  await medicine.save();

  res.status(200).json({
    message: "Medicine times updated successfully.",
    updatedTimes,
  });
});
