const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
  {
    medicineName: {
      type: String,
      required: true,
    },

    medicineDosage: {
      type: String,
      required: true,
    },

    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
    },

    time: {
      type: [String],
      required: true,
    },

    NumberOfTimes: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      default:
        "https://res.cloudinary.com/dfjllx0gl/image/upload/v1744907351/default_ihvlie.jpg",
    },
    notes: String,
  },
  { timestamps: true }
);

const Medicine = mongoose.model("Medicine", medicineSchema);

module.exports = Medicine;
