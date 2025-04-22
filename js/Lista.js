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
    return tarefa
  }

  // remove pelo o id
  removerTarefa(idTarefa) {
    const tarefa = this.tarefas.find(tarefa => tarefa.idTarefa === idTarefa);
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

  // filtrarTarefas(filtros = {}) {
  //   // desestrutura os filtros recebidos, se algum não for passado assume com uma string vazia     const { descricao = "", data = "" } = filtros;
  //   const { descricao = "", data = "" } = filtros;
  //   return this.tarefas.filter((tarefa) => {
  //     let descricaoCorresponde = true;
  //     let dataCorresponde = true;

  //     // se foi informado um filtro de descrição
  //     if (descricao !== "") {
  //       // converte a descrição da tarefa e o filtro para letras minúsculas,
  //       const descricaoTarefa = tarefa.descrição.toLowerCase();
  //       const descricaoFiltro = descricao.toLowerCase();

  //       // verifica se a descrição da tarefa contém o texto do filtro
  //       descricaoCorresponde = descricaoTarefa.includes(descricaoFiltro);
  //     }

  //     // se foi informado um filtro de data
  //     if (data !== "") {
  //       // converte a data da tarefa e a data do filtro para um formato padrão em string
  //       const dataTarefa = new Date(tarefa.data).toDateString();
  //       const dataFiltro = new Date(data).toDateString();

  //       // verifica correspondencia
  //       dataCorresponde = dataTarefa === dataFiltro;
  //     }

  //     // retorna a tarefa se pelo menos um dos filtros combinar
  //     if (descricao !== "" && data !== "") {
  //       return descricaoCorresponde && dataCorresponde;
  //     } else if (descricao !== "") {
  //       return descricaoCorresponde;
  //     } else if (data !== "") {
  //       return dataCorresponde;
  //     }

  //     return true; // se nenhum filtro for passado retorna todas as tarefas
  //   });
  // }

  filtrarTarefa(criterio = null) {
    if (criterio === 'pendentes') return this.tarefas.filter(t => !t.completa);
    if (criterio === 'completos') return this.tarefas.filter(t => t.completa);
    return this.tarefas;
  }
  

  // altera o nome e a cor da lista
  editar({nome, cor}) {
    this.nome = nome;
    this.cor = cor;
  }

  // move uma tarefa dessa lista pra outra lista
  moverTarefa(idTarefa, listaDestino) {
    const tarefa = Utils.getTaskByID(idTarefa);
    if (tarefa) {
      this.removerTarefa(idTarefa); //tira da lista atual
      listaDestino.adicionarTarefa(tarefa); //mmove para lista de destino
    }
  }

}
export { Lista }
