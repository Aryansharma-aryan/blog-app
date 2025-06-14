// models/User.js
const mongoose=require('mongoose')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    role: {
  type: String,
  enum: ['user', 'admin'],
  default: 'user'
},

    password: {
      type: String,
      required: [true, "Password is required"],
    },
    
  },
  { timestamps: true }
);

module.exports= mongoose.model("User", userSchema);
