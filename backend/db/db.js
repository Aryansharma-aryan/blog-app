const mongoose = require('mongoose');

const URL =
  process.env.URL ||
  "mongodb+srv://arsharma2951_db_user:aryan2951@cluster0.llmynou.mongodb.net/blog-app";

const connectDB = async () => {
  try {
    await mongoose.connect(URL);
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    console.log("⚠️ Server will continue running without DB connection...");
    // ❗ DO NOT EXIT — keep server alive so CORS can run
  }
};

module.exports = connectDB;
