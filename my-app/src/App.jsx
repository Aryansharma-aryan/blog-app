import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "./components/AdminDashboard";
import AdminRoute from "./components/AdminRoute";

import Home from "./components/Home";
import CreatePost from "./components/CreatePost";
import EditPost from "./components/EditPost";
import PostDetail from "./components/PostDetail";
import PostsList from "./components/PostList";
import Footer from "./components/Footer";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  return (
    <Router>
      <div className="">
        <Routes>
          {/* Public Routes */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          <Route
            path="/create"
            element={
              <PrivateRoute>
                <CreatePost />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <PrivateRoute>
                <EditPost />
              </PrivateRoute>
            }
          />
          <Route
            path="/post/:id"
            element={
              <PrivateRoute>
                <PostDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/posts"
            element={
              <PrivateRoute>
                <PostsList />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
};

export default App;
