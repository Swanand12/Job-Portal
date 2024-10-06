import applicationModel from "../models/applicationModel.js";
import fs from "fs";
import companyModel from "../models/companyModel.js";

export const jobApplyController = async (req, res) => {
  try {
    const { job_id, skills, experience, education, name } = req.fields;
    const { resume } = req.files;

    if (!skills) {
      return res.status(200).send({
        success: false,
        message: "Skills is required",
      });
    }
    if (!resume) {
      return res.status(200).send({
        success: false,
        message: "Resume is required",
      });
    }

    const application = await applicationModel.create({
      job_id,
      candidate_id: req.user._id,
      skills,
      experience,
      education,
      name,
    });

    if (resume) {
      application.resume.data = fs.readFileSync(resume.path);
      application.resume.content_type = resume.type;
    }

    await application.save();

    res.status(200).send({
      success: true,
      message: "Successfully applied",
      application,
    });
  } catch (error) {
    res.status(200).send({
      success: false,
      message: "Error while applying for job",
      error,
    });
  }
};

export const getIndividualJobApplications = async (req, res) => {
  try {
    console.log(req.params);
    const applications = await applicationModel
      .find({
        job_id: req.params.jid,
      })
      .select("-resume")
      .populate("candidate_id", "-password");

    res.status(200).send({
      success: true,
      message: "Successfully get applications",
      applications,
    });
  } catch (error) {
    res.status(200).send({
      success: false,
      message: "Error while applying for job",
      error,
    });
  }
};

export const getResumeController = async (req, res) => {
  try {
    const application = await applicationModel
      .findById({ _id: req.params.aid })
      .select("resume")
      .select("name");

    console.log(application);

    if (application) {
      res.set({
        "Content-Type": application.resume.content_type,
        "Content-Disposition": `attachment; filename="resume_${application.name}.pdf"`,
      });
      res.status(200).send(application.resume.data);
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while getting resume",
      error,
    });
  }
};

export const updateApplicationStatusController = async (req, res) => {
  try {
    const { id, updatedStatus } = req.body;

    const status = await applicationModel.findByIdAndUpdate(
      { _id: id },
      { status: updatedStatus },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Successfully updated status",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while updating status",
      error,
    });
  }
};

export const getCandidateApplications = async (req, res) => {
  try {
    const { id } = req.body;

    const applications = await applicationModel
      .find({
        candidate_id: id,
      })
      .select("-resume")
      .populate("job_id");

    console.log(applications);

    res.status(200).send({
      success: true,
      message: "Successfully get candidate applications",
      applications,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while getting candidates applications",
      error,
    });
  }
};
