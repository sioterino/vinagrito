// AQUI FICA A IMPLEMENTAÇÃO DAS CLASSES EU ACHO KKKKK
// objetivo aqui é fazer só a importação desse arquivo para dentro do html

import { Dialog, DOM } from "./DOM.js"
import { Utils } from "./Utils.js"
import { Listas } from "./Utils.js"

const criarLista = new Dialog(document.querySelector('.criar-lista-dialog'))
criarLista.new('.nova-lista')

const criarTarfea = new Dialog(document.querySelector('.criar-tarefa-dialog'))
criarTarfea.new('.nova-tarefa')

const dom = new DOM()
dom.newList()
dom.newList()
dom.newList()
dom.newList()
dom.newList()