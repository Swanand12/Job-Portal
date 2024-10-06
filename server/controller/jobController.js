import jobModel from "../models/jobModel.js";
import companyModel from "../models/companyModel.js";

export const postJobController = async (req, res) => {
  try {
    const { title, description, location, company, requirements } = req.body;

    console.log(title);

    if (!title) {
      return res.status(400).send({
        success: false,
        message: "Job Title is required",
      });
    }
    if (!description) {
      return res.status(400).send({
        success: false,
        message: "Job Description is required",
      });
    }
    if (!location) {
      return res.status(400).send({
        success: false,
        message: "Job Location is required",
      });
    }
    if (!company) {
      return res.status(400).send({
        success: false,
        message: "Company is required",
      });
    }
    if (!requirements) {
      return res.status(400).send({
        success: false,
        message: "Job Requirements is required",
      });
    }

    const job = await jobModel.create({
      recruiter_id: req.user._id,
      title: title,
      company: company,
      description: description,
      location: location,
      requirements: requirements,
    });

    res.status(200).send({
      success: true,
      message: "Successfully posted job",
      job,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while posting job",
      error,
    });
  }
};

export const getAllJobsController = async (req, res) => {
  try {
    const jobs = await jobModel.find({}).limit(6).sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      message: "Successfully get Jobs",
      jobs,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while getting all jobs",
      error,
    });
  }
};

export const loadMoreJobsController = async (req, res) => {
  try {
    const jobs = await jobModel
      .find({})
      .skip(req.params.page * 6)
      .limit(6)
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      message: "Successfully get Jobs",
      jobs,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while getting all jobs",
      error,
    });
  }
};

export const totalJobsController = async (req, res) => {
  try {
    const total = await jobModel.countDocuments();

    res.status(200).send({
      success: true,
      message: "Successfully get total jobs count",
      total,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while getting all jobs",
      error,
    });
  }
};

export const getCompanyDetails = async (req, res) => {
  try {
    const companyDetails = await companyModel
      .findById(req.params.cid)
      .select("logo");

    if (companyDetails.logo.data) {
      res.set("Content-Type", companyDetails.logo.content_type);
      return res.status(200).send(companyDetails.logo.data);
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while getting company Details",
      error,
    });
  }
};

export const getFilteredJobs = async (req, res) => {
  try {
    const { searchQuery, location, company } = req.body;

    let args = {};

    if (searchQuery) {
      args.title = { $regex: searchQuery, $options: "i" };
    }
    if (location) {
      args.location = location;
    }
    if (company) {
      args.company = company;
    }

    const filteredJobs = await jobModel.find(args);

    res.status(200).send({
      success: true,
      message: "Successfully filtered products",
      filteredJobs,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while filtering jobs",
      error,
    });
  }
};

export const getSingleJobController = async (req, res) => {
  try {
    const job = await jobModel.findById({ _id: req.params.jid });

    res.status(200).send({
      success: true,
      message: "Successfully get job details",
      job,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while getting single job",
      error,
    });
  }
};

export const updateJobHiringStatusController = async (req, res) => {
  try {
    const { jid, updatedHiringStatus } = req.body;

    const status = await jobModel.findByIdAndUpdate(
      { _id: jid },
      { isOpen: updatedHiringStatus },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Successfully updated hiring status",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while updating hiring status",
      error,
    });
  }
};

export const getRecruiterJobs = async (req, res) => {
  try {
    const { id } = req.body;

    const jobs = await jobModel.find({
      recruiter_id: id,
    });

    res.status(200).send({
      success: true,
      message: "Successfully get recruiter posted jobs",
      jobs,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while getting recruiter posted jobs",
      error,
    });
  }
};
