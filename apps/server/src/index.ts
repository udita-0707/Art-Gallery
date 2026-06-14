import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@spectrum/database';
import artworkRoutes from './routes/artworks';
import userRoutes from './routes/users';
import exhibitionRoutes from './routes/exhibitions';
import adminRoutes from './routes/admin';

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;
const prisma = new PrismaClient();

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim())
  : null;

if (allowedOrigins) {
  app.use(cors({ origin: allowedOrigins }));
} else {
  app.use(cors());
}
app.use(express.json());

// Startup log helper for routes
console.log('📡 Registering API Routes:');

app.use('/api/artworks', artworkRoutes);
console.log('  -> Registered: /api/artworks');

app.use('/api/users', userRoutes);
console.log('  -> Registered: /api/users');

app.use('/api/exhibitions', exhibitionRoutes);
console.log('  -> Registered: /api/exhibitions');

app.use('/api/admin', adminRoutes);
console.log('  -> Registered: /api/admin');

// Health Check Endpoint
app.get('/api/health', async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ 
      status: 'ok', 
      database: 'connected', 
      environment: process.env.NODE_ENV || 'development' 
    });
  } catch (error: any) {
    res.status(500).json({ 
      status: 'error', 
      database: 'disconnected', 
      error: error.message 
    });
  }
});
console.log('  -> Registered: /api/health');

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({ 
    error: err.message || 'Internal Server Error' 
  });
});

// Establish Database Connection and Start Listening
async function startServer() {
  try {
    console.log('🔌 Connecting to database...');
    await prisma.$connect();
    console.log('✅ DB connected successfully');
    
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to DB on startup:', error);
    process.exit(1);
  }
}

startServer();
