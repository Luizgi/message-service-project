const express = require('express');
const bcrypt = require('bcrypt');    // Criptografia das mensagens
const jwt = require('jsonwebtoken'); // Token de autenticação
const Usuario = require('../models/user.model');

const router = express.Router();

// Signup (Cadastro)
router.post('/signup', async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ erro: 'Todos os campos são obrigatórios!' });
    }

    try {
        // Verificar se o usuário já existe
        const usuarioExistente = await Usuario.findOne({ email });
        if (usuarioExistente) {
            return res.status(409).json({ erro: 'E-mail já cadastrado!' });
        }

        // Hash da senha
        const senhaHash = await bcrypt.hash(senha, 12);

        // Criar novo usuário
        const novoUsuario = new Usuario({ nome, email, senha: senhaHash });
        await novoUsuario.save();

        res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!', usuario: { nome, email } });
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

// Exportação do módulo
module.exports = router;
