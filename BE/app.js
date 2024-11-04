const express = require('express');
const cors = require('cors');
require('dotenv').config();

const studentRoutes = require('./routes/student.routes');
const authRoutes = require('./routes/auth.routes');
const { verifyToken } = require('./middleware/auth');

const app = express();

app.use(cors());
app.use(express.json());

// Auth routes (public)
app.use('/api/auth', authRoutes);

// Protected routes (memerlukan token)
app.use('/api/students', verifyToken, studentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});