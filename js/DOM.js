import { Utils } from "./Utils.js"
import { Controle } from "./Controle.js"

class DOM {

    #qtdLista = 0 // contador de listas

    constructor() {
        // inicializa container de listas
        this.controle = new Controle()
        this.pendentes = document.querySelector('.listas')
    }

    pageInit() {
        const criarLista = document.querySelector('.nova-lista')
        new Dialog(criarLista, (data, id) => this.#newList(data, id))

        this.#loadListasFromStorage()

        document.querySelector('#pesquisa').addEventListener('input', e => this.#handleSearch(e))
    }

    #loadListasFromStorage() {
        const novasListas = this.controle.listas
        novasListas.forEach( l => {
            this.#newList(l)
        })
    }

    #handleSearch(e) {
        const valor = e.target.value
        this.controle.buscaLista(valor)

        this.#carregaVisíveis()
    }

    #carregaVisíveis() {
        // Recupera as listas visíveis
        const listasVisiveis = this.controle.getListasVisiveis()

        // Exclui todas as listas
        this.pendentes.innerHTML = ''

        // Recria as listas visíveis
        listasVisiveis.forEach(lista => {
            this.#newList(lista)
        })
    }

    //  RENDERIZA NOVA LISTA
    #newList(formObj, id = null) {
        const listObj = this.controle.adicionar(formObj) || formObj

        const lista = document.querySelector('#lista-template').content.cloneNode(true).querySelector('.lista')
        
        lista.id = listObj.idLista
        lista.classList.add(`${listObj.cor}-fundo`)
        lista.classList.add(`${listObj.cor}-borda`)

        lista.querySelector('.lista-nome').textContent = listObj.nome

        lista.querySelector('.circle').classList.add(listObj.cor)

        this.pendentes.append(lista)

        this.#listInit( lista, listObj )

        this.#addQtdLista()
    }

    // LISTAS EVENTLISTENERS
    #listInit(lista, { idLista }) {
        // abre e fecha lista
        lista.addEventListener('click', e => {
            if (e.target.closest('.more') || e.target.closest('.more-dropdown')) return
            // captura o ID da lista sendo clicada
           const idLista = e.target.closest('.lista').id
           // garante que as listas abertas sejam fechadas
           // antes da lista clicada seja aberta
            this.#toggleLista(idLista)
        })

        // ========================================================================================================
        
        // abre o dropdown do botão de 'more'
        this.#openDropdown(lista)

        // ========================================================================================================

        // eventlistener no dom inteiro <3
        document.addEventListener('click', e => {
            e.stopPropagation() // evita a propagação desse clique divoss

            // fecha os dropdowns do 'more' ao clicar fora OU em uma das opções do dropdown
            if (!e.target.closest('.more-dropdown') || e.target.closest('.more-li')) {
                document.querySelectorAll('.more-dropdown').forEach(drop => drop.classList.add('hide'))
            }

           // fecha lista caso o usuário clique fora dela <3 (ignora caixas de dialogo)
            if (!e.target.closest('.lista') && !e.target.closest('dialog')) {
                this.#toggleLista()
            }

        })

        // ========================================================================================================

        // DELETA LISTAS
        lista.querySelector('.more-del').addEventListener('click', e => {
            this.controle.remover(idLista)
            lista.remove()

            this.#addQtdLista(false)
        })

        // ========================================================================================================

        // EDITA LISTAS
        lista.querySelector('.more-edit').addEventListener('click', e => {
            // aaaaaaaaaaaaaaaaaaaaaa
        })

        // ========================================================================================================

        // incializa os evenlisteners do botão NOVA TAREFA
        const botao = lista.querySelector('.nova-tarefa')
        const dialog = new Dialog (botao, (data, id) => this.#newTask(data, id))

        // ========================================================================================================

    }

    // BARE/FECHA LISTA
    #toggleLista(idLista = null) {
        // itera um array de listas
        this.pendentes.querySelectorAll('.lista').forEach(l => {
            // conteúdo escondido como TAREFAS
            const alvo = l.querySelector('.content')
            if (!alvo.classList.contains('hide')) {
                // mostra conteúdo escondido caso ele esteja escondido
                alvo.classList.add('hide')
            }

            // abre uma lista caso o idLista capturado 
            // no clique corresponda ao item iterado
            if (idLista !== null && l.id === idLista) {
                alvo.classList.remove('hide')
            }

        })
        // ========================================================================================================
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
        document.querySelector('.fazendo').querySelector('.qtd-listas').textContent = this.#qtdLista;
    }
    
    #newTask(formObj, idLista) {
        const taskObj = this.controle.novaTarefa(formObj, idLista) || formObj

        const tarefa = document.querySelector('#tarefa-template').content.cloneNode(true).querySelector('.tarefa')

        tarefa.id = taskObj.idTarefa
        tarefa.querySelector('.tarefa-nome').textContent = taskObj.nome
        tarefa.querySelector('.tarefa-desc').textContent = taskObj.descricao
        tarefa.querySelector('.prioridade').textContent = `${taskObj.prioridade}P`
        tarefa.querySelector('.prazo').textContent = Utils.formatDate(taskObj.prazo)
        // tarefa.querySelector('.faltam').textContent = Utils.calculaTempoRestante(taskObj.prazo)
        tarefa.querySelector('.faltam').textContent = '0d'

        this.pendentes.querySelector(`.lista[id="${idLista}"]`).querySelector('.tarefas').append(tarefa)

        this.#taskInit(tarefa)
    }

    #taskInit(tarefa) {
        // this.#openDropdown(tarefa)
    }   

}

class Dialog {
    
    #botao
    #dialog
    #callback
    #idLista

    constructor(botao, callback = null) {
        this.#botao = botao
        this.data = {}
        this.#callback = callback

        if (this.#botao.classList.contains('nova-lista')) {
            this.#dialog = document.querySelector('#nova-lista')
        } else {
            this.#dialog = document.querySelector('#nova-tarefa')
        }

        this.form = this.#dialog.querySelector('form')
        
        this.#new()
    }
    
    // EVENTLISTENERS DOS BOTÕES DE CRIAR LISTA E TAREFA
    #new() {
        this.#botao.addEventListener('click', e => {
            this.#dialog.showModal()
            this.#idLista = e.target.closest('.lista') ? e.target.closest('.lista').id : null
        })
        this.#dialog.addEventListener('click', e => this.#fecharModal(e))
        
        this.form.addEventListener('submit', e => this.#formSubmit(e))
    }
    
    #fecharModal(e) {
        // fecha modal somente se a pessoa clicar fora da div que contem o forms
        if (e.target.tagName.toLowerCase() === 'dialog') {
            this.#dialog.close()
            this.form.reset()
        }
    }
    
    // ao enviar o forms
    #formSubmit(e) {
        e.preventDefault() // evita a página de recarregar

        const input = new FormData(this.form)
        input.forEach( (val, key) => {
            this.data[key] = val
        })

        this.#dialog.close() // fecha o modal
        e.target.reset() // reseta o forms

        if (this.#callback !== null) {
            this.#callback(this.data, this.#idLista)
        }

        this.#idLista = null
    }

}

export { Dialog, DOM }
