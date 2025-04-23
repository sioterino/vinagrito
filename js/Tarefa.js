import { Utils } from "./Utils.js"

class Tarefa {
    ////Recebe o objeto e a cor como parâmetro
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

    //Muda status -> se incompleta, completa e vice e versa
    toggleStatus(){
        this.completa = !this.completa;
    }

    //Muda atividade -> se ativa, inativa e vice e versa
    toggleAtividade() {
        this.ativo = !this.ativo
    }

    editar({ nome, descricao, prazo, hora, prioridade }) {
        this.nome = nome;
        this.descricao = descricao;
        this.prazo = prazo;
        this.hora = hora;
        this.prioridade = prioridade;
    }

    //Compara a data atual com a data de entrega para retornar o atraso
    tarefaAtrasada() {
        const dataAtual = new Date();
        const prazo = new Date(`${this.data}T${this.hora}`);
        return !this.completa && prazo < dataAtual;
    }
}

export { Tarefa }