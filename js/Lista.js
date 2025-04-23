import { Tarefa } from "./Tarefa.js";
import { Utils } from "./Utils.js"

class Lista {
  // construtor das lista que recebe nome e cor como parametro
  constructor({ idLista, nome, cor, tarefas = [], ativo = true, isShown = true }) {
    this.idLista = idLista || Utils.novoID("lista");
    this.nome = nome;
    this.cor = cor;
    this.tarefas = tarefas.map(t => new Tarefa(t));
    this.ativo = ativo;
    this.isShown = isShown;
  }
  

  adicionarTarefa(data, cor) {
    const tarefa  = new Tarefa(data, cor)
    this.tarefas.push(tarefa);
    tarefa.ativo = true
    tarefa.isShown = true
    return tarefa
  }

  // remove pelo o id
  removerTarefa(idTarefa) {
    const tarefa = Utils.getTaskByID(this.tarefas, idTarefa);
    tarefa.toggleAtividade()
    tarefa.isShown = false
  }

  //ordena as tarefas dependendo do critério que foi passado
  ordenarTarefa(criterio = "none") {
    const parseDate = (str) => new Date(str); //É uma função arrow que recebe uma string str (que é a data da tarefa) e transforma em um objeto Date.
    const sorters = {
      dataCrescente: (a, b) => parseDate(a.prazo) - parseDate(b.prazo),
      dataDecrescente: (a, b) => parseDate(b.prazo) - parseDate(a.prazo),
      prioridadeDescrescente: (a, b) => a.prioridade - b.prioridade,
      prioridadeCrescente: (a, b) => b.prioridade - a.prioridade,
      descriçãoMenor: (a, b) => a.descricao.length - b.descricao.length,
      descriçãoMaior: (a, b) => b.descricao.length - a.descricao.length,
      none: () => 0, // não faz nada
    };

    return this.tarefas.sort(sorters[criterio] || sorters["none"]);
  }

  filtrarTarefa(criterio = null) {
    if (criterio === 'pendentes') return this.tarefas.filter(t => !t.completa);
    if (criterio === 'completos') return this.tarefas.filter(t => t.completa);
    return this.tarefas;
  }
  

  // altera o nome e a cor da lista
  editar(lista) {
    this.nome = lista.nome;
    this.cor = lista.cor;
  }

  // move uma tarefa dessa lista pra outra lista
  moverTarefa(idTarefa, destino) {
    const tarefa = Utils.getTaskByID(this.tarefas, idTarefa);
    if (tarefa) {
      this.removerTarefa(idTarefa); //tira da lista atual
      destino.adicionarTarefa(tarefa, 'vermelho'); //mmove para lista de destino
    }
  }

}
export { Lista }
