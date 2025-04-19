const express = require('express');
const session = require('express-session');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth.js');

const app = express();

app.use(express.json());

// ✅ FIXED: CORS origin must be the full origin (not a specific path)
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true //keeps session intact
}));

app.use(session({
  secret: 'mysecretkey',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // true in production with HTTPS
    maxAge: 1000 * 60 * 60, // 1 hour
  }
}));

app.use('/api/auth', authRoutes);

// ✅ Runs independently on port 5001
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Auth server running on port ${PORT}`));

