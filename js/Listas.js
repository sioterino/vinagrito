class Listas {
    // construtor das lista que recebe nome e cor como parametro
    constructor(nome, cor) {
        this.idTarefa = Utils.novoID('lista');
        this.nome = this.nome;
        this.cor = this.cor;
        this.tarefas = [];
    }

    adicionarTarefa(tarefa) {
        this.tarefas.push(tarefa);
    }

    removerTarefa(idTarefa) {

    }

    ordenaTarefa(criterio) {

    }

    filtraTarefa(tipo) {

    }

    editar(novoNome, novaCor) {
        this.nome = novoNome;
        this.cor = novaCor;
    }

    apagatarefa() {
    }

    moveTarefa(idTarefa, lista) {
    }

}