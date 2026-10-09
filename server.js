import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try{
    await connectDB();

  app.listen(PORT, () => {
    console.log(`Cartivo Server running on port ${PORT}`);
  });
  } catch (error) {
    console.error("Error starting server:", error.message);
  }
};

startServer();