const Post = require("../models/Post");

// ============================
// CREATE POST
// ============================

 const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    // Make sure user info is available from middleware
    const userId = req.user.id;
        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;


    const post = new Post({
      title,
      content,
            image: imagePath,


      author: userId, // ✅ Assign author from token
    });

    await post.save();

    res.status(201).json({ message: "Post created successfully", post });
  } catch (err) {
    console.error("Post creation error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({ deleted: false })
      .populate('author', 'name email') // optional: include author's name/email
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Error fetching posts' });
  }
};


// ============================
// GET ALL NON-DELETED POSTS
// ============================
const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user.id, deleted: false }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching your posts' });
  }
};


// ============================
// GET MY POSTS ONLY
// ============================

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
    const { id } = req.params;
    const { title, content } = req.body;

    const post = await Post.findById(id);
    if (!post || post.deleted) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }

    post.title = title || post.title;
    post.content = content || post.content;

    // ✅ Only update image if a new file is uploaded
    if (req.file) {
      post.image = `/uploads/${req.file.filename}`;
    }

    const updatedPost = await post.save();
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error('Update error:', error);
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

    const isOwner = post.author.toString() === req.user.id;
    const isAdmin = req.user.isAdmin;

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    post.deleted = true;
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
