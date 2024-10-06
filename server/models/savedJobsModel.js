import mongoose from "mongoose";

const savedJobsSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    job_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Jobs",
    },
  },
  { timestamps: true }
);

export default mongoose.model("SavedJobs", savedJobsSchema);
