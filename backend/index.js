const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./db/db');
const postRoutes = require('./routes/postRoutes');

// Load environment variables
dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 4100;

// Middleware
app.use(express.json());

// Enable CORS with allowed origin from .env
<<<<<<< HEAD
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:5175'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed for this origin: ' + origin));
    }
  },
  credentials: true
}));


=======
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

>>>>>>> f9667146cbcf1ad381bb0ef3505d10a6c0412d64
// Routes
app.use('/api', postRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Blogging Platform API is running...');
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
