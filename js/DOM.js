import { Utils } from "./Utils.js"
import { Controle } from "./Controle.js"
import { Dialog } from "./Dialog.js"

class DOM {
    
    #qtdLista = 0
    constructor() {
        this.controle = new Controle()
        this.pendentes = document.querySelector('.listas')
        
        this.taskDialog = new Dialog(null, (data, id) => this.#newTask(data, id))
    }
    
    pageInit() {
        this.#favicon()
        
        const criarLista = document.querySelector('.nova-lista')
        new Dialog(criarLista, (data, id) => this.#newList(data, id))
        
        this.#loadListasFromStorage()
        
        document.querySelector('#pesquisa').addEventListener('input', e => this.#handleSearch(e))
    }
    
    #loadListasFromStorage() {
        const novasListas = this.controle.listas
        novasListas.forEach(l => {
            this.#renderizarLista(l)
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
            this.#renderizarLista(listaObj, this.controle)
        })
    }
    
    #favicon() {
        const icons = [
            '../img/pimentao-vermelho.png',
            '../img/pimentao-amarelo.png',
            '../img/pimentao-verde.png',
        ]
        
        const img = icons[Utils.randint(2)]
        
        document.querySelector('#favicon').href = img
        document.querySelector('.logo').src = img
    }
    
    #newList(formObj, id = null) {
        const listObj = this.controle.adicionar(formObj) || formObj

        this.#renderizarLista(listObj)
    }
    
    #renderizarLista(listObj) {
        const lista = document.querySelector('#lista-template').content.cloneNode(true).querySelector('.lista');
    
        lista.id = listObj.idLista;
        lista.classList.add(`${listObj.cor}-fundo`);
        lista.classList.add(`${listObj.cor}-borda`);
        lista.querySelector('.lista-nome').textContent = listObj.nome;
        lista.querySelector('.circle').classList.add(listObj.cor);
        this.pendentes.append(lista);
    
        this.#listInit(lista, listObj);
        this.#addQtdLista();
    
        const tarefasVisiveis = this.controle.getTarefasVisiveis(listObj.idLista);
    
        if (tarefasVisiveis.length) {

            this.#updateCompletas(lista, listObj);
    
            const tarefasContainer = lista.querySelector('.tarefas');
    
            tarefasVisiveis.forEach(t => {

                /*
                    CORREÇÃO PROBLEMA DA EXCLUSAO DAS LISTAS ================================================================================
                */
                // console.log(t.ativo)
                // console.log(this.controle.listas)

                const tarefaEl = this.#renderTarefa(t)
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

        const editarBotao = lista.querySelector('.more-edit')
        editarBotao.addEventListener('click', e => {
            e.stopPropagation()
            const listObj = this.controle.listas.find(l => l.idLista == idLista)
        
            const editarDialog = new Dialog(editarBotao, (data, _) => this.#editarLista(idLista, data))
            editarDialog.abrirEdicao(listObj, idLista)
        })
        
        const botao = lista.querySelector('.nova-tarefa')
        this.taskDialog.setBotao(botao)
    }

    #editarLista(idLista, newData) {
        const novaLista = this.controle.editarLista(idLista, newData)
        const lista = this.pendentes.querySelector(`.lista[id="${idLista}"]`)
        lista.remove()
        // console.log(novaLista)
        this.#renderizarLista(novaLista)
        // console.log(this.controle.listas)
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
    
    #updateCompletas(lista, listObj) {
        // console.log('lista: ', lista)
        // console.log('listObj: ', listObj)
        
        const qtdTask = listObj.tarefas?.filter(task => task.ativo).length
        const qtdDone = listObj.tarefas?.filter(task => task.ativo && task.completa).length
        
        lista.querySelector('.lista-status').textContent = `${qtdDone}/${qtdTask}`
    }
    
    #newTask(formObj, idLista) {
        if (idLista) {
            const taskObj = this.controle.novaTarefa(formObj, idLista)
            
            const tarefa = this.#renderTarefa(taskObj)
            
            const listObj = this.controle.listas.find(l => l.tarefas.some(t => t.idTarefa === taskObj.idTarefa))
            const tarefasDiv = this.pendentes.querySelector(`.lista[id="${idLista}"] .tarefas`)
            tarefasDiv.append(tarefa)
            
            this.#updateCompletas(tarefasDiv.closest('.lista'), listObj)
            
        }
    }
    
    #renderTarefa(taskObj) {
        
        const tarefa = document.querySelector('#tarefa-template').content.cloneNode(true).querySelector('.tarefa')
        
        tarefa.id = taskObj.idTarefa
        tarefa.classList.add(`${taskObj.cor}-borda`)
        
        
        tarefa.querySelector('.tarefa-nome').textContent = taskObj.nome
        tarefa.querySelector('.tarefa-desc').textContent = taskObj.descricao
        tarefa.querySelector('.prioridade').textContent = `${taskObj.prioridade}P`
        tarefa.querySelector('.prazo').textContent = Utils.formatDate(taskObj.prazo)

        const tempo = Utils.calculaTempoRestante(taskObj.prazo)
        const pimentao = Utils.getPimentao(tempo)
        tarefa.querySelector('.tempo').textContent = tempo
        tarefa.querySelector('.pimentao-tempo').src = pimentao
        
        this.#taskInit(tarefa, taskObj)
        return tarefa
    }
    
    #taskInit(tarefa, taskObj) {
        const idTarefa = taskObj.idTarefa
        const listObj = this.controle.listas.find(l => l.tarefas.some(t => t.idTarefa === idTarefa))
        // elemento DIV da lista inteira
        const lista = document.querySelector(`.lista[id="${listObj.idLista}"]`)
        
        // abre fecha o dropdown MORE
        this.#openDropdown(tarefa)

        const uncheck = tarefa.querySelector('.unchecked')
        const check = tarefa.querySelector('.checked')
        uncheck.addEventListener('click', () => {
            // marca a caixa de seleção
            uncheck.classList.toggle('hide')
            check.classList.toggle('hide')
            // atualiza informações por trás
            task.toggleStatus()
            // atualiza contador de tarefas lista
            this.#updateCompletas(lista, listObj)
            this.controle.saveToLocalStorage()
        })
        check.addEventListener('click', () => {
            // desmarca a caixa de seleção
            uncheck.classList.toggle('hide')
            check.classList.toggle('hide')
            // atualiza informações por trás
            task.toggleStatus()
            // atualiza contador de tarefas lista
            this.#updateCompletas(lista, listObj)
            this.controle.saveToLocalStorage()
        })
        
        // deleta tarefas > ERROS A CORRIGIR ===============================================================================================
        tarefa.querySelector('.more-del').addEventListener('click', e => {
            e.stopPropagation()

            this.controle.excluirTarefa(listObj.idLista, idTarefa)
            this.#updateCompletas(lista, listObj)

            tarefa.remove()
        })
        
        tarefa.querySelector('.more-edit').addEventListener('click', e => {
            console.log('EDIT')
        })
        
        tarefa.querySelector('.more-move').addEventListener('click', e => {
            console.log('MOVE')
        })
    }
}

export { DOM }
