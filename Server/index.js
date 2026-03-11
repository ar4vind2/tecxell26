import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import admitRouter from './routes/admin.js';
import userRouter from './routes/user.js';

dotenv.config();

const app = express();

// --- UPDATED CORS CONFIGURATION ---
const allowedOrigins = [
  'https://tecxell.mitsmediaclub.com',
  'https://tecxell.mgmits.ac.in',
  'http://localhost:5173' // Keep for local development
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ DB Connected Successfully'))
  .catch(err => {
    console.error('❌ DB Connection Error:', err.message);
    process.exit(1);
  });

app.use('/api', userRouter, admitRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});


app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
