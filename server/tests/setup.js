import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer;

// Hindi Comment: Sabhi tests run hone se pehle In-Memory MongoDB server start kiya
export const setupTestDB = () => {
  beforeAll(async () => {
    // Agar pehle se koi connection open ho toh close karenge
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  // Hindi Comment: Har individual test run ke baad database clean karenge taaki tests isolated rahein
  afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  // Hindi Comment: Sabhi tests complete hone ke baad connection close aur memory server stop kiya
  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
  });
};
