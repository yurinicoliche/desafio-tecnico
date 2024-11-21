const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

// Configuração para permitir requisições entre front-end e back-end
app.use(cors());
app.use(express.json());

// Conexão com o banco de dados MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',  // Substitua com o seu usuário do MySQL
    password: '',  // Substitua com a sua senha do MySQL
    database: 'lista_tarefas'
});

db.connect(err => {
    if (err) {
        console.error('Erro de conexão com o banco de dados: ', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL');
});

// Rota para listar as tarefas
app.get('/tarefas', (req, res) => {
    const query = "SELECT id, nome_tarefa, custo, data_limite, ordem_apresentacao FROM Tarefas ORDER BY ordem_apresentacao";
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao buscar tarefas' });
        }
        res.json(results);
    });
});

// Rota para excluir uma tarefa
app.delete('/tarefas/:id', (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM Tarefas WHERE id = ?";
    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao excluir tarefa' });
        }
        res.json({ message: 'Tarefa excluída com sucesso' });
    });
});

// Rota para editar uma tarefa
app.put('/tarefas/:id', (req, res) => {
    const { id } = req.params;
    const { nome_tarefa, custo, data_limite } = req.body;

    const query = "UPDATE Tarefas SET nome_tarefa = ?, custo = ?, data_limite = ? WHERE id = ?";
    db.query(query, [nome_tarefa, custo, data_limite, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao editar tarefa' });
        }
        res.json({ message: 'Tarefa editada com sucesso' });
    });
});

// Rota para incluir uma tarefa
app.post('/tarefas', (req, res) => {
    const { nome_tarefa, custo, data_limite } = req.body;

    // Obter o maior valor de ordem_apresentacao
    const query = "SELECT MAX(ordem_apresentacao) AS max_ordem FROM Tarefas";
    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao buscar ordem de apresentação' });
        }
        const ordem_apresentacao = result[0].max_ordem + 1;

        // Inserir nova tarefa
        const insertQuery = "INSERT INTO Tarefas (nome_tarefa, custo, data_limite, ordem_apresentacao) VALUES (?, ?, ?, ?)";
        db.query(insertQuery, [nome_tarefa, custo, data_limite, ordem_apresentacao], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Erro ao incluir tarefa' });
            }
            res.json({ message: 'Tarefa incluída com sucesso' });
        });
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
