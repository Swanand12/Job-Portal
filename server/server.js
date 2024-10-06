import express from "express";
import dotenv from "dotenv";
import ConnectDB from "./config/db.js";
import morgan from "morgan";
import cors from "cors";
import authRoute from "./routes/authRoute.js";
import companyRoute from "./routes/companyRoute.js";
import jobRoute from "./routes/jobRoute.js";
import applicationRoute from "./routes/applicationRoute.js";
import savedJobsRoute from "./routes/savedJobsRoute.js";

dotenv.config();

ConnectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/api/v1/saved-jobs", savedJobsRoute);

app.get("/", (req, res) => {
  res.send({
    message: "Welcome to Job-Portal",
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
