import { Lista } from './Lista.js';
import { Tarefa } from './Tarefa.js';
import { Utils } from './Utils.js';

//adicionar (cria nova lista) - feito

//remover (recebe id de uma lista e remove essa lista) - feito

//saveToLocalStorage (salva Array de listas no localStorage) - feito

//loadFromLocalStorage (retorna Array de listas do localStorage) - feito

//busca (deve ser capaz de buscar listas pelo nome, assim como pelo nome e descricção das tarefas) - feito

//controle deve ter método q recebe um input string, ele deve encontrar correspondências com esse valor (nome ou cor) 
// e definir um atributo da Lista "isShown" como true ou false esse atributo isShown será iterado pelo DOM e aos q tiverem false serão escondidos com o display: none.  - feito


class Controle {
  constructor() {
    this.listas = [];
    this.loadFromLocalStorage();
  }

  //método para adicionar uma nova lista
  adicionar(data) {
    
    if (data.idLista) return

    const novaLista = new Lista( data );
    novaLista.isShown = true;  //marca a lista como visível por padrão 
    this.listas.push(novaLista);  //adiciona no array
    this.saveToLocalStorage();  //salva as listas no LocalStorage

    return novaLista;
  }

  //método para remover uma lista
  remover(idLista) {
    const lista = Utils.getListaByID(this.listas, idLista);

    if (lista) {
      lista.isShown = false;
      lista.ativo = false;  //marca a lista como inativa mas continua no LocalStorage
      this.saveToLocalStorage();
    }
  }

  editarLista(idLista, data) {
      const lista = Utils.getListaByID(this.listas, idLista);
      lista.editar(data);
      this.saveToLocalStorage();
      return lista;
  }

  novaTarefa(data, idLista) {
    if (data.idTarefa) return;

    const l = Utils.getListaByID(this.listas, idLista);

    const novaTarefa = l.adicionarTarefa(data, l.cor);

    this.saveToLocalStorage();
    return novaTarefa;
  }

  excluirTarefa(idLista, idTarefa) {
    const lista = Utils.getListaByID(this.listas, idLista);
    lista.removerTarefa(idTarefa);
    this.saveToLocalStorage();
  }

  //salva as listas no LocalStorage
  saveToLocalStorage() {
    localStorage.setItem('listas', JSON.stringify(this.listas));
  }

  //carrega as listas do LocalStorage
  loadFromLocalStorage() {
    const listasSalvas = JSON.parse(localStorage.getItem('listas')) || [];
  
    this.listas = listasSalvas
      .filter(dados => dados.ativo)
      .map(dados => {
        const lista = new Lista(dados);
  
        lista.tarefas = (dados.tarefas || [])
          .filter(tarefa => tarefa.ativo)
          .map(tarefa => new Tarefa(tarefa, lista.cor));
  
        return lista;
      });
  }
  
  buscaTarefa(idLista, valor) {
    const lista = Utils.getListaByID(this.listas, idLista);

    lista.tarefas.forEach(tarefa => {
      const corresponde =
      tarefa.nome?.toLowerCase().includes(valor.toLowerCase()) ||
      tarefa.descricao?.toLowerCase().includes(valor.toLowerCase()) ||
      Utils.formatDate(tarefa.prazo, 'long').includes(valor.toLowerCase());

      tarefa.isShown = corresponde;
    })
  }

  //filtra a visibilidade das listas com base no valor procurado
  buscaLista(valor) {
    this.listas.forEach(lista => {
      // Verifica se o nome ou a cor da lista correspondem ao valor
      const correspondeLista =
        lista.nome.toLowerCase().includes(valor.toLowerCase()) ||
        lista.cor.toLowerCase().includes(valor.toLowerCase());
  
      // Verifica se alguma tarefa dentro da lista corresponde ao valor
      const correspondeTarefa = lista.tarefas?.some(tarefa =>
        tarefa.nome?.toLowerCase().includes(valor.toLowerCase()) ||
        tarefa.descricao?.toLowerCase().includes(valor.toLowerCase()) ||
        Utils.formatDate(tarefa.prazo, 'long').includes(valor.toLowerCase())
      );
  
      // Atualiza a visibilidade da lista com base na correspondência da lista ou de alguma tarefa
      lista.isShown = correspondeLista || correspondeTarefa;
  
      // Se quiser também atualizar a visibilidade das tarefas dentro da lista (como na buscaTarefa)
      lista.tarefas?.forEach(tarefa => {
        const corresponde =
          tarefa.nome?.toLowerCase().includes(valor.toLowerCase()) ||
          tarefa.descricao?.toLowerCase().includes(valor.toLowerCase()) ||
          Utils.formatDate(tarefa.prazo, 'long').includes(valor.toLowerCase());
        tarefa.isShown = corresponde;
      });
    });
  }
  

  //método para obter as listas que são visiveis
  getListasVisiveis() {
    //filtra as listas que são ativas e estão visiveis
    return this.listas.filter(lista => lista.ativo && lista.isShown);
  }

  getTarefasVisiveis(idLista) {
    const lista = Utils.getListaByID(this.listas, idLista);
    const tarefas = lista.tarefas.filter(t => t.ativo && t.isShown);
    return tarefas;
  }
}

export { Controle };
