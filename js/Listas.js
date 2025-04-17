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

  // remove pelo o id
  removerTarefa(idTarefa) {
    this.tarefas = this.tarefas.filter(
      (tarefa) => tarefa.IdTarefa !== idTarefa
    );
  }

  // ordena as tarefas dependendo do critério que foi passado
  ordenarTarefa(criterio = "none") {
    const sorters = {
      dataCrescente: (a, b) => new Date(a.date) - new Date(b.date),
      dataDecrescente: (a, b) => new Date(b.date) - new Date(a.date),
      prioridadeCrescente: (a, b) => a.prioridade - b.prioridade,
      prioridadeDescrescente: (a, b) => b.prioridade - a.prioridade,
      descriçãoMaior: (a, b) => a.descrição.length - b.descrição.length,
      descriçãoMenor: (a, b) => b.descrição.length - a.descrição.length,
      none: () => 0, // não faz nada
    };

    return this.tarefas.sort(sorters[criterio] || sorters["none"]);
  }

  filtrarTarefas(filtros = {}) {
    // desestrutura os filtros recebidos, se algum não for passado assume com uma string vazia 
    const { descricao = "", data = "" } = filtros;


    return this.tarefas.filter((tarefa) => {
      let descricaoCorresponde = true;
      let dataCorresponde = true;

      // se foi informado um filtro de descrição
      if (descricao !== "") {
        // converte a descrição da tarefa e o filtro para letras minúsculas,
        const descricaoTarefa = tarefa.descrição.toLowerCase();
        const descricaoFiltro = descricao.toLowerCase();

        // verifica se a descrição da tarefa contém o texto do filtro
        descricaoCorresponde = descricaoTarefa.includes(descricaoFiltro);
      }

      // se foi informado um filtro de data
      if (data !== "") {
        // converte a data da tarefa e a data do filtro para um formato padrão em string
        const dataTarefa = new Date(tarefa.data).toDateString();
        const dataFiltro = new Date(data).toDateString();

        // verifica correspondencia
        dataCorresponde = dataTarefa === dataFiltro;
      }

      // mostra a tarefa se pelo menos um dos filtros combinar
      return descricaoCorresponde || dataCorresponde;
    });
  }

  // altera o nome e a cor da lista
  editar(novoNome, novaCor) {
    this.nome = novoNome;
    this.cor = novaCor;
  }

  // move uma tarefa dessa lista pra outra lista
  moverTarefa(idTarefa, listaDestino) {
    const tarefa = this.getTarefaByID(idTarefa);
    if (tarefa) {
      this.removerTarefa(idTarefa); //tira da lista atual
      listaDestino.adicionarTarefa(tarefa); //mmove para lista de destino
    }
  }


  // retorna a tarefa com o ID correspondente
  getTarefaByID(idTarefa) {
    return this.tarefas.find((tarefa) => tarefa.IdTarefa === idTarefa);
  }

}


export { Lista };
