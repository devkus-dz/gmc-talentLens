// backend/src/server.ts
import app from './app';
import { connectDB } from './config/db';
import { s3Service } from './services/s3Service';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    await s3Service.configureBucket();

    app.listen(PORT, () => {
      console.log(`🚀 Serveur backend démarré sur http://localhost:${PORT}`);
      console.log(`🔒 Accepte les requêtes de : ${process.env.FRONTEND_URL}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }

};

startServer();