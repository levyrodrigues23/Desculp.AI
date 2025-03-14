import express from 'express';
import userRoutes from './src/routes/userRoutes.js';
import desculpaRoutes from './src/routes/desculpaRoutes.js';
import { PrismaClient } from '@prisma/client';
import cors from 'cors'

const app = express();
const prisma = new PrismaClient();

// Middleware de parsing de JSON
app.use(express.json());

// Configuração primária do CORS
app.use(cors());

// Serve arquivos estáticos da pasta front-end
app.use(express.static('frontclone/desculpai-web/dist'));

// Definição das rotas
app.use('/usuarios', userRoutes);
app.use('/desculpas', desculpaRoutes);

// Página inicial estilizada para a API
app.get('/', async (req, res) => {
  try {
    await prisma.$connect();
    res.send(`
      <!DOCTYPE html>
      <html lang="pt-br">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>API Desculp.AI</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #1e1e2e;
            color: #ffffff;
            text-align: center;
            padding: 50px;
          }
          h1 {
            color: #f39c12;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: #282a36;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0px 4px 10px rgba(255, 165, 0, 0.5);
          }
          a {
            color: #f39c12;
            text-decoration: none;
            font-weight: bold;
          }
          a:hover {
            text-decoration: underline;
          }
          .status {
            margin-top: 20px;
            padding: 10px;
            background: #2ecc71;
            border-radius: 5px;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🚀 API Desculp.AI</h1>
          <p>Bem-vindo à API oficial do Desculp.AI! 🎉</p>
          <p>Confira as rotas disponíveis:</p>
          <div class="status">Conexão estabelecida com sucesso ✅ </div>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).send(`
      <html>
      <head><title>Erro</title></head>
      <body style="background:#1e1e2e;color:white;text-align:center;padding:50px;">
        <h1 style="color:#e74c3c;">⚠ Erro na API</h1>
        <p>Falha ao conectar ao banco de dados.</p>
      </body>
      </html>
    `);
  }
});

// Middleware para tratar rotas não encontradas
app.use((req, res) => {
  res.status(404).send(`
    <html>
    <head><title>404 - Não Encontrado</title></head>
    <body style="background:#1e1e2e;color:white;text-align:center;padding:50px;">
      <h1 style="color:#e74c3c;">404 - Rota não encontrada</h1>
      <p>Verifique a URL e tente novamente.</p>
    </body>
    </html>
  `);
});

// Middleware de erro global
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).send(`
    <html>
    <head><title>500 - Erro Interno</title></head>
    <body style="background:#1e1e2e;color:white;text-align:center;padding:50px;">
      <h1 style="color:#e74c3c;">500 - Erro no servidor</h1>
      <p>Algo deu errado! Nossa equipe já foi notificada.</p>
    </body>
    </html>
  `);
});

const PORT = process.env.PORT || 3001;
// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});