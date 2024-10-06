import express from "express";
import {
  addCompanyController,
  getAllCompaniesController,
} from "../controller/companyController.js";
import formidable from "express-formidable";

const router = express.Router();

// ADD COMPANY || METHOD : POST
router.post("/add-company", formidable(), addCompanyController);

// ADD COMPANY || METHOD : POST
router.get("/get-all-companies", getAllCompaniesController);

export default router;
