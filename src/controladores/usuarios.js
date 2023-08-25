const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../conexao/conexao')
const senhaJwt = require("../senhaJwt");

async function cadastrarUsuario(req, res) {
    const { nome, email, senha } = req.body;

    try {
        if (!nome || !email || !senha) {
            return res.status(400).json({ "mensagem": "Verifique todos os campos" });
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const query = `insert into usuarios  (nome, email, senha)
        values
        ($1, $2, $3) returning *`

        let emailMinusculo = email.toLowerCase();

        const validarEmail = await pool.query(`select * from usuarios where email = $1`, [emailMinusculo])

        if (validarEmail.rowCount > 0) {
            return res.status(401).json({ mensagem: `Email: ${emailMinusculo} ja cadastrado` })
        }

        const usuario = await pool.query(query, [nome, emailMinusculo, senhaCriptografada]);

        const { senha: _, ...dadosRestantes } = usuario.rows[0];

        return res.status(201).json(dadosRestantes);
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ "mensagem": "Erro interno do servidor" });
    }
}

async function loginUsuario(req, res) {
    const { email, senha } = req.body

    try {
        const query = `select * from usuarios where email = $1`

        const emailMinusculo = email.toLowerCase()

        const usuario = await pool.query(query, [emailMinusculo]);

        if (!usuario.rows[0]) {
            return res.status(404).json({ "mensage": "Email ou senha invalidos" });
        }

        const verificarSenha = await bcrypt.compare(senha, usuario.rows[0].senha);

        if (!verificarSenha) {
            return res.status(404).json({ mensagem: "Email ou senha invalido" });
        }

        const token = jwt.sign({ id: usuario.rows[0].id }, senhaJwt, { expiresIn: "360h" })


        const { senha: _, ...usuariologado } = usuario.rows[0];

        return res.status(201).json({ usuario: usuariologado, token });
    } catch (error) {
        return res.status(500).json({ "mensagem": "Erro interno do servidor!!!!!" });
    }
}

async function detalharUsuario(req, res) {
    const { id } = req.usuario;

    try {
        const usuario = await pool.query(`select * from usuarios where id = $1`, [id]);

        const { senha: _, ...detalhesUsuario } = usuario.rows[0];

        res.status(200).json(detalhesUsuario);
    } catch (error) {
        res.status(500).json({ "mensagem": "Erro no servidor interno" });
    }
}

async function atualizarUsuario(req, res) {
    const { nome, email, senha } = req.body;
    const { id } = req.usuario;

    try {
        if (!nome || !email || !senha) {
            return res.status(400).json({ "mensagem": "Verifique todos os campos" });
        }

        const emailMinusculo = email.toLowerCase();

        const compararEmail = await pool.query(`select * from usuarios where email = $1`, [emailMinusculo]);

        if (compararEmail.rowCount > 0) {
            return res.status(401).json({ "mensagem": "O e-mail informado já está sendo utilizado por outro usuário." });
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10)

        const atualizarDados = await pool.query(`update usuarios set nome = $1, email = $2, senha = $3 where id = $4`, [nome, email, senhaCriptografada, id]);

        return res.status(204).send();
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ "mensagem": "Erro interno de servidor" });
    }
}

module.exports = {
    cadastrarUsuario,
    loginUsuario,
    detalharUsuario,
    atualizarUsuario
}