
import { Utils } from "./Utils.js"
class DOM {

    constructor() {
        this.pendentes = document.querySelector('.listas-incompletas')
        this.completas = document.querySelector('.listas-completas')
    }

    newList(obj) {
        
        console.log('newList called')

        const lista = Utils.newEl('div', 'lista', obj.idLista, null)

        const head = Utils.newEl('div', 'lista-head', null, null)
        const circle = Utils.newEl('span', ['icon', 'circle'], null, 'circle')
        const h4 = Utils.newEl('h4', 'lista-nome', null, obj.nome)
        const more = Utils.newEl('span', ['icon', 'more'], null, 'more_horiz')

        head.append(circle, h4, more)
        
        const info = Utils.newEl('div', 'lista-info', null, null)
        const llup = Utils.newEl('p', 'lista-last-update', null, `Atualizado há ${Math.floor(Math.random() * 10)}h`)
        const a = Math.floor(Math.random() * 10);
        const b = a + Math.floor(Math.random() * 10)
        const stats = Utils.newEl('p', 'lista-status', null, `${a}/${b}`)

        info.append(llup, stats)

        lista.append(head, info)
        this.pendentes.append(lista)
    }


}

class Dialog {

    constructor(dialog) {
        this.dialog = dialog
        this.formData;
    }

    new(tag) {
        document.querySelector(tag).addEventListener('click', () => this.dialog.showModal())

        this.dialog.addEventListener('click', e => this.#fecharModal(e))

        this.dialog.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', e => this.#formSubmit(e))
        })
    }

    #fecharModal(e) {
        if (e.target.tagName.toLowerCase() === 'dialog') {
            this.dialog.close()
            this.#resetForm()
        }
    }

    #formSubmit(e) {
        e.preventDefault()
        this.dialog.close()
        this.formData = this.#getContent()
        e.target.reset()
    }

    #resetForm() {
        this.dialog.querySelectorAll('form').forEach(form => form.reset())
    }

    #getContent() {
        const data = new FormData(this.dialog.querySelector('form'))
        const inputs = {}
        data.forEach( (val, key) => {
            inputs[key] = val
        })

        return inputs
    }


}

export { Dialog, DOM }
