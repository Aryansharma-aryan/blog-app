const User = require('../models/User');
const Post = require('../models/Post');

// Get all users
const getAllUsers = async (req, res) => {
  console.log("🧠 [ADMIN ACCESS] getAllUsers called by:", req.user); // Log who is accessing

  try {
    const users = await User.find();
    console.log("✅ Users fetched:", users.length);

    if (!users || users.length === 0) {
      console.warn("⚠️ No users found");
      return res.status(404).json({ message: 'No users found' });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error("❌ Error fetching users:", error.message);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};


// Delete user by ID
const deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    await Post.updateMany({ userId }, { $set: { deleted: true } });
    res.status(200).json({ message: 'User deleted successfully', deletedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

// Get all posts (non-deleted only)
const getAllPostsByAdmin = async (req, res) => {
  console.log("🧠 [ADMIN ACCESS] getAllPostsByAdmin called by:", req.user);

  try {
    const posts = await Post.find({ deleted: false });
    console.log("✅ Posts fetched:", posts.length);

    res.status(200).json(posts);
  } catch (error) {
    console.error("❌ Error fetching posts:", error.message);
    res.status(500).json({ message: 'Error fetching posts', error: error.message });
  }
};


// Soft delete post by ID
const deletePostByAdmin = async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await Post.findById(postId);
    if (!post || post.deleted) {
      return res.status(404).json({ message: 'Post not found or already deleted' });
    }
    post.deleted = true;
    await post.save();
    res.status(200).json({ message: 'Post soft-deleted successfully', post });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post', error: error.message });
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  getAllPostsByAdmin,
  deletePostByAdmin
};
