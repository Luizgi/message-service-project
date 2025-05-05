const jwt = require('jsonwebtoken');

const autenticarUsuario = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Obtém o token do header

    if (!token) {
        return res.status(403).json({ erro: 'Token não fornecido!' });
    }

    try {
        const decoded = jwt.verify(token, 'seuSegredoSuperSeguro'); // Verifica e decodifica o JWT
        req.userId = decoded.id; // Adiciona o ID do usuário à requisição
        next(); // Continua para a próxima função (rota protegida)
    } catch (error) {
        return res.status(401).json({ erro: 'Token inválido!' });
    }
};

module.exports = autenticarUsuario;
