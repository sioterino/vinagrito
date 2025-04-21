import { Utils } from "./Utils.js"
import { Lista } from "./Listas.js"
import { Tarefa } from "./Tarefa.js"
import { Controle } from "./Controle.js"

class DOM {

    #qtdLista = 0 // contador de listas

    constructor() {
        // inicializa container de listas
        this.controle = new Controle()
        this.pendentes = document.querySelector('.listas')
    }

    loadListasFromStorage() {
        const novasListas = this.controle.listas
        novasListas.forEach( l => {
            this.newList(l)
        })
    }

    handleSearch(e) {
        const valor = e.target.value;
        this.controle.buscaLista(valor);

        // Atualiza o DOM para refletir a visibilidade das listas
        this.updateListVisibility();
    }

    updateListVisibility() {
        // Recupera as listas visíveis
        const listasVisiveis = this.controle.getListasVisiveis();

        // Exclui todas as listas
        this.pendentes.innerHTML = '';

        // Recria as listas visíveis
        listasVisiveis.forEach(lista => {
            this.newList(lista);
        });
    }

    //  RENDERIZA NOVA LISTA
    newList(obj) {

        // card onde as informações da lista ficam guardadas
        const lista = Utils.newEl('div', ['lista', `${obj.cor}-fundo`, `${obj.cor}-borda`], obj.idLista, null)

        const head = Utils.newEl('div', 'lista-head')

        // ========================================================================================================

        // div principal com NOME e botão de EDITAR e DELETAR
        const left = Utils.newEl('div', 'head-left')
        const circle = Utils.newEl('span', ['icon', 'circle', obj.cor], null, 'circle')
        const h4 = Utils.newEl('h4', 'lista-nome', null, obj.nome)
        
        left.append(circle, h4) // append basiquérrimo

        // ========================================================================================================
        
        // informações adicionais sobre a lista como ULTIMA ATUALIZAÇÃO e N. DE TAREFAS
        const right = Utils.newEl('div', 'head-right', null, null)
        const a = Math.floor(Math.random() * 10)
        const b = a + Math.floor(Math.random() * 10)
        const stats = Utils.newEl('p', 'lista-status', null, `${a}/${b}`)

        const more = Utils.newEl('span', ['icon', 'more'], null, 'more_horiz')
        
        right.append( stats, more )
        head.append( left, right )
        
        // ========================================================================================================

        // opções de DELETAR e EDITAR são criadas em função para reutilização de código
        const moreDropdown = this.#moreDropdown()
        lista.append(head, moreDropdown)

        // rederiza conteúdo interno da lista, como tarefas e botões necessários
        const content = this.#insideLista()
        lista.append( content )

        this.pendentes.append(lista)

        // ========================================================================================================

        // atualiza o contador de listas
        this.#qtdLista++
        document.querySelector('.fazendo').querySelector('.qtd-listas').textContent = this.#qtdLista

        // responsável por criar / associar um DIALOG de criação de tarefa ao botão de nova tarefa
        const criarTarfea = new Dialog(
            document.querySelector('.criar-tarefa-dialog'),
            lista
        )

        // inicializa os eventListeners da lista
        this.#listaInit(lista, obj, criarTarfea)
        
        // ========================================================================================================
    }

    // RENDERIZA O CONTEÚDO INTERNO DAS LISTAS
    #insideLista() {

        // elemento principal onde todos os elementos ficam escondido
        const inside = Utils.newEl('div', ['content', 'hide'], null, null)
        
        // ========================================================================================================
        
        // seção de filtros
        const divFilter = Utils.newEl('div', 'filtros')
        
        // wrapper genérico dos ordenadores
        const selectWrapper = Utils.newEl('div', 'select-wrapper')

        // ========================================================================================================

        // ordenador por STATUS de cada tarefa

        const filterWrapper1 = Utils.newEl('div', 'filter-wrapper')
        const filter = Utils.newEl('select', ['select-filter', 'filtros-select'], null, null)

        const statusOptions = [
            {value: 'todos', text: 'Todos'},
            {value: 'pendentes', text: 'Pendentes'},
            {value: 'completos', text: 'Completos'},
        ]

        statusOptions.forEach(opt => {
            const option = Utils.newEl('option', null, null, opt.text)
            option.value = opt.value
            filter.append(option)
        })

        const arrow1 = Utils.newEl('span', ['icon', 'arrow'], null, 'keyboard_arrow_up')
        filterWrapper1.append(filter, arrow1)

        // ========================================================================================================
        
        // ordenador por PRIORIDADE e URGÊNCIA de cada tarefa

        const filterWrapper2 = Utils.newEl('div', 'filter-wrapper')
        const order = Utils.newEl('select', ['select-order', 'filtros-select'], null, null)

        const orderOptions = [
            {value: 'mais-importante', text: 'Mais Importante'},
            {value: 'menos-importante', text: 'Menos Importante'},
            {value: 'mais-urgente', text: 'Mais Urgente'},
            {value: 'menos-urgente', text: 'Menos Urgente'},
        ]

        orderOptions.forEach(opt => {
            const option = Utils.newEl('option', null, null, opt.text)
            option.value = opt.value
            order.append(option)
        })

        const arrow2 = Utils.newEl('span', ['icon', 'arrow'], null, 'keyboard_arrow_up')
        filterWrapper2.append(order, arrow2)

        // adicionar ao wrapper genérico dos ordenadores
        selectWrapper.append(filterWrapper1, filterWrapper2)
        
        // ========================================================================================================

        // barra de pesquisa
        const search = Utils.newEl('div', 'searchbar')
        const lupa = Utils.newEl('span', ['icon', 'glass'], null, 'search')
        const bar = Utils.newEl('input')
        bar.type = 'text'
        bar.id = 'pesquisa'
        bar.name = 'searchbar'
        bar.autocomplete = 'off'
        bar.spellcheck = false
        bar.placeholder = 'Pesquisar'

        search.append(lupa, bar)
        divFilter.append(selectWrapper, search)
        
        // ========================================================================================================

        const tarefas = Utils.newEl('div', ['tarefas'])
        
        // ========================================================================================================

        // botão de criar nova tarefa
        const novaTarefa = Utils.newEl('div', ['botao-criar', 'nova-tarefa'])
        const plus = Utils.newEl('span', ['icon', 'add'], null, 'add')
        const novaTarefaP = Utils.newEl('p', null, null, 'Criar nova tarefa')
        novaTarefa.append(plus, novaTarefaP)
        
        // ========================================================================================================

        inside.append( divFilter, tarefas, novaTarefa )
        return inside
        
        // ========================================================================================================
    }

    // RENDERIZA BOTÃO DE 'MORE' COM OPÇÕES DE MOVER, EDITAR E DELETAR
    #moreDropdown(tarefa = false) {
        // CONTAINER
        const moreDropdown = Utils.newEl('ul', ['more-dropdown', 'hide'])
        
        // DELETER
        const deletar = Utils.newEl('li', ['more-del', 'more-li'])
        const iconDel = Utils.newEl('span', ['icon', 'delete'], null, 'delete')
        const delP = Utils.newEl('p', null, null, 'Apagar')
        deletar.append(iconDel, delP)

        // EDITAR
        const editar = Utils.newEl('li', ['more-edit', 'more-li'])
        const iconEdit = Utils.newEl('span', ['icon', 'edit'], null, 'edit')
        const editP = Utils.newEl('p', null, null, 'Editar')
        editar.append(iconEdit, editP)

        if (tarefa) {
            // MOVER caso seja TAREFA
            const mover = Utils.newEl('li', ['more-move', 'more-li'])
            const iconMove = Utils.newEl('span', ['icon', 'move'], null, 'pan_tool')
            const moveP = Utils.newEl('p', null, null, 'Mover')
            mover.append(iconMove, moveP)
            moreDropdown.append(editar, deletar, mover)
        } else {
            moreDropdown.append(editar, deletar)
        }

        return moreDropdown

        // ========================================================================================================
    }

    // LISTAS EVENTLISTENERS
    #listaInit(lista, { idLista, cor }, criarTarfea) {
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
        lista.querySelector('.more').addEventListener('click', e => {
            e.stopPropagation() // evita que abra/feche a lista
            
            // adiciona/remove classe HIDE do elemento dropdown
            const dropdown = lista.querySelector('.more-dropdown')
            dropdown.classList.toggle('hide')
        })

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
            this.#qtdLista -= 1
            document.querySelector('.fazendo').querySelector('.qtd-listas').textContent = this.#qtdLista
        })

        // ========================================================================================================

        // EDITA LISTAS
        lista.querySelector('.more-edit').addEventListener('click', e => {
            console.log(idLista)
            console.log('EDITAR LISTA')
        })

        // ========================================================================================================

        // incializa os evenlisteners do botão NOVA TAREFA
        criarTarfea.new(lista.querySelector('.nova-tarefa'), idLista, cor)

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

    newTask(obj, lista) {
        const tarefas = lista.querySelector('.tarefas')
    
        // Create the main task container <div class="tarefa">
        const task = Utils.newEl('div', ['tarefa', `${obj.cor}-borda`], obj.idTarefa)


        // Create the task header <div class="tarefa-head">
        const head = Utils.newEl('div', 'tarefa-head')
        // Create the unchecked icon <span class="icon unchecked">
        const unchecked = Utils.newEl('span', ['icon', 'unchecked'], null, 'check_box_outline_blank')
        // Create the checked icon <span class="icon checked">
        const checked = Utils.newEl('span', ['icon', 'checked', 'hide'], null, 'check_box')
        // Create the task name <h4 class="tarefa-nome">
        const nome = Utils.newEl('h4', 'tarefa-nome', null, obj.nome)
        // Create the more icon <span class="icon tarefa-more">
        const more = Utils.newEl('span', ['icon',  'tarefa-more'], null, 'more_horiz')
        // Append the icons and task name to the task header
        head.append(unchecked, checked, nome, more)


        // Create the task description <blockquote class="tarefa-desc">
        const descricao = Utils.newEl('blockquote', 'tarefa-desc', null, obj.descricao)


        // Create the task info container <div class="tarefa-info">
        const info = Utils.newEl('div', 'tarefa-info')
        // Create the priority <p class="prioridade">
        const prioridade = Utils.newEl('p', ['prioridade', `${obj.prioridade}P`], null, `${obj.prioridade}P`)
        // Create the deadline <p class="prazo">
        const prazo = Utils.newEl('p', 'prazo', null, Utils.formatDate(obj.prazo))
        // Calculate the remaining days (Assuming you have a way to calculate remaining days)
        const faltam = Utils.newEl('p', 'faltam', null, '8d') // Here you can calculate the real remaining days based on the task deadline
        // Append the task info paragraphs
        info.append(prioridade, prazo, faltam)

        // Append everything to the task div
        task.append(head, descricao, info)
        tarefas.append(task)

    
        // Add any future event listeners for the task (edit, move, delete, etc.)
    }
    
    // Handle the check/uncheck action
    #toggleCheck(e, tarefa) {
        if (e.target.checked) {
            tarefa.classList.add('completed')  // Add class to mark task as completed
        } else {
            tarefa.classList.remove('completed')  // Remove class to uncheck task
        }
    }

}

class Dialog {

    #dom
    #idLista = null
    #cor = null
    #lista = null

    constructor(dialog, lista) {
        this.#dom = new DOM()
        this.dialog = dialog

        if (lista) {
            this.#lista = lista
        }
    }

    // EVENTLISTENERS DOS BOTÕES DE CRIAR LISTA E TAREFA
    new(triggerElement, idLista, cor) {
        if (triggerElement.classList.contains('nova-tarefa')) {
            // caso o botão seja o de NOVA TAREDA, idLista da classe DIALOG é definido
            this.#idLista = idLista
            this.#cor = cor
        }
    
        triggerElement.addEventListener('click', () => this.dialog.showModal())
    
        this.dialog.addEventListener('click', e => this.#fecharModal(e))
        
        this.dialog.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', e => this.#formSubmit(e))
        })
        // ========================================================================================================
    }    

    #fecharModal(e) {
        // fecha modal somente se a pessoa clicar fora da div que contem o forms
        if (e.target.tagName.toLowerCase() === 'dialog') {
            this.dialog.close()
            this.#resetForm() // reseta o forms
        }
    } 

    #resetForm() {
        // pega todos os forms do html e reseta eles
        this.dialog.querySelectorAll('form').forEach(form => form.reset())
    }

    // ao enviar o forms
    #formSubmit(e) {
        e.preventDefault() // evita a página de recarregar

        // cria e renderiza na tela a nova lista/tarefa
        const formData = this.#getContent()
        
        // cria NOVA LISTA caso seja a ORIGEM do
        // forms seja do DIALOG seja NOVA-LISTA
        if (formData.func === 'nova-lista') {
            this.#dom.newList( this.#dom.controle.adicionar( formData ) )
        }
        
        // cria NOVA TAREDA caso seja a ORIGEM do
        // forms seja do DIALOG seja NOVA-TAREFA
        else if (formData.func === 'nova-tarefa') {
            this.#dom.newTask( this.#dom.controle.novaTarefa(this.#idLista, formData), this.#lista)
        }

        this.dialog.close() // fecha o modal
        e.target.reset() // reseta o forms
    }
    #getContent() {
        // captura os valores do forms, como labels e inputs
        const data = new FormData(this.dialog.querySelector('form'))

        const inputs = { func: this.dialog.id }
        data.forEach( (val, key) => {
            inputs[key] = val
        })

        return inputs
    }

}

export { Dialog, DOM }
