// AQUI FICA A IMPLEMENTAÇÃO DAS CLASSES EU ACHO KKKKK
// objetivo aqui é fazer só a importação desse arquivo para dentro do html

import { Dialog, DOM } from "./DOM.js"
import { Lista } from "./Listas.js"

const criarLista = new Dialog(document.querySelector('.criar-lista-dialog'))
criarLista.new(document.querySelector('.nova-lista'))

// document.querySelector('body').addEventListener('click', e => {
//     console.log(e.target)
// })

const dom = new DOM()
dom.loadListasFromStorage()

document.querySelector('#pesquisa').addEventListener('input', e => dom.handleSearch(e))




// dom.newList( new Lista({ nome: 'teste 1', cor: 'verde' }) )
// dom.newList( new Lista({ nome: 'teste 2', cor: 'roxo' }) )
// dom.newList( new Lista({ nome: 'teste 3', cor: 'amarelo' }) )
// dom.newList( new Lista({ nome: 'teste 1', cor: 'verde' }) )
// dom.newList( new Lista({ nome: 'teste 2', cor: 'roxo' }) )
// dom.newList( new Lista({ nome: 'teste 3', cor: 'amarelo' }) )
// dom.newList( new Lista({ nome: 'teste 1', cor: 'verde' }) )
// dom.newList( new Lista({ nome: 'teste 2', cor: 'roxo' }) )
// dom.newList( new Lista({ nome: 'teste 3', cor: 'amarelo' }) )
// dom.newList( new Lista({ nome: 'teste 1', cor: 'verde' }) )
// dom.newList( new Lista({ nome: 'teste 2', cor: 'roxo' }) )
// dom.newList( new Lista({ nome: 'teste 3', cor: 'amarelo' }) )
