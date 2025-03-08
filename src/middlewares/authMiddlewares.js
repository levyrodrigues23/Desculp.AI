import jwt from 'jsonwebtoken';  // Adicione esta linha


const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // 'Bearer <token>'
  
    if (!token) {
      return res.status(401).json({ success: false, message: 'Token não fornecido' });
    }
  
    jwt.verify(token, process.env.JWT_SECRET || 'chave__secreta', (err, user) => {
      if (err) {
        return res.status(403).json({ success: false, message: 'Token inválido' });
      }
      req.userId = user.userId; // Adiciona o userId ao req para uso posterior
      next(); // Chama a próxima função de middleware ou rota
    });
  };
  
  export default authenticateToken; // Exportação correta
  