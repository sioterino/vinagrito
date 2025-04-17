class tarefa {
    constructor(nome, descricao, dataCriacao, dataPrazo, hora, prioridade, idLista) {
        this.idTarefa = Utils.novoID('tarefa');
        this.nome = nome;
        this.descricao = descricao;
        this.dataCriacao = dataCriacao;
        this.dataPrazo = dataPrazo;
        this.hora = hora;
        this.prioridade = prioridade;
        this.idLista = idLista;
        this.completa = false;
    }

    tarefaCompleta() {
        this.completa = true;
    }

    tarefaPendente() {
        this.completa = false;
    }

    editarDetalhes({ descricao, dataPrazo, hora, prioridade }) {
        this.descricao = descricao;
        this.dataPrazo = dataPrazo;
        this.hora = hora;
        this.prioridade = prioridade;
    }

    tarefaAtrasada() {
        const dataAtual = new Date();
        const dataPrazo = new Date(`${this.dataPrazo}T${this.hora}`);
        return !this.completa && dataPrazo < dataAtual;
    }
}

