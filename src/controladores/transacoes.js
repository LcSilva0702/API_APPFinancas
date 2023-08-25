const pool = require('../conexao/conexao')

async function cadastrarTransacao(req, res) {
    const { descricao, valor, data, categoria_id, tipo } = req.body;
    const { id } = req.usuario;

    try {
        if (!descricao || !valor || !categoria_id || !tipo) {
            return res.status(401).json({ "mensagem": "Confira todos os campos" });
        }

        const query = `insert into transacoes (descricao, valor , data, usuario_id, categoria_id, tipo) 
        values 
        ($1, $2, $3, $4, $5, $6)
        returning *`

        const dataFormatada = new Date(data);

        const transacao = await pool.query(query, [descricao, valor, dataFormatada, id, categoria_id, tipo]);

        return res.status(204).json(transacao.rows[0]);
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ "mensagem": "Erro interno de servidor" });
    }
}

async function listarTransacoes(req, res) {
    const { id } = req.usuario;
    const filtro = req.query;
    const arrayF = filtro.filtro
    const arrayAd = [];

    try {
        if (!filtro.filtro) {
            const query = await pool.query(`select * from transacoes where usuario_id = $1`, [id]);
            return res.status(200).json(query.rows);
        }

        if (filtro.filtro.length > 0) {

            let j = 0;

            const queryF = `select t.id, t.tipo, t.descricao, t.valor, t.data, t.usuario_id, t.categoria_id, c.descricao as categoria_nome from transacoes t inner join categorias c on 
            c.usuario_id = t.usuario_id where c.descricao ILIKE $1 and t.usuario_id = $2`;

            for (let i = 0; i < arrayF.length; i++) {
                const { rows, rowCount } = await pool.query(queryF, [arrayF[i], id]);
                if (rowCount > 0) {
                    arrayAd[j] = rows[0];
                    j++
                }
            }
        }

        if (arrayAd.length > 0) {
            return res.json(arrayAd)
        }

        if (arrayAd.length < 1) {
            return res.status(404).json({ mensagem: "Transacoes não encontrada" })
        }
    } catch (error) {
        return res.status(500).json({ "mensagem": "erro interno do servidor" });
    }
}

async function detalharTransacao(req, res) {
    const { id } = req.params;
    const tokenID = req.usuario;

    try {
        const query = `select * from transacoes where id = $1 and usuario_id = $2`;

        const { rows, rowCount } = await pool.query(query, [id, tokenID.id]);

        if (rowCount < 1) {
            return res.status(404).json({ "mensagem": "Transacao nao encontrada" });
        }

        return res.status(200).json(rows[0]);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ "mensagem": "Erro interno de servidor" });
    }
}

const atualizarTransacao = async (req, res) => {
    const { descricao, valor, categoria_id, tipo, data } = req.body
    const { id } = req.params;
    const idToken = req.usuario;


    if (!descricao || !valor || !categoria_id || !tipo || !data) {
        return res.status(400).json({ mensagem: "Todos os campos obrigatórios devem ser informados." })
    }

    if (tipo !== "saida" && tipo !== "entrada") {
        return res.status(400).json({ mensagem: "Tipo deve ser entrada ou saida" })
    }

    try {

        const query = await pool.query(`select transacoes.id as Id_Trasacoes, transacoes.descricao as descricao_transacoes, transacoes.valor as valor_descricao,
        transacoes.data as data_transacao, transacoes.categoria_id as categoria_id_transacoes, transacoes.tipo as tipo_transacoes, categorias.descricao as descricao_categoria from
        transacoes join  usuarios on usuarios.id = transacoes.usuario_id join categorias on categorias.id =  transacoes.categoria_id 
        where transacoes.id = $1 and categorias.id = $2 and usuarios.id = $3;`, [id, categoria_id, idToken.id])

        if (query.rowCount < 1) {
            return res.status(404).json({ mensagem: 'Transacao informada não encontrada' })
        }

        const { rows } = await pool.query('update categorias set descricao = $1 where id = $2 returning *', [descricao, categoria_id])
        const updateTransacoes = await pool.query('update transacoes set valor = $1, data = $2, tipo = $3 where id = $4 returning *', [valor, data, tipo, id]);

        const categoria = {
            descricao: rows[0].descricao,
            valor: updateTransacoes.rows[0].valor,
            data,
            categoria_id: categoria_id,
            tipo: updateTransacoes.rows[0].tipo
        }

        return res.json(categoria)

    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }

}

const deletarTransacoes = async (req, res) => {
    const { id } = req.params;
    const idToken = req.usuario;

    try {
        const query = await pool.query(`select * from transacoes where usuario_id = $1 and id = $2`, [idToken.id, id])

        if (query.rowCount < 1) {
            return res.status(404).json({ mensagem: 'Transação não encontrada.' })
        }

        await pool.query('delete from transacoes where id = $1 and usuario_id = $2', [id, idToken.id])

        return res.status(204).send()

    } catch (error) {

        return res.status(500).json('Erro interno do servidor')
    }

}

const transacaoExtrato = async (req, res) => {
    const idToken = req.usuario;
    const entrada = "entrada";
    const saida = "saida";

    try {
        const somaEntrada = await pool.query('select sum(valor) entrada from transacoes where usuario_id = $1 and tipo  = $2', [idToken.id, entrada])
        const somaSaida = await pool.query('select sum(valor) saida from transacoes where usuario_id = $1 and tipo  = $2', [idToken.id, saida])

        const entradaValidada = Number(somaEntrada.rows[0].entrada)
        const saidaValidada = Number(somaSaida.rows[0].saida)


        const extrato = {
            entrada: entradaValidada,
            saida: saidaValidada
        }

        return res.status(200).json(extrato)
    } catch (error) {
        res.status(500).json({ "mensagem": "Erro no servidor interno" });
    }
}


module.exports = {
    cadastrarTransacao,
    listarTransacoes,
    detalharTransacao,
    transacaoExtrato,
    deletarTransacoes,
    atualizarTransacao,
}