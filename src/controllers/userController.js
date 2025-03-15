import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const secret = process.env.JWT_SECRET || 'chave__secreta';


export const registerUser = async (req, res) => {
  const { nomeBase, senha, email } = req.body;
  // Gerar username único
  const username = nomeBase.toLowerCase().replace(/\s/g, '_') + '#' + 
  Date.now().toString(36).substring(2, 6);

  try {
    if (email) {
      const existingUser = await prisma.usuario.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'E-mail já cadastrado' });
      }
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);
    const user = await prisma.usuario.create({
      data: {
        username,
        nomeBase,
        senha: senhaCriptografada,
        ...(email && { email })
      },
    });

    const token = jwt.sign(
      { userId: user.id, username: user.username, nomeBase: user.nomeBase, dataCriacao: user.dataCriacao },
      secret,
      { expiresIn: '1d' }
    );

    res.json({ success: true, data: { username: user.username, token: token } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔹 Login de usuário
export const loginUser = async (req, res) => {
  const { username, email, senha } = req.body;

  try {
    let user;
    if (email) {
      user = await prisma.usuario.findUnique({ where: { email } });
    } else if (username) {
      user = await prisma.usuario.findUnique({ where: { username } });
    }

    if (!user || !(await bcrypt.compare(senha, user.senha))) {
      return res.status(401).json({ success: false, message: 'Credenciais inválidas' });
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

// 🔹 Alteração de senha
export const alterarSenha = async (req, res) => {
  const { senhaAtual, novaSenha } = req.body;
  const { userId } = req;

  if (!userId) {
    return res.status(401).json({ success: false, message: 'Usuário não autenticado' });
  }

  try {
    const user = await prisma.usuario.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ success: false, message: 'Usuário não encontrado' });

    const senhaValida = await bcrypt.compare(senhaAtual, user.senha);
    if (!senhaValida) return res.status(401).json({ success: false, message: 'Senha atual inválida' });

    const novaSenhaCriptografada = await bcrypt.hash(novaSenha, 10);
    await prisma.usuario.update({ where: { id: userId }, data: { senha: novaSenhaCriptografada } });

    res.json({ success: true, message: 'Senha alterada com sucesso' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔹 Minhas desculpas
export const minhasDesculpas = async (req, res) => {
  const { userId } = req;

  try {
    const desculpas = await prisma.desculpa.findMany({ where: { autorId: userId }, orderBy: { dataCriacao: 'desc' } });

    // Preparando terreno para futura implementação de "Votos"
    const desculpasFormatadas = desculpas.map((d) => ({
      ...d,
      contadorVotos: 0,
      votadaPeloUsuario: false
    }))

    res.json({ success: true, data: desculpasFormatadas });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
