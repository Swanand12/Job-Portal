import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    job_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Jobs",
    },

    candidate_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    status: {
      type: String,
      default: "Applied",
      enum: ["Applied", "Interviewing", "Hiring", "Rejected"],
    },
    resume: {
      data: Buffer,
      content_type: String,
    },
    skills: {
      type: String,
      required: true,
      trim: true,
    },
    experience: {
      type: String,
      required: true,
      trim: true,
    },
    education: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timeStamps: true }
);

export default mongoose.model("Applications", applicationSchema);
