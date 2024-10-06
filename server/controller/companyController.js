import companyModel from "../models/companyModel.js";
import fs from "fs";

export const addCompanyController = async (req, res) => {
  try {
    const { companyName } = req.fields;
    const { companyLogo } = req.files;

    const existingCompany = await companyModel.findOne({ name: companyName });
    if (existingCompany) {
      return res.status(400).send({
        success: false,
        message: "Company already exists",
      });
    }

    const company = await companyModel.create({ name: companyName });
    company.logo.data = fs.readFileSync(companyLogo.path);
    company.logo.content_type = companyLogo.type;
    await company.save();
    res.status(200).send({
      success: true,
      message: "Successfully added Company",
      newCompany: company,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while Adding Company",
      error,
    });
  }
};

export const getAllCompaniesController = async (req, res) => {
  try {
    const companies = await companyModel.find({});
    res.status(200).send({
      success: true,
      message: "Successfully get all companies",
      companies: companies,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while Adding Company",
      error,
    });
  }
};
