const express = require('express');
const bcrypt = require('bcrypt');    
const jwt = require('jsonwebtoken'); 
const Usuario = require('../models/user.model');
const autenticarUsuario = require('../middlewares/AuthMiddleware');

const router = express.Router();

// Cadastro de usuário (Signup)
router.post('/signup', async (req, res) => {
    const { nome, email, senha, foto } = req.body; // Agora aceita foto em Base64

    if (!nome || !email || !senha || !foto) {
        return res.status(400).json({ erro: 'Todos os campos são obrigatórios!' });
    }

    try {
        const usuarioExistente = await Usuario.findOne({ email });
        if (usuarioExistente) {
            return res.status(409).json({ erro: 'E-mail já cadastrado!' });
        }

        const senhaHash = await bcrypt.hash(senha, 12);
        const novoUsuario = new Usuario({ nome, email, senha: senhaHash, foto });

        await novoUsuario.save();

        res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!', usuario: { nome, email, foto } });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao criar usuário!' });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ erro: 'Email e senha são obrigatórios!' });
    }

    try {
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(401).json({ erro: 'Usuário não encontrado!' });
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(401).json({ erro: 'Senha incorreta!' });
        }

        const token = jwt.sign({ id: usuario._id, email: usuario.email }, 'seuSegredoSuperSeguro', { expiresIn: '1h' });

        res.json({ mensagem: 'Login bem-sucedido!', token });
    } catch (error) {
        res.status(500).json({ erro: 'Erro interno no servidor!' });
    }
});

// Retornar nome e foto do usuário autenticado
router.get('/usuario', autenticarUsuario, async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.userId).select('nome foto'); // Busca nome e foto

        if (!usuario) {
            return res.status(404).json({ erro: 'Usuário não encontrado!' });
        }

        res.json(usuario);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar perfil do usuário!' });
    }
});

module.exports = router;
