import savedJobsModel from "../models/savedJobsModel.js";

export const saveJobsController = async (req, res) => {
  try {
    const { jobId } = req.body;

    const savedJobs = await savedJobsModel.create({
      user_id: req.user._id,
      job_id: jobId,
    });

    res.status(200).send({
      success: true,
      message: "Job saved successfully",
      savedJobs,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while getting saved jobs",
      error,
    });
  }
};

export const unSaveJobsController = async (req, res) => {
  try {
    const savedJobs = await savedJobsModel
      .findOneAndDelete({
        user_id: req.user._id,
        job_id: req.params.jid,
      })
      .populate("job_id");

    res.status(200).send({
      success: true,
      message: "Job removed successfully",
      savedJobs,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while getting saved jobs",
      error,
    });
  }
};

export const getSavedJobsController = async (req, res) => {
  try {
    const savedJobs = await savedJobsModel
      .find({ user_id: req.user._id })
      .populate("job_id");

    res.status(200).send({
      success: true,
      message: "Successfully get saved jobs",
      savedJobs,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while getting saved jobs",
      error,
    });
  }
};
