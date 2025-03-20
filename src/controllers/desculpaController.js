import { PrismaClient } from '@prisma/client';
import { GoogleGenerativeAI } from '@google/generative-ai';
import jwt from 'jsonwebtoken'
import 'dotenv/config';

const prisma = new PrismaClient();

export const salvarDesculpa = async (req, res) => {
  const { categoria, contexto, texto } = req.body;
  const { userId } = req;
  
  if (!categoria || !contexto || !texto) {
    return res.status(400).json({ 
      success: false, 
      message: 'Categoria, contexto e texto são obrigatórios'
    });
  }

  try {
    const desculpa = await prisma.desculpa.create({
      data: { 
        texto, 
        categoria, 
        contexto, 
        autorId: userId 
      },
    });

    res.json({ 
      success: true, 
      data: {
        id: desculpa.id,
        texto: desculpa.texto,
        categoria: desculpa.categoria,
        contexto: desculpa.contexto,
        dataCriacao: desculpa.dataCriacao.toISOString(),
        autorId: desculpa.autorId,
        contadorVotos: 0,
        votadaPeloUsuario: false
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const atualizarDesculpa = async (req, res) => {
  const { id } = req.params;
  const { texto } = req.body;
  
  try {
    const acharDesculpa = await prisma.desculpa.findUnique({ where: { id } });
    if (!acharDesculpa) {
      return res.status(404).json({ 
        success: false, 
        message: 'Desculpa não encontrada' 
      });
    }
    const desculpa = await prisma.desculpa.update({ where: { id }, data: { texto } });
    
    res.json({ success: true, data: { id: desculpa.id, texto: desculpa.texto , categoria: desculpa.categoria, contexto: desculpa.contexto} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const excluirDesculpa = async (req, res) => {
  const { id } = req.params;
  const { userId } = req;
  
  try {
    const desculpa = await prisma.desculpa.findUnique({ 
      where: { id },
      include: { votos: true } // Incluindo votos para saber se existem
    });
    
    if (!desculpa) {
      return res.status(404).json({ 
        success: false, 
        message: 'Desculpa não encontrada' 
      });
    }
    
    // Verificando se o usuário é o autor da desculpa
    if (desculpa.autorId !== userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Você não tem permissão para excluir esta desculpa' 
      });
    }
    
    // $transaction - garante que tudo seja excluído ou nada seja
    await prisma.$transaction(async (prismaClient) => {
      // Excluindo primeiro todos os votos associados
      if (desculpa.votos.length > 0) {
        await prismaClient.voto.deleteMany({
          where: { desculpaId: id }
        });
      }
      
      // Depois excluindo a desculpa
      await prismaClient.desculpa.delete({
        where: { id }
      });
    });
    
    res.json({ 
      success: true, 
      message: 'Pedido de desculpa excluído com sucesso' 
    });
  } catch (error) {
    console.error('Erro ao excluir desculpa:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao excluir a desculpa',
      error: { details: error.message }
    });
  }
};

export const votarDesculpa = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req;

    // Verificar se a desculpa existe
    const desculpa = await prisma.desculpa.findUnique({
      where: { id },
      include: {
        votos: true
      }
    });

    if (!desculpa) {
      return res.status(404).json({
        success: false,
        message: 'Desculpa não encontrada'
      });
    }

    // Verificar se o usuário já votou
    const votoExistente = await prisma.voto.findFirst({
      where: {
        desculpaId: id,
        usuarioId: userId
      }
    });

    let liked = false;

    if (votoExistente) {
      // Remover voto
      await prisma.voto.delete({
        where: { id: votoExistente.id }
      });
    } else {
      // Adicionar voto
      await prisma.voto.create({
        data: {
          desculpaId: id,
          usuarioId: userId
        }
      });
      liked = true;
    }

    // Obter a contagem atualizada de votos
    const votosAtualizados = await prisma.voto.count({
      where: {
        desculpaId: id
      }
    });

    res.json({
      success: true,
      data: {
        liked,
        contadorVotos: votosAtualizados
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao votar em desculpa',
      error: { details: error.message }
    });
  }
};

export const gerarDesculpa = async (req, res) => {
  try {
    const { categoria, contexto } = req.body;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `Crie apenas 1 pedido de desculpas como mensagem criativa para categoria ${categoria} e contexto ${contexto}, sem caracteres especiais.`;
    
    const resultado = await model.generateContent(prompt);
    const limparFormatacao = (texto) => texto.replace(/[\n\r\t\*#`/\\]/g, ' ').replace(/\s+/g, ' ').trim();
    
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
      skip, take: parseInt(limit), orderBy: { [ordenar]: 'desc' },
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
      return res.status(404).json({ success: false, message: 'Desculpa não encontrada' });
    }
    res.json({ success: true, data: desculpa });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRanking = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;

    // Extrair id do token
    let userId = null
    if (req.headers.authorization) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        // Assumindo que você tenha importado jwt
        const decoded = jwt.decode(token);
        userId = decoded?.id || decoded?.userId;
      } catch (error) {
        console.error('Erro ao decodificar token:', error);
      }
    }

    // Buscar desculpas ordenadas por contagem de votos
    const desculpas = await prisma.desculpa.findMany({
      take: limit,
      include: {
        autor: {
          select: { 
            id: true,
            username: true 
          }
        },
        _count: {
          select: { votos: true }
        },
        votos: userId ? {
          where: {
            usuarioId: userId
          },
          select: {
            id: true
          },
          take: 1 // Precisamos apenas verificar se existe algum
        } : false
      },
      orderBy: {
        votos: {
          _count: 'desc'
        }
      }
    });

    // Formatar o resultado conforme esperado pelo frontend
    const resultado = desculpas.map(d => ({
      id: d.id,
      texto: d.texto,
      categoria: d.categoria,
      contexto: d.contexto,
      dataCriacao: d.dataCriacao.toISOString(),
      autorId: d.autorId,
      autor: {
        id: d.autor.id,
        username: d.autor.username
      },
      contadorVotos: d._count.votos,
      votadaPeloUsuario: userId ? d.votos.length > 0 : false
    }));

    return res.json({
      success: true,
      data: resultado
    });
    
  } catch (error) {
    console.error('Erro ao obter ranking:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao obter ranking de desculpas',
      error: { details: error.message }
    });
  }
};