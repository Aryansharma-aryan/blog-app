const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
    image: String,  // <--- add this line

   author: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User", // ✅ Reference the User model
},

  deleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Post', postSchema);
