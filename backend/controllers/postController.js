const Post = require("../models/Post");

// ============================
// CREATE POST
// ============================
const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const newPost = new Post({
      title,
      content,
      author: req.user.name || req.user.email,
      userId: req.user.id
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post' });
  }
};

// ============================
// GET ALL NON-DELETED POSTS
// ============================
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({ deleted: false }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts' });
  }
};

// ============================
// GET MY POSTS ONLY
// ============================
const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.user.id, deleted: false }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching your posts' });
  }
};

// ============================
// GET A SINGLE POST
// ============================
const getPostById = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id, deleted: false });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============================
// UPDATE POST
// ============================
const updatePost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post || post.deleted) return res.status(404).json({ message: 'Post not found' });

    if (post.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }

    post.title = title || post.title;
    post.content = content || post.content;

    const updatedPost = await post.save();
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Error updating post' });
  }
};

// ============================
// DELETE POST (SOFT DELETE)
// ============================
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post || post.deleted) return res.status(404).json({ message: 'Post not found' });

    // 🔐 Allow owner OR admin to delete
    const isOwner = post.userId.toString() === req.user.id;
    const isAdmin = req.user.isAdmin;

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    post.deleted = true; // Soft delete
    await post.save();

    res.status(200).json({ message: 'Post deleted (soft) successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPost,
  getPosts,
  getMyPosts,
  getPostById,
  updatePost,
  deletePost
};
