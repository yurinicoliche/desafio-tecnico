const tarefasList = document.getElementById('tarefasList');
const incluirTarefaBtn = document.getElementById('incluirTarefaBtn');

// Função para listar as tarefas
function listarTarefas() {
    fetch('http://localhost:3000/tarefas')
        .then(response => response.json())
        .then(tarefas => {
            tarefasList.innerHTML = '';
            tarefas.forEach(tarefa => {
                const tr = document.createElement('tr');
                if (tarefa.custo >= 1000) {
                    tr.classList.add('high-cost');
                }

                tr.innerHTML = `
                    <td>${tarefa.nome_tarefa}</td>
                    <td>${tarefa.custo}</td>
                    <td>${tarefa.data_limite}</td>
                    <td>
                        <button onclick="editarTarefa(${tarefa.id}, '${tarefa.nome_tarefa}', ${tarefa.custo}, '${tarefa.data_limite}')">Editar</button>
                        <button onclick="excluirTarefa(${tarefa.id})">Excluir</button>
                    </td>
                `;
                tarefasList.appendChild(tr);
            });
        });
}


// Função para excluir tarefa
function excluirTarefa(id) {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
        fetch(`http://localhost:3000/tarefas/${id}`, {
            method: 'DELETE'
        }).then(() => {
            listarTarefas();
        });
    }
}

// Função para editar tarefa
function editarTarefa(id, nome_tarefa, custo, data_limite) {
    const novoNome = prompt('Novo nome da tarefa:', nome_tarefa);
    const novoCusto = prompt('Novo custo da tarefa:', custo);
    const novaData = prompt('Nova data limite:', data_limite);

    if (novoNome && novoCusto && novaData) {
        fetch(`http://localhost:3000/tarefas/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome_tarefa: novoNome, custo: novoCusto, data_limite: novaData })
        }).then(() => {
            listarTarefas();
        });
    }
}

// Função para incluir tarefa
incluirTarefaBtn.addEventListener('click', () => {
    const nomeTarefa = prompt('Nome da Tarefa:');
    const custo = prompt('Custo da Tarefa:');
    const dataLimite = prompt('Data Limite:');

    if (nomeTarefa && custo && dataLimite) {
        fetch('http://localhost:3000/tarefas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome_tarefa: nomeTarefa, custo, data_limite: dataLimite })
        }).then(() => {
            listarTarefas();
        });
    }
});

// Listar tarefas ao carregar a página
listarTarefas();

