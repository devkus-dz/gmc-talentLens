// backend/src/config/db.ts
import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL as string);
    console.log(`✅ MongoDB Connecté : ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Erreur de connexion MongoDB :`, error);
    process.exit(1); // Arrête le serveur si la DB plante
  }
};