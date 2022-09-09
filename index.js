import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import db from './config/Database.js';
import dotenv from 'dotenv';
import router from './routes/UserRoute.js';
dotenv.config();
const app = express();

try {
  await db.authenticate();
  console.log('Database connected');
} catch (error) {
  console.error(error);
}

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());

app.use(cookieParser());
app.use(router);

app.listen(5000, () => console.log('Server up and running...'));
