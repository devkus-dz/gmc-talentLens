// backend/src/server.ts
import app from './app';
import { connectDB } from './config/db';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // 1. On attend que la DB soit connectée avant de lancer le serveur
  await connectDB();
  
  // 2. On lance l'API
  app.listen(PORT, () => {
    console.log(`🚀 Serveur backend démarré sur http://localhost:${PORT}`);
    console.log(`🔒 Accepte les requêtes de : ${process.env.FRONTEND_URL}`);
  });
};

startServer();