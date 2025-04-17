// AQUI FICA A IMPLEMENTAÇÃO DAS CLASSES EU ACHO KKKKK
// objetivo aqui é fazer só a importação desse arquivo para dentro do html

import { Dialog, DOM } from "./DOM.js"

const criarLista = new Dialog(document.querySelector('.criar-lista-dialog'))
criarLista.new('.nova-lista')

document.querySelector('body').addEventListener('click', e => {
    console.log(e.target)
})