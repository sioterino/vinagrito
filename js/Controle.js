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
    const lista = this.listas.find(lista => lista.idLista === idLista);

    if (lista) {
      lista.isShown = false;
      lista.ativo = false;  //marca a lista como inativa mas continua no LocalStorage
      this.saveToLocalStorage();
    }
  }

  editarLista(idLista, data) {
    const lista = this.listas.find(lista => lista.idLista === idLista);
    lista.editar(data);
    this.saveToLocalStorage()
    return lista
  }

  novaTarefa(data, idLista) {
    if (data.idTarefa) return;

    const l = Utils.getListaByID(this.listas, idLista);

    const novaTarefa = l.adicionarTarefa(data, l.cor);

    this.saveToLocalStorage();
    return novaTarefa;
  }

  excluirTarefa(idLista, idTarefa) {
    const lista = this.listas.find(l => l.idLista === idLista)
    lista.removerTarefa(idTarefa)
    console.log(lista)
    console.log(this.listas)
    this.saveToLocalStorage()
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
    const lista = this.listas.find(lista => lista.idLista === idLista);
  
    return lista.tarefas.forEach(tarefa => {
      const corresponde =
      tarefa.nome?.toLowerCase().includes(valor.toLowerCase()) ||
      tarefa.descricao?.toLowerCase().includes(valor.toLowerCase())

      tarefa.isShown = corresponde
  })
  }

  //filtra a visibilidade das listas com base no valor procurado
  buscaLista(valor) {
    this.listas.forEach(lista => {
      //verifica se o valor da lista corresponde ao que o usuario está buscando
      const corresponde =
        lista.nome.toLowerCase().includes(valor.toLowerCase()) ||
        lista.cor.toLowerCase().includes(valor.toLowerCase());

      //atualiza a visibilidade da lista com base no resultado da comparaçao
      lista.isShown = corresponde;
    });
  }

  //método para obter as listas que são visiveis
  getListasVisiveis() {
    //filtra as listas que são ativas e estão visiveis
    return this.listas.filter(lista => lista.ativo && lista.isShown);
  }

  getTarefasVisiveis(idLista) {
    const lista = this.listas.find(l => l.idLista === idLista)
    const tarefas = lista.tarefas.filter(t => t.ativo && t.isShown)
    return tarefas
  }
}

export { Controle };
