import userModel from "../models/userModel.js";
import { comparePasword, hashedPassword } from "./../helper/authHelper.js";
import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name) {
      return res.status(500).send({
        success: false,
        message: "Name is required",
      });
    }
    if (!email) {
      return res.status(500).send({
        success: false,
        message: "Email is required",
      });
    }
    if (!password) {
      return res.status(500).send({
        success: false,
        message: "Password is required",
      });
    }
    if (!role) {
      return res.status(500).send({
        success: false,
        message: "Select role",
      });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).send({
        success: false,
        message: "Email is already registered. Please Login!",
      });
    }

    const hashPassword = await hashedPassword(password);

    const user = await userModel.create({
      name,
      email,
      password: hashPassword,
      role,
    });

    return res.status(200).send({
      success: true,
      message: "Successfully Registered",
      user,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in registering user process",
      error,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(500).send({
        success: false,
        message: "Email is required",
      });
    }
    if (!password) {
      return res.status(500).send({
        success: false,
        message: "Password is required",
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(500).send({
        success: false,
        message: "Email is not registered",
      });
    }

    const match = await comparePasword(password, user.password);
    if (!match) {
      return res.status(500).send({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    return res.status(200).send({
      success: true,
      message: "Successfully Login",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while login process",
      error,
    });
  }
};
