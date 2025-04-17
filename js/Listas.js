import { Utils } from "./Utils.js";

class Lista {
  // construtor das lista que recebe nome e cor como parametro
  constructor(objeto) {
    this.idLista = Utils.novoID("lista");
    this.nome = objeto.nome;
    this.cor = objeto.cor;
    this.tarefas = [];
  }

  adicionarTarefa(tarefa) {
    this.tarefas.push(tarefa);
  }

  removerTarefa(idTarefa) {
    this.tarefas = this.tarefas.filter(
      (tarefa) => tarefa.IdTarefa !== idTarefa
    );
  }

  ordenarTarefa(criterio = "none") {
    const sorters = {
      dataCrescente: (a, b) => new Date(a.date) - new Date(b.date),
      dataDecrescente: (a, b) => new Date(b.date) - new Date(a.date),
      prioridadeCrescente: (a, b) => a.prioridade - b.prioridade,
      prioridadeDescrescente: (a, b) => b.prioridade - a.prioridade,
      descriçãoMaior: (a, b) => a.descrição.length - b.descrição.length,
      descriçãoMenor: (a, b) => b.descrição.length - a.descrição.length,
      none: () => 0,
    };

    return this.tarefas.sort(sorters[criterio] || sorters["none"]);
  }

  filtrarTarefa(filter = "all") {}

  editar(novoNome, novaCor) {
    this.nome = novoNome;
    this.cor = novaCor;
  }

  apagartarefa(idTarefa) {
    this.removerTarefa(idTarefa);
  }

  // refazer
  moverTarefa(idTarefa, listaDestino) {
    const tarefa = this.getTarefaByID(idTarefa);
    if (tarefa) {
      this.removerTarefa(idTarefa);
      // tarefa.idLista =
      idListaDestino.adicionarTarefa(this.tarefas);
    }
  }

  // retorna a tarefa com o ID correspondente
  getTarefaByID(idTarefa) {
    return this.tarefas.find((tarefas) => tarefa.IdTarefa === idTarefa);
  }

  editarNomeLista(novoNome) {
    this.nome = novoNome;
  }
}

export { Lista };
