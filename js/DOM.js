import { Utils } from "./Utils.js"
import { Controle } from "./Controle.js"

class DOM {

    #qtdLista = 0
    constructor() {
        this.controle = new Controle()
        this.pendentes = document.querySelector('.listas')

        // NEW: Shared task dialog instance
        this.taskDialog = new Dialog(null, (data, id) => this.#newTask(data, id))
    }

    pageInit() {
        const criarLista = document.querySelector('.nova-lista')
        new Dialog(criarLista, (data, id) => this.#newList(data, id))

        this.#loadListasFromStorage()

        document.querySelector('#pesquisa').addEventListener('input', e => this.#handleSearch(e))
    }

    #loadListasFromStorage() {
        const novasListas = this.controle.listas
        novasListas.forEach(l => {
            this.#newList(l)
        })
    }

    #handleSearch(e) {
        const valor = e.target.value
        this.controle.buscaLista(valor)
        this.#carregaVisíveis()
    }

    #carregaVisíveis() {
        const listasVisiveis = this.controle.getListasVisiveis()
        this.pendentes.innerHTML = ''
        listasVisiveis.forEach(lista => {
            this.#newList(lista)
        })
    }

    #newList(formObj, id = null) {
        const listObj = this.controle.adicionar(formObj) || formObj

        const lista = document.querySelector('#lista-template').content.cloneNode(true).querySelector('.lista')

        lista.id = listObj.idLista
        lista.classList.add(`${listObj.cor}-fundo`)
        lista.classList.add(`${listObj.cor}-borda`)

        lista.querySelector('.lista-nome').textContent = listObj.nome
        lista.querySelector('.circle').classList.add(listObj.cor)

        this.pendentes.append(lista)

        this.#listInit(lista, listObj)
        this.#addQtdLista()

        if (listObj.tarefas?.length) {

            const tarefasContainer = lista.querySelector('.tarefas')
            
            listObj.tarefas.forEach(tarefa => {
                console.log(tarefa)
                const tarefaEl = this.#renderTarefa(tarefa)
                tarefasContainer.append(tarefaEl)

            })

        }
    }

    #listInit(lista, { idLista }) {
        lista.addEventListener('click', e => {
            if (e.target.closest('.more') || e.target.closest('.more-dropdown')) return
            const idLista = e.target.closest('.lista').id
            this.#toggleLista(idLista)
        })

        this.#openDropdown(lista)

        document.addEventListener('click', e => {
            e.stopPropagation()
            if (!e.target.closest('.more-dropdown') || e.target.closest('.more-li')) {
                document.querySelectorAll('.more-dropdown').forEach(drop => drop.classList.add('hide'))
            }

            if (!e.target.closest('.lista') && !e.target.closest('dialog')) {
                this.#toggleLista()
            }
        })

        lista.querySelector('.more-del').addEventListener('click', e => {
            this.controle.remover(idLista)
            lista.remove()
            this.#addQtdLista(false)
        })

        lista.querySelector('.more-edit').addEventListener('click', e => {
            // editing logic here
        })

        // ✅ Reuse the shared taskDialog instance
        const botao = lista.querySelector('.nova-tarefa')
        this.taskDialog.setBotao(botao)
    }

    #toggleLista(idLista = null) {
        this.pendentes.querySelectorAll('.lista').forEach(l => {
            const alvo = l.querySelector('.content')
            alvo.classList.add('hide')
            if (idLista !== null && l.id === idLista) {
                alvo.classList.remove('hide')
            }
        })
    }

    #openDropdown(element) {
        element.querySelector('.more').addEventListener('click', e => {
            e.stopPropagation()
            const dropdown = element.querySelector('.more-dropdown')
            dropdown.classList.toggle('hide')
        })
    }

    #addQtdLista(add = true) {
        this.#qtdLista += add ? 1 : -1
        document.querySelector('.fazendo .qtd-listas').textContent = this.#qtdLista
    }

    #newTask(formObj, idLista) {
        if (idLista) {
            const taskObj = this.controle.novaTarefa(formObj, idLista)
            const tarefa = this.#renderTarefa(taskObj)
            this.pendentes.querySelector(`.lista[id="${idLista}"] .tarefas`).append(tarefa)
        }
    }

    #renderTarefa(taskObj) {
        const tarefa = document.querySelector('#tarefa-template').content.cloneNode(true).querySelector('.tarefa')
        console.log(taskObj)

        tarefa.id = taskObj.idTarefa
        tarefa.classList.add(`${taskObj.cor}-borda`)

        tarefa.querySelector('.tarefa-nome').textContent = taskObj.nome
        tarefa.querySelector('.tarefa-desc').textContent = taskObj.descricao
        tarefa.querySelector('.prioridade').textContent = `${taskObj.prioridade}P`
        tarefa.querySelector('.prazo').textContent = Utils.formatDate(taskObj.prazo)
        tarefa.querySelector('.faltam').textContent = '0d'

        this.#taskInit(tarefa)
        return tarefa
    }

    #taskInit(tarefa) {
        // Task-specific event listeners
    }

}

class Dialog {

    #botao
    #dialog
    #callback
    #idLista = null

    constructor(botao, callback = null) {
        this.#callback = callback
        this.data = {}

        if (botao) {
            this.setBotao(botao)
        }

        // default to task dialog (you can adjust logic if needed)
        if (botao?.classList.contains('nova-lista')) {
            this.#dialog = document.querySelector('#nova-lista')
        } else {
            this.#dialog = document.querySelector('#nova-tarefa')
        }

        this.form = this.#dialog.querySelector('form')
        this.#dialog.addEventListener('click', e => this.#fecharModal(e))
        this.form.addEventListener('submit', e => this.#formSubmit(e))
    }

    setBotao(botao) {
        this.#botao = botao
        this.#botao.addEventListener('click', e => {
            this.#dialog.showModal()
            this.#idLista = e.target.closest('.lista')?.id ?? null
        })
    }

    #fecharModal(e) {
        if (e.target.tagName.toLowerCase() === 'dialog') {
            this.#dialog.close()
            this.form.reset()
        }
    }

    #formSubmit(e) {
        e.preventDefault()

        const input = new FormData(this.form)
        input.forEach((val, key) => {
            this.data[key] = val
        })

        this.#dialog.close()
        e.target.reset()

        if (this.#callback !== null) {
            this.#callback(this.data, this.#idLista)
        }

        this.#idLista = null
    }
}

export { DOM, Dialog }
