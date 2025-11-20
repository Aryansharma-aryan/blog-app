const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./db/db');
const postRoutes = require('./routes/postRoutes');
const path = require('path');

// Load environment variables
dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 4200;

// Middleware
app.use(express.json());

// Allowed Frontends
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:5175',
  'https://blog-verse-lovat.vercel.app',
  'https://my-blogs-g3ms.onrender.com'  // ✅ Your Render frontend URL
];

// CORS
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS not allowed for origin: ' + origin));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
);

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api', postRoutes);

// Root
app.get('/', (req, res) => {
  res.send('Blogging Platform API is running...');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
