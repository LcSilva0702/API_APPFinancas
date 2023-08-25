const pool = require('../conexao/conexao');


const listaCategorias = async (req, res) => {
    const { id } = req.usuario;

    try {

        const { rows } = await pool.query(`select * from categorias where usuario_id = $1`, [id]);

        return res.json(rows)

    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }

};

const detalharCategoria = async (req, res) => {
    const { id } = req.params;
    const idToken = req.usuario

    try {
        if (!id) {
            return res.status(400).json({ mensagem: 'Categoria não informada' })
        }

        const { rowCount, rows } = await pool.query(`select * from categorias where usuario_id = $1 and id = $2`, [idToken.id, id])

        if (rowCount === 0) {
            return res.status(404).json({ mensagem: 'Categoria informada não encontrada' })
        }

        const categoria = {
            id: rows[0].id,
            usuario_id: rows[0].usuario_id,
            descricao: rows[0].descricao
        }

        if (categoria) {
            return res.status(200).json(categoria);
        }

        return res.status(404).json({ mensagem: "Categoria informada não encontrada." });
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }


}

const cadastrarDescricaoCategoria = async (req, res) => {
    const { descricao } = req.body
    const idToken = req.usuario


    try {

        if (!descricao) {
            return res.status(400).json({ mensagem: "A descrição da categoria deve ser informada." })
        }
        const query = await pool.query(`select * from categorias where id = $2`, [idToken.id])

        if (query.rowCount < 1) {
            return res.status(404).json({ mensagem: 'Categoria não encontrado' })
        }

        const { rows } = await pool.query('insert into categorias (descricao) values ($1) returning *', [descricao])
        return res.status(201).json(rows[0]);
    } catch (error) {
        return res.status(500).json('Erro interno do servidor')
    }

}

const atualizarCategoria = async (req, res) => {
    const { descricao } = req.body
    const { id } = req.params;
    const idToken = req.usuario;

    if (!descricao) {
        return res.status(400).json({ mensagem: "A descrição da categoria deve ser informada." })
    }

    try {

        const query = await pool.query(`select * from categorias where usuario_id = $1 and id = $2`, [idToken.id, id])

        if (query.rowCount < 1) {
            return res.status(404).json({ mensagem: 'Categoria informada não existe' })
        }

        const { rows } = await pool.query('update categorias set descricao = $1 where id = $2 returning *', [descricao, id]);

        const categoria = {
            id: rows[0].id,
            descricao: rows[0].descricao,
            usuario_id: rows[0].usuario_id
        }

        if (idToken.id === query.rows[0].usuario_id) {
            return res.status(200).json(categoria);
        }

        return res.status(404).json({ "mensagem": "Categoria não encontrada." });
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }

}

const deletarCategoria = async (req, res) => {
    const { id } = req.params;
    const idToken = req.usuario;

    try {

        const query = await pool.query(`select * from categorias where usuario_id = $1 and id = $2`, [idToken.id, id])

        if (query.rowCount < 1) {
            return res.status(404).json({ mensagem: 'Categoria não encontrada' })
        }

        await pool.query('delete from categorias where id = $1', [id])

        return res.status(204).send()

    } catch (error) {
        console.log(error.message)
        return res.status(500).json('Erro interno do servidor')
    }

}


module.exports = {
    listaCategorias,
    detalharCategoria,
    cadastrarDescricaoCategoria,
    atualizarCategoria,
    deletarCategoria
}

