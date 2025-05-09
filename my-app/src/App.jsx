import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';



import Home from './components/Home';
import CreatePost from './components/CreatePost';
import EditPost from './components/EditPost';
import PostDetail from './components/PostDetail';
import PostsList from "./components/PostList";
import Footer from './components/Footer';


const App = () => {
  return (
    <Router>
      {/* Fixed Navbar */}
      
      
      {/* Page Content with top padding */}
      <div className="">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/edit/:id" element={<EditPost />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/posts" element={<PostsList />} />
        </Routes>
      </div>
      <Footer/>
    </Router>
  );
};

export default App;
