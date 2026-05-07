import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Problem } from './models.js';

dotenv.config();
//used to fill databse with problems automatically
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/codesprint';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB.');

    // Clear existing problems
    await Problem.deleteMany({});
    console.log('Cleared existing problems.');

    // Read problems from JSON
    const problemsData = fs.readFileSync(path.join(__dirname, 'data', 'problems.json'), 'utf-8');
    const problems = JSON.parse(problemsData);

    // Insert new problems
    const inserted = await Problem.insertMany(problems);
    console.log(`Successfully seeded ${inserted.length} problems!`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
