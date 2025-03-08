import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 🔹 Salvar desculpa
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
};

// 🔹 Atualizar desculpa
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
};

// 🔹 Excluir desculpa
export const excluirDesculpa = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.desculpa.delete({ where: { id } });
    res.json({ success: true, message: 'Pedido de desculpa excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔹 Votar na desculpa
export const votarDesculpa = async (req, res) => {
  const { id } = req.params;
  const { userId } = req;

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
};

// 🔹 Gerar desculpa
export const gerarDesculpa = async (req, res) => {
  const { categoria, contexto } = req.body;
  const prompt = `crie apenas 1 pedido de desculpas como mensagem criativa no formato de mensagem para categoria ${categoria} e contexto ${contexto}.`;

  try {
    const resultadoTexto = "Exemplo de pedido de desculpas gerado com sucesso.";
    res.json({ success: true, data: { texto: resultadoTexto } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔹 Buscar desculpas
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

// 🔹 Buscar desculpa por ID
export const getDesculpaById = async (req, res) => {
  const { id } = req.params;

  try {
    const desculpa = await prisma.desculpa.findUnique({ where: { id } });
    if (!desculpa) {
      return res.status(404).json({ success: false, message: 'Desculpa não encontrada' });
    }
    res.json({ success: true, data: desculpa });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔹 Ranking de desculpas
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
