import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./configs/db.js";

import userRouter from "./routes/userRoutes.js";
import resumeRouter from "./routes/resumeRoutes.js";
import aiRouter from "./routes/aiRoutes.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 7001;

// ===============================
// Middlewares
// ===============================
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

// ===============================
// Health Check Route
// ===============================
app.get("/", (req, res) => {
  res.status(200).send("Server is live...");
});

// ===============================
// API Routes
// ===============================
app.use("/api/users", userRouter);
app.use("/api/resumes", resumeRouter);
app.use("/api/ai", aiRouter);

// ===============================
// Force restart: 5
// ===============================
// ===============================
// Force restart: 5
// ===============================
const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ Database connected successfully");

    // Only listen if not running as a serverless function (optional check, but good for local dev)
    // For simplicity in this specific ESM setup, we will just start the server if this file is the entry point
    // but we can't easily detect that in all environments without complexity.
    // However, Vercel imports this file. If we call app.listen(), Vercel might error or timeout.
    // Better pattern:

    if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
      app.listen(PORT, () => {
        console.log(`🚀 Server is running on http://localhost:${PORT}`);
      });
    }

  } catch (error) {
    console.error("❌ Error starting server:", error.message);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  startServer();
} else {
  // For Vercel, we just want to connect to DB and export app
  connectDB().then(() => console.log("DB Connected for Serverless"));
}

export default app;
