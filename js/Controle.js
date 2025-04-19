import { Lista } from './Lista.js';

class Controle {
  constructor() {
    this.listas = [];
    this.loadFromLocalStorage();
  }

  adicionar(nome, cor) {
    const novaLista = new Lista({ nome, cor });
    novaLista.isShown = true; l
    this.listas.push(novaLista);
    this.saveToLocalStorage();
    return novaLista;
  }

  
  remover(idLista) {
    const lista = this.listas.find(lista => lista.idLista === idLista);
    if (lista) {
      lista.ativo = false;
      this.saveToLocalStorage();
    }
  }

  saveToLocalStorage() {
      localStorage.setItem('listas', JSON.stringify(this.listas));
  }

  loadFromLocalStorage() {
  
  }

  busca(valor) {
   
  }

  filtrarVisibilidade(valor) {
   
  }

  getListasVisiveis() {
   
  }
}

export { Controle };
