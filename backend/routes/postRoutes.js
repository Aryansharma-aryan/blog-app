const express = require('express');
const router = express.Router();


// Controllers
const {
  createPost,
  getPosts,
  updatePost,
  deletePost,
  getPostById,
  getMyPosts
} = require('../controllers/postController');

const {
  signup,
  login
} = require('../controllers/AuthController');

const {
  getAllUsers,
  deleteUser,
  getAllPostsByAdmin,
  deletePostByAdmin
} = require('../controllers/AdminController');

// Middleware
const { verifyToken } = require('../middleware/VerifyToken.js');
const { isAdmin } = require('../middleware/adminMiddleware');


// -------------------- Public Routes -------------------- //
router.post('/signup', signup);
router.post('/login', login);
router.get('/posts', getPosts);             // ✅ Public feed
router.get('/posts/:id', getPostById);      // ✅ View single post


// -------------------- Authenticated User Routes -------------------- //
router.get('/my-posts', verifyToken, getMyPosts);
router.post('/posts', verifyToken, createPost);                    // ✅ Create post
router.put('/posts/:id', verifyToken, updatePost);                 // ✅ Update own post
router.delete('/posts/:id', verifyToken, deletePost);              // ✅ Delete own post


// -------------------- Admin-Only Routes -------------------- //
// User Management
router.get('/admin/users', verifyToken, isAdmin, getAllUsers);
router.delete('/admin/users/:id', verifyToken, isAdmin, deleteUser);

// Post Management
router.get('/admin/posts', verifyToken, isAdmin, getAllPostsByAdmin);
router.delete('/admin/posts/:id', verifyToken, isAdmin, deletePostByAdmin);

module.exports = router;
