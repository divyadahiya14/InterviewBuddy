import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/interview_buddy');
  const users = await User.find({});
  console.log('USERS IN DB:');
  users.forEach(u => {
    console.log(`- Email: ${u.email} | Name: ${u.name} | Role: ${u.role}`);
  });
  process.exit(0);
};

run().catch(err => {
  console.error(err);
  process.exit(1);
});
