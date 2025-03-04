import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const criarDesculpa = async (req, res) => {
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

  const { categoria, contexto } = req.body;
  const texto = `Pedido de desculpa gerado pela IA para a categoria ${categoria} e contexto ${contexto}.`;

  try {
    const desculpa = await prisma.desculpa.create({
      data: { texto, categoria, contexto, autorId: 'some-author-id' }, // Substitua 'some-author-id' pelo ID do autor real
    });
    res.json({ success: true, data: { texto: desculpa.texto } });
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
