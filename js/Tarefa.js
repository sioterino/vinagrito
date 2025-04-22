import { Utils } from "./Utils.js"

class Tarefa {
    constructor(taskObj, cor) {
        this.idTarefa = Utils.novoID('tarefa');
        this.nome = taskObj.nome;
        this.descricao = taskObj.descricao;
        this.prazo = taskObj.prazo;
        this.prioridade = taskObj.prioridade;
        this.cor = cor;
        this.completa = taskObj.completa;
        this.isShown = taskObj.isShown;
        this.ativo = taskObj.ativo;
    }

    toggleStatus(){
        this.completa = !this.completa;
    }

    toggleAtividade() {
        this.ativo = !this.ativo
    }

    editarDetalhes({ nome, descricao, prazo, hora, prioridade }) {
        this.nome = nome;
        this.descricao = descricao;
        this.prazo = prazo;
        this.hora = hora;
        this.prioridade = prioridade;
    }

    tarefaAtrasada() {
        const dataAtual = new Date();
        const prazo = new Date(`${this.data}T${this.hora}`);
        return !this.completa && prazo < dataAtual;
    }
}

export { Tarefa }