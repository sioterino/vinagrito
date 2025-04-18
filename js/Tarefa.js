import { Utils } from "./Utils.js"

class Tarefa {
    constructor({ nome, descricao, dataPrazo, hora, prioridade }, cor) {
        this.idTarefa = Utils.novoID('tarefa');
        this.nome = nome;
        this.descricao = descricao;
        this.dataCriacao = new Date();
        this.dataPrazo = dataPrazo;
        this.hora = hora;
        this.prioridade = prioridade;
        this.cor = cor;
        this.completa = false;
        this.isShown = true;
    }

    tarefaCompleta() {
        this.completa = true;
    }

    tarefaPendente() {
        this.completa = false;
    }

    toggleStatus(){
        this.completa = !this.completa;
    }

    editarDetalhes({ nome, descricao, dataPrazo, hora, prioridade }) {
        this.nome = nome;
        this.descricao = descricao;
        this.dataPrazo = dataPrazo;
        this.hora = hora;
        this.prioridade = prioridade;
    }

    tarefaAtrasada() {
        const dataAtual = new Date();
        const dataPrazo = new Date(`${this.data}T${this.hora}`);
        return !this.completa && dataPrazo < dataAtual;
    }
}

export { Tarefa }