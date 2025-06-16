const express = require('express');
const router = express.Router();
const uploadss = require('../middleware/upload.js')



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
const verifyToken = require('../middleware/VerifyToken.js');
const { isAdmin } = require('../middleware/adminMiddleware');


// -------------------- Public Routes -------------------- //
router.post('/signup', signup);
router.post('/login', login);
router.get('/posts', getPosts);             // ✅ Public feed
router.get('/posts/:id', getPostById);      // ✅ View single post


// -------------------- Authenticated User Routes -------------------- //
router.get('/getPosts', verifyToken, getMyPosts);
router.post('/create', verifyToken, uploadss.single('image'),createPost);                    // ✅ Create post
router.put('/update/:id', verifyToken,uploadss.single('image'), updatePost);                 // ✅ Update own post
router.delete('/delete/:id', verifyToken, deletePost);              // ✅ Delete own post


// -------------------- Admin-Only Routes -------------------- //
// User Management
router.get('/admin/users', verifyToken, isAdmin, (req, res, next) => {
  console.log("✅ GET /admin/users HIT by:", req.user);
  next();
}, getAllUsers);

router.delete('/admin/users/:id', verifyToken, isAdmin, deleteUser);

// Post Management
router.get('/admin/posts', verifyToken, isAdmin, getAllPostsByAdmin);
router.delete('/admin/posts/:id', verifyToken, isAdmin, deletePostByAdmin);

module.exports = router;
