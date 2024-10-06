import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    logo: {
      data: Buffer,
      content_type: String,
    },
  },
  {
    timeStamps: true,
  }
);

export default mongoose.model("Companies", companySchema);
