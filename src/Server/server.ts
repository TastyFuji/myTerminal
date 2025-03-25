import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes"
import rewardRoutes from "./routes/hackreward.routes"
import cors from "cors";
import morgan from "morgan";
import checkReward from "./routes/checkreward.routes";


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/api", userRoutes, authRoutes, rewardRoutes, checkReward);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
