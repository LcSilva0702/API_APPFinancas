const { Router } = require('express');
const {
    listaCategorias,
    detalharCategoria,
    atualizarCategoria,
    deletarCategoria,
    cadastrarDescricaoCategoria
} = require('./controladores/categorias');
const { cadastrarUsuario,
    loginUsuario,
    detalharUsuario,
    atualizarUsuario
} = require('./controladores/usuarios');
const verificarUsuarioLogado = require('./intermediarios/intermediarios');
const { transacaoExtrato, atualizarTransacao, cadastrarTransacao, listarTransacoes, detalharTransacao } = require('./controladores/transacoes');
const rotas = Router();

rotas.post("/usuario", cadastrarUsuario);
rotas.post("/login", loginUsuario);

rotas.use(verificarUsuarioLogado);

rotas.get("/usuario", detalharUsuario);
rotas.put("/usuario", atualizarUsuario)


rotas.get('/categoria', listaCategorias);
rotas.get('/categoria/:id', detalharCategoria);
rotas.post('/categoria', cadastrarDescricaoCategoria)
rotas.put('/categoria/:id', atualizarCategoria);
rotas.delete('/categoria/:id', deletarCategoria);


rotas.post("/transacao", cadastrarTransacao);
rotas.get("/transacao", listarTransacoes);
rotas.get('/transacao/extrato', transacaoExtrato);
rotas.get("/transacao/:id", detalharTransacao);
rotas.put('/transacao/:id', atualizarTransacao)

module.exports = rotas