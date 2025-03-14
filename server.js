import express from 'express';
import userRoutes from './src/routes/userRoutes.js';
import desculpaRoutes from './src/routes/desculpaRoutes.js';
import { PrismaClient } from '@prisma/client';

const app = express();
 // Use a porta definida em variáveis de ambiente ou a padrão 3001
const prisma = new PrismaClient();

// Middleware de parsing de JSON
app.use(express.json());

// Serve arquivos estáticos da pasta front-end
app.use(express.static('frontclone/desculpai-web/dist'));

// Definição das rotas
app.use('/usuarios', userRoutes);
app.use('/desculpas', desculpaRoutes);

// Rota inicial para testar a conexão com o banco de dados
app.get('/', async (req, res) => {
  try {
    await prisma.$connect();
    res.send('Hello World! Database connected.');
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).send('Database connection failed.');
  }
});

// Middleware para tratar rotas não encontradas
app.use((req, res) => {
  res.status(404).send('Route not found.');
});

// Middleware de erro global
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).send('Internal Server Error.');
});

const PORT = process.env.PORT || 3001;
// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
