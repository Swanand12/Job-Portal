import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const requireSignIn = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization) {
      token = req.headers.authorization;
      const decode = JWT.verify(token, process.env.JWT_SECRET_KEY);

      req.user = await userModel.findById({ _id: decode.id });
      next();
    }
  } catch (error) {
    console.log(error);
  }
};

export const isCandidate = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (user.role !== "candidate") {
      res.status(401).send({
        success: false,
        message: "UnAuthorized Access",
      });
    }
    next();
  } catch (error) {
    res.status(401).send({
      success: false,
      message: "UnAuthorized Access",
    });
  }
};

export const isRecruiter = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (user.role !== "recruiter") {
      res.status(401).send({
        success: false,
        message: "UnAuthorized Access",
      });
    }
    next();
  } catch (error) {
    res.status(401).send({
      success: false,
      message: "UnAuthorized Access",
    });
  }
};
