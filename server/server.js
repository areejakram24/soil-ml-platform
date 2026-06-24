import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';

// Load environment variables immediately at the absolute top
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Global Middlewares
app.use(cors());
app.use(express.json()); // Parses incoming application/json requests

// Basic API Health Status Probe
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy', environment: process.env.NODE_ENV });
});

// TODO: Register modular router structures once files are created
// import authRoutes from './routes/authRoutes.js';
// import soilAnalysisRoutes from './routes/soilAnalysisRoutes.js';
// app.use('/api/auth', authRoutes);
// app.use('/api/soil-analysis', soilAnalysisRoutes);

// Global Error Catch-All Middleware
app.use((err, req, res, next) => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  console.error('🚨 System Exception Intercepted:', err.message);
  
  if (isDevelopment) {
    console.error(err.stack);
  }

  res.status(500).json({ 
    error: 'An internal server transaction failed',
    message: isDevelopment ? err.message : undefined 
  });
});

// Initialize connections and start server pipeline
const startServer = async () => {
  try {
    // Await db before binding to network port
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`🚀 Core engine listening at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Critical system failure during bootstrap:', error.message);
    process.exit(1);
  }
};

startServer();