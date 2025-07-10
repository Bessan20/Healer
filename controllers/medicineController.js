const asyncHandler = require("express-async-handler");
const Medicine = require("../models/medicineModel");

const multer = require("multer");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Configure Multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory for Cloudinary upload
const upload = multer({ storage });

// Middleware to handle file uploads
exports.uploadFile = upload.single("image"); // Expecting a single file with the field name "image"

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

// ✅ دالة الإنشاء
exports.createMedicine = asyncHandler(async (req, res, next) => {
  const doctorId = req.doctor._id;
  const {
    medicineName,
    medicineDosage,
    NumberOfTimes,
    time,
    patientId,
    notes,
    durationInDays, // ✅ NEW
  } = req.body;

  // ✅ تحقق من الوقت
  if (!isValidTimeFormat(time)) {
    return res.status(400).json({
      message: `Invalid time format "${time}". Expected HH:mm.`,
    });
  }

  // ✅ تحقق من عدد الجرعات في اليوم
  const numTimes = Number(NumberOfTimes);
  if (
    !Number.isInteger(numTimes) ||
    numTimes <= 0 ||
    numTimes > 24 ||
    24 % numTimes !== 0
  ) {
    return res.status(400).json({
      message: `Invalid NumberOfTimes "${NumberOfTimes}". Must be a positive integer ≤ 24 and divide 24 evenly.`,
    });
  }

  // ✅ تحقق من عدد الأيام
  const days = Number(durationInDays);
  // if (!Number.isInteger(days) || days <= 0) {
  //   return res.status(400).json({
  //     message: `Invalid durationInDays "${durationInDays}". Must be a positive integer ≥ 1.`,
  //   });
  // }

  // ✅ رفع صورة لو فيه
  let imageUrl;

  if (req.file) {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "medicines" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    imageUrl = result.secure_url;
  }

  const times = generateTimes(time, numTimes);

  // ✅ إنشاء الدواء
  const newMedicine = await Medicine.create({
    medicineName,
    medicineDosage,
    NumberOfTimes: numTimes,
    time: times,
    durationInDays: days, // ✅ NEW
    patientId,
    doctorId,
    notes,
    image: imageUrl,
  });

  res.status(201).json({
    status: "success",
    data: newMedicine,
  });
});

// @desc    Get all medicines for the logged-in user (patient)
// @route   GET /api/medicines/my-medicines
// @access  Private (User only)
exports.getMyMedicines = asyncHandler(async (req, res, next) => {
  const patientId = req.user._id;

  const medicines = await Medicine.find({ patientId }).populate(
    "doctorId",
    "name email image"
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

exports.deleteMedicineByUser = asyncHandler(async (req, res, next) => {
  const userId = req.user._id; // من التوكن بعد تسجيل الدخول
  const { medicineId } = req.params;

  const medicine = await Medicine.findById(medicineId);

  if (!medicine) {
    return res.status(404).json({ message: "Medicine not found." });
  }

  // ✅ تأكد إن الدوا تابع للمريض ده
  if (medicine.patientId.toString() !== userId.toString()) {
    return res
      .status(403)
      .json({ message: "You are not allowed to delete this medicine." });
  }

  // ✅ امسح الدوا
  await Medicine.findByIdAndDelete(medicineId);

  res.status(200).json({
    status: "success",
    message: "Medicine deleted successfully.",
  });
});

exports.deleteMedicineByDoctor = asyncHandler(async (req, res, next) => {
  const doctorId = req.doctor._id;
  const { medicineId } = req.params;

  const medicine = await Medicine.findById(medicineId);

  if (!medicine) {
    return res.status(404).json({ message: "Medicine not found." });
  }

  // ✅ تأكد إن الدوا ده بتاع الدكتور اللي عامل الطلب
  if (medicine.doctorId.toString() !== doctorId.toString()) {
    return res
      .status(403)
      .json({ message: "You are not allowed to delete this medicine." });
  }

  // ✅ احذف الدوا
  await Medicine.findByIdAndDelete(medicineId);

  res.status(200).json({
    status: "success",
    message: "Medicine deleted successfully by doctor.",
  });
});
