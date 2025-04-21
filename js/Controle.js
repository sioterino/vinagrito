import { Lista } from './Listas.js';

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
  adicionar(nome, cor) {
    const novaLista = new Lista({ nome, cor });

    novaLista.isShown = true;  //marca a lista como visível por padrão 

    this.listas.push(novaLista);  //adiciona no array
    this.saveToLocalStorage();  //salva as listas no LocalStorage 

    return novaLista;
  }

  //método para remover uma lista
  remover(idLista) {
    const lista = this.listas.find(lista => lista.idLista === idLista);

    if (lista) {
      lista.ativo = false;  //marca a lista como inativa mas continua no LocalStorage
      this.saveToLocalStorage();
    }
  }

  //salva as listas no LocalStorage
  saveToLocalStorage() {
    localStorage.setItem('listas', JSON.stringify(this.listas));
  }

  //carrega as listas do LocalStorage
  loadFromLocalStorage() {
    const listasSalvas = JSON.parse(localStorage.getItem('listas')) || [];  // array vazio se não existir nada salvo

    this.listas = listasSalvas
      .filter(dados => dados.ativo)  //filtra apenas as listas ativas
      .map(dados => {
        const novaLista = new Lista(dados);
        novaLista.idLista = dados.idLista;
        novaLista.ativo = dados.ativo;
        novaLista.isShown = dados.isShown;
        novaLista.tarefas = dados.tarefas || [];
        return novaLista;
      });
  }


  //método de busca nas listas e tarefas
  busca(valor) {
    return this.listas.filter(lista => {
      //verifica se o nome da lista contém o valr
      const nomeCorresponde = lista.nome.toLowerCase().includes(valor.toLowerCase());

      //busca nas tarefas se alguma descriçao ou data de tarefa bate com o valor
      //const tarefasCorrespondentes = lista.filtrarTarefas({ descricao: valor, data: valor });

      //retorna true se qualquer uma das condiçoes for verdadeira 
      return nomeCorresponde || tarefasCorrespondentes.length > 0;
    });
  }

  //filtra a visibilidade das listas com base no valor procurado
  filtrarVisibilidade(valor) {
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
}

export { Controle };
