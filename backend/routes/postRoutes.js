const express=require('express');
const router= express.Router();
const {createPost,getPosts,updatePost,deletePost,getPostById} = require("../controllers/postController")

//create post 
router.post('/create', createPost);
//get posts
router.get('/get', getPosts);
//update
router.put('/update/:id', updatePost);
//delete post
router.delete('/delete/:id', deletePost);

router.get('/:id', getPostById);









module.exports=router;