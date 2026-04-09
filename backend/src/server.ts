// backend/src/server.ts
import app from './app';
import { connectDB } from './config/db';
import { s3Service } from './services/s3Service';

const PORT = process.env.PORT || 5000;

// initialization for databases and external services
const initializeServices = async () => {
  try {
    await connectDB();
    await s3Service.configureBucket();
    console.log('✅ Services (DB & S3) initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize services:', error);
  }
};

initializeServices();

// Vercel automatically injects the `VERCEL` environment variable.
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Serveur backend démarré sur http://localhost:${PORT}`);
    console.log(`🔒 Accepte les requêtes de : ${process.env.FRONTEND_URL}`);
  });
}

export default app;