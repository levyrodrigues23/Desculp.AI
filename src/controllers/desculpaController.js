import { PrismaClient } from '@prisma/client';
import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';
const prisma = new PrismaClient();

export const salvarDesculpa = async (req, res) => {
  const { categoria, contexto, texto } = req.body;
  const { userId } = req;

  try {
    const desculpa = await prisma.desculpa.create({
      data: { texto, categoria, contexto, autorId: userId },
    });
    res.json({ success: true, data: { id: desculpa.id, texto: desculpa.texto } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export const atualizarDesculpa = async (req, res) => {
  const { id } = req.params;
  const { texto } = req.body;

  try {
    const desculpa = await prisma.desculpa.update({
      where: { id },
      data: { texto },
    });
    res.json({ success: true, data: { id: desculpa.id, texto: desculpa.texto } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export const excluirDesculpa = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.desculpa.delete({ where: { id } });
    res.json({ success: true, message: 'Pedido de desculpa excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export const votarDesculpa = async (req, res) => {
  const { id } = req.params;
  const { userId } = req; // Supondo que o ID do usuário está no token JWT

  try {
    const votoExistente = await prisma.voto.findUnique({
      where: { usuarioId_desculpaId: { usuarioId: userId, desculpaId: id } },
    });

    if (votoExistente) {
      return res.status(400).json({ success: false, message: 'Você já votou neste pedido de desculpa' });
    }

    await prisma.voto.create({
      data: { usuarioId: userId, desculpaId: id },
    });

    res.json({ success: true, message: 'Voto registrado com sucesso' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export const gerarDesculpa = async (req, res) => {
  try {
    const { categoria, contexto } = req.body;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `crie apenas 1 pedido de desculpas como mensagem criativa no formato de mensagem para categoria ${categoria} e contexto ${contexto}. e não use caracteres de formtação e símbolos especiais de markdown/texto. `;
    const resultado = await model.generateContent(prompt);
    const limparFormatacao = (texto) => {
      return texto
        .replace(/\n/g, ' ')           // Remove quebras de linha
        .replace(/\r/g, ' ')           // Remove retornos de carro
        .replace(/\t/g, ' ')           // Remove tabulações
        .replace(/\*\*/g, '')          // Remove asteriscos duplos
        .replace(/\*/g, '')            // Remove asteriscos simples
        .replace(/#{1,6}\s?/g, '')     // Remove símbolos de título markdown
        .replace(/`/g, '')             // Remove backticks
        .replace(/\//g, '')            // Remove barras
        .replace(/\\/g, '')            // Remove contra-barras
        .replace(/\s+/g, ' ')          // Remove múltiplos espaços
        .trim();                       // Remove espaços no início e fim
    };
    const resultadoTexto = limparFormatacao(resultado.response.text());
    res.json({ success: true, data: { texto: resultadoTexto } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }



};

export const getDesculpas = async (req, res) => {
  const { page = 1, limit = 10, ordenar = 'votos' } = req.query;
  const skip = (page - 1) * limit;

  try {
    const desculpas = await prisma.desculpa.findMany({
      skip,
      take: parseInt(limit),
      orderBy: { [ordenar]: 'desc' },
    });
    const total = await prisma.desculpa.count();
    const paginas = Math.ceil(total / limit);

    res.json({ success: true, data: { items: desculpas, total, paginas } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDesculpaById = async (req, res) => {
  const { id } = req.params;

  try {
    const desculpa = await prisma.desculpa.findUnique({ where: { id } });
    if (!desculpa) {
      return res.status(404).json({ success: false, message: 'Desculpa not found' });
    }
    res.json({ success: true, data: desculpa });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRanking = async (req, res) => {
  const { limit = 10 } = req.query;

  try {
    const desculpas = await prisma.desculpa.findMany({
      take: parseInt(limit),
      orderBy: { votos: 'desc' },
    });
    res.json({ success: true, data: { items: desculpas } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
