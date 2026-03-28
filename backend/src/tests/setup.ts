import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Connects to the dedicated MongoDB Atlas Test Database.
 * @returns {Promise<void>}
 */
export const connectTestDB = async (): Promise<void> => {
    const testDbUri = process.env.TEST_DATABASE_URL;

    if (!testDbUri) {
        throw new Error("❌ TEST_DATABASE_URL is missing from your .env file!");
    }

    // Prevent Mongoose from throwing strictQuery warnings in tests
    mongoose.set('strictQuery', true);

    await mongoose.connect(testDbUri);
    console.log('✅ Connected to MongoDB Atlas Test Database');
};

/**
 * Closes the database connection. 
 * We deliberately DO NOT drop the database here so it can be reused.
 * @returns {Promise<void>}
 */
export const closeTestDB = async (): Promise<void> => {
    await mongoose.connection.close();
    console.log('🔌 Disconnected from Test Database');
};

/**
 * Removes all data from all collections.
 * Run this between every individual test to ensure a clean slate.
 * @returns {Promise<void>}
 */
export const clearTestDB = async (): Promise<void> => {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
        const collection = collections[key];
        // Empty the collection, but keep the collection structure intact
        await collection.deleteMany({});
    }
};