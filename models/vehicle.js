import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    ownerName: {
      type: String,
      required: true,
    },
    registrationNumber: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    roomNo: {
      type: String,
      required: true,
    },
    stickerImgURL: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const vehicle = mongoose.model("Vehicle", vehicleSchema);

export default vehicle;
