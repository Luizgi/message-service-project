const express = require('express');
const Mensagem = require('../models/message.model'); // Importando o modelo
const autenticarUsuario = require('../middlewares/AuthMiddleware'); // Importando middleware de autenticação

const router = express.Router();

// Criar mensagem (Usuário autenticado via JWT)
router.post('/mensagem', autenticarUsuario, async (req, res) => {
    const { texto } = req.body;

    if (!texto) {
        return res.status(400).json({ erro: 'O texto da mensagem é obrigatório!' });
    }

    try {
        const novaMensagem = new Mensagem({ usuarioId: req.userId, texto });
        await novaMensagem.save();

        res.status(201).json({ mensagem: 'Mensagem enviada com sucesso!', novaMensagem });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao salvar mensagem!' });
    }
});

// Ler todas as mensagens (Retorna texto, ID do usuário e data)
router.get('/mensagens', async (req, res) => {
    try {
        const mensagens = await Mensagem.find().select('usuarioId texto data');
        res.json(mensagens);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar mensagens!' });
    }
});

// Editar mensagem (Usuário autenticado via JWT)
router.put('/mensagem/:id', autenticarUsuario, async (req, res) => {
    const { texto } = req.body;
    const mensagemId = req.params.id;

    if (!texto) {
        return res.status(400).json({ erro: 'O novo texto da mensagem é obrigatório!' });
    }

    try {
        const mensagem = await Mensagem.findById(mensagemId);

        if (!mensagem) {
            return res.status(404).json({ erro: 'Mensagem não encontrada!' });
        }

        if (mensagem.usuarioId.toString() !== req.userId) {
            return res.status(403).json({ erro: 'Você não tem permissão para editar esta mensagem!' });
        }

        mensagem.texto = texto;
        await mensagem.save();

        res.json({ mensagem: 'Mensagem editada com sucesso!', mensagemAtualizada: mensagem });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao editar mensagem!' });
    }
});

// Excluir mensagem (Usuário autenticado via JWT)
router.delete('/mensagem/:id', autenticarUsuario, async (req, res) => {
    const mensagemId = req.params.id;

    try {
        const mensagem = await Mensagem.findById(mensagemId);

        if (!mensagem) {
            return res.status(404).json({ erro: 'Mensagem não encontrada!' });
        }

        if (mensagem.usuarioId.toString() !== req.userId) {
            return res.status(403).json({ erro: 'Você não tem permissão para excluir esta mensagem!' });
        }

        await mensagem.deleteOne();

        res.json({ mensagem: 'Mensagem excluída com sucesso!' });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao excluir mensagem!' });
    }
});

module.exports = router;
