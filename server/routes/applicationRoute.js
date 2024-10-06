import express from "express";
import { requireSignIn } from "../middlewares/authMiddleware.js";
import formidable from "express-formidable";
import {
  getCandidateApplications,
  getIndividualJobApplications,
  getResumeController,
  jobApplyController,
  updateApplicationStatusController,
} from "../controller/applicationController.js";

const router = express.Router();

// SUBMIT APPLICATION FOR JOB || METHOD : POST
router.post(
  "/post-application",
  requireSignIn,
  formidable(),
  jobApplyController
);

//  GET APPLICATIONS FOR INDIVIDUAL JOB || METHOD : GET
router.get(
  "/get-job-applications/:jid",
  requireSignIn,
  getIndividualJobApplications
);

//  GET RESUME|| METHOD : PUT
router.get("/get-resume/:aid", getResumeController);

//  UPDATE APPLICATION STATUS || METHOD : PUT
router.put("/update-status", requireSignIn, updateApplicationStatusController);

//  GET CANDIDATE APPLICATIONS || METHOD : POST
router.post(
  "/get-candidate-applications",
  requireSignIn,
  getCandidateApplications
);

export default router;
