
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

// importing Routes
import authRoutes from './routes/authRoutes';

// .env variables
dotenv.config();

const app: Application = express();

// --- MIDDLEWARES ---

// JSON Parser
app.use(express.json());

// Cookies
app.use(cookieParser());

// CORS settings
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true, // HTTP-Only cookies
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// --- ROUTES ---

// Route (Health Check)
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'TalentLens API is running smoothly! 🚀'
  });
});

app.use('/api/auth', authRoutes);


export default app;