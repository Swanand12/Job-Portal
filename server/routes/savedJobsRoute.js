import express from "express";
import { requireSignIn } from "./../middlewares/authMiddleware.js";
import {
  getSavedJobsController,
  saveJobsController,
  unSaveJobsController,
} from "../controller/savedJobController.js";

const router = express.Router();

// SAVE JOB || METHOD : POST
router.post("/save-job", requireSignIn, saveJobsController);

// UNSAVE JOB || METHOD : DELETE
router.delete("/unsave-job/:jid", requireSignIn, unSaveJobsController);

// GET SAVED JOBS || METHOD : GET
router.get("/get-saved-jobs", requireSignIn, getSavedJobsController);

export default router;
