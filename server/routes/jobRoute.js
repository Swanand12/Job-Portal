import express from "express";
import { requireSignIn } from "../middlewares/authMiddleware.js";
import {
  getAllJobsController,
  getCompanyDetails,
  getFilteredJobs,
  getRecruiterJobs,
  getSingleJobController,
  loadMoreJobsController,
  postJobController,
  totalJobsController,
  updateJobHiringStatusController,
} from "../controller/jobController.js";

const router = express.Router();

// POST JOB || METHOD : POST
router.post("/post-job", requireSignIn, postJobController);

// GET ALL JOBS || METHOD : GET
router.get("/get-all-jobs", requireSignIn, getAllJobsController);

// LOAD MORE JOBS || METHOD : GET
router.get("/load-more-jobs/:page", requireSignIn, loadMoreJobsController);

// TOTAL JOBS || METHOD : GET
router.get("/total-jobs", totalJobsController);

// GET COMPANY || METHOD : GET
router.get("/get-company/:cid", getCompanyDetails);

// FILTERED JOBS || METHOD : POST
router.post("/get-jobs", requireSignIn, getFilteredJobs);

// GET SINGLE JOB DETAILS || METHOD : GET
router.get("/get-single-job/:jid", requireSignIn, getSingleJobController);

//  UPDATE JOB HIRING STATUS || METHOD : PUT
router.put(
  "/update-hiring-status",
  requireSignIn,
  updateJobHiringStatusController
);

//  GET CANDIDATE APPLICATIONS || METHOD : POST
router.post("/get-recruiter-jobs", requireSignIn, getRecruiterJobs);

export default router;
