import express from 'express';
import userRoutes from './src/routes/userRoutes.js';
import desculpaRoutes from './src/routes/desculpaRoutes.js';
import { PrismaClient } from '@prisma/client';

const app = express();
const port = 3001;

const prisma = new PrismaClient();

app.use(express.json());
app.use('/usuarios', userRoutes);
app.use('/desculpas', desculpaRoutes);

app.get('/', async (req, res) => {
  try {
    await prisma.$connect();
    res.send('Hello World! Database connected.');
  } catch (error) {
    res.status(500).send('Database connection failed.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
