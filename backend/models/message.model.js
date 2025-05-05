const mongoose = require('mongoose');

const mensagemSchema = new mongoose.Schema({
    usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true }, // Relacionamento com usuário
    texto: { type: String, required: true },
    data: { type: Date, default: Date.now } // Data de envio automática
});

const Mensagem = mongoose.model('Mensagem', mensagemSchema);

module.exports = Mensagem;
