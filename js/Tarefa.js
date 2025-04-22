import { Utils } from "./Utils.js"

class Tarefa {
    constructor({ nome, descricao, prazo, prioridade }, cor) {
        this.idTarefa = Utils.novoID('tarefa');
        this.nome = nome;
        this.descricao = descricao;
        this.prazo = prazo;
        this.prioridade = prioridade;
        this.cor = cor;
        this.completa = false;
        this.isShown = true;
        this.ativo = true;
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