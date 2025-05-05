const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    senha: { type: String, required: true },
    foto: { type: String, default: '' }
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;
