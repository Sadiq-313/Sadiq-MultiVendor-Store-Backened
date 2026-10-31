import app from "../src/app.js";
import connectDB from "../src/config/db.js";

let dbConnectionPromise;

export default async function handler(req, res) {
  try {
    if (!dbConnectionPromise) {
      dbConnectionPromise = connectDB();
    }

    await dbConnectionPromise;

    return app(req, res);
  } catch (error) {
    dbConnectionPromise = null;

    console.error("Vercel API Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}