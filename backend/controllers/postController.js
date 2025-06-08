const Post = require("../models/Post");


//create post
const createPost = async (req, res) => {
   try {
    const { title, content, author } = req.body;
    
    if (!title || !content || !author) {  
        return res.status(400).json({ message: 'All fields are required' });
    };
    
    const newPost = new Post({
        title,
        content,
        author
    });
    
    await newPost.save();
    res.status(201).json(newPost);
   } catch (error) {
    res.status(500).json({ message: 'Error creating post' });
   }
};


//fetch all posts
const getPosts = async (req, res) =>{
    try {
        const post=  await Post.find();
        if(!post) {
            return res.status(404).json({ message: 'No posts found' });
        }
        res.status(200).json(post);
        
        
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts' });
        
    }
}
const updatePost = async (req, res) => {
  try {
    const { title, content, author } = req.body;

    if (!title || !content || !author) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const { id } = req.params;

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { title, content, author },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ message: 'Error updating post' });
  }
};

 const deletePost = async (req, res) => {
   try {
     const deletedPost = await Post.findByIdAndDelete(req.params.id);
     if (!deletedPost) {
       return res.status(404).json({ message: 'Post not found' });
     }
     res.status(200).json({ message: 'Post deleted successfully' });
   } catch (err) {
     res.status(500).json({ message: err.message });
   }
 };
 
 
 const getPostById = async (req, res) => {
   try {
     const post = await Post.findById(req.params.id);
     if (!post) return res.status(404).json({ message: 'Post not found' });
     res.json(post);
   } catch (err) {
     res.status(500).json({ message: err.message });
   }
 };

 

module.exports = {
    createPost,
    getPosts,
    updatePost,
    deletePost,
    getPostById

}
