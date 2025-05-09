const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./db/db');
const postRoutes = require('./routes/postRoutes');


dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 4100;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', postRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Blogging Platform API is running...');
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
