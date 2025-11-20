const mongoose = require('mongoose');
const URL=process.env.URL || "mongodb+srv://arsharma2951_db_user:aryan2951@cluster0.llmynou.mongodb.net/blog-app"

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
