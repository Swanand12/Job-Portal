import express from "express";
import {
  loginController,
  registerController,
} from "../controller/authController.js";
import {
  isCandidate,
  isRecruiter,
  requireSignIn,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// REGISTER || METHOD : POST
router.post("/register", registerController);

// LOGIN || METHOD : POST
router.post("/login", loginController);

// CANDIDATE AUTHORIZATION || METHOD : GET
router.get("/candidate-auth", requireSignIn, isCandidate, (req, res) => {
  res.send({ success: true, ok: true });
});

// RECRUITER AUTHORIZATION || METHOD : GET
router.get("/recruiter-auth", requireSignIn, isRecruiter, (req, res) => {
  res.send({
    success: true,
    ok: true,
  });
});

export default router;
