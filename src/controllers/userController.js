import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const secret = process.env.JWT_SECRET || 'chave__secreta'; 

export const alterarSenha = async (req, res) => {
  const { senhaAtual, novaSenha } = req.body;
  const { userId } = req; 

  try {
    const user = await prisma.usuario.findUnique({ where: { id: userId } });
    if (!user || user.senha !== senhaAtual) {
      return res.status(401).json({ success: false, message: 'Senha atual inválida' });
    }

    await prisma.usuario.update({
      where: { id: userId },
      data: { senha: novaSenha },
    });

    res.json({ success: true, message: 'Senha alterada com sucesso' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export const minhasDesculpas = async (req, res) => {
  const { userId } = req; 

  try {
    const desculpas = await prisma.desculpa.findMany({
      where: { autorId: userId },
    });

    res.json({ success: true, data: { items: desculpas, total: desculpas.length } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export const registerUser = async (req, res) => {

  const { nomeBase, senha, email } = req.body;
  const username = `${nomeBase}#${Math.random().toString(36).substr(2, 4)}`;

  try {
    const user = await prisma.usuario.create({
      data: { username, nomeBase, senha, email },
    });
    res.json({ success: true, data: { username: user.username } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { username, senha } = req.body;

  try {
    const user = await prisma.usuario.findUnique({ where: { username } });
    if (!user || user.senha !== senha) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username, nomeBase: user.nomeBase, dataCriacao: user.dataCriacao },
      secret,
      { expiresIn: '1d' }
    );
    res.json({ success: true, data: { token } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
