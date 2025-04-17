
import { Utils } from "./Utils.js"
import { Lista } from "./Listas.js"
class DOM {

    #qtdLista = 0 // contador de listas por coluna

    constructor() {
        // inicializa colunas de PENDENTES e CONCLUIDAS
        this.pendentes = document.querySelector('.listas-incompletas')
        this.completas = document.querySelector('.listas-completas')
    }

    // renderiza nova lista
    newList(obj) {

        // card onde as informações da lista ficam guardadas
        const lista = Utils.newEl('div', ['lista', `${obj.cor}-fundo`, `${obj.cor}-borda`], obj.idLista, null)

        // div principal com NOME e botão de EDITAR e DELETAR
        const head = Utils.newEl('div', 'lista-head', null, null)
        const circle = Utils.newEl('span', ['icon', 'circle', obj.cor], null, 'circle')
        const h4 = Utils.newEl('h4', 'lista-nome', null, obj.nome)
        const more = Utils.newEl('span', ['icon', 'more'], null, 'more_horiz')

        head.append(circle, h4, more) // append basiquérrimo
        
        // informações adicionais sobre a lista como ULTIMA ATUALIZAÇÃO e N. DE TAREFAS
        const info = Utils.newEl('div', 'lista-info', null, null)
        const llup = Utils.newEl('p', 'lista-last-update', null, `Atualizado há ${Math.floor(Math.random() * 10)}h`)
        const a = Math.floor(Math.random() * 10)
        const b = a + Math.floor(Math.random() * 10)
        const stats = Utils.newEl('p', 'lista-status', null, `${a}/${b}`)

        info.append(llup, stats)


        const moreDropdown = Utils.newEl('ul', ['more-dropdown', 'hide'], null, null)
        
        const deletar = Utils.newEl('li', ['more-del', 'more-li'], null, null)
        const iconDel = Utils.newEl('span', ['icon', 'delete'], null, 'delete')
        const delP = Utils.newEl('p', null, null, 'Apagar')
        deletar.append(iconDel, delP)

        const editar = Utils.newEl('li', ['more-edit', 'more-li'], null, null)
        const iconEdit = Utils.newEl('span', ['icon', 'edit'], null, 'edit')
        const editP = Utils.newEl('p', null, null, 'Editar')
        editar.append(iconEdit, editP)

        const mover = Utils.newEl('li', ['more-move', 'more-li'], null, null)
        const iconMove = Utils.newEl('span', ['icon', 'move'], null, 'pan_tool')
        const moveP = Utils.newEl('p', null, null, 'Mover')
        mover.append(iconMove, moveP)

        moreDropdown.append(mover, editar, deletar)


        lista.append(head, info, moreDropdown)
        // rederiza conteúdo interno da lista, como tarefas e botões necessários
        lista.append( this.#insideLista() )

        this.pendentes.append(lista)

        // atualiza o contador de listas na coluna
        this.#qtdLista++
        document.querySelector('.esquerdo').querySelector('.qtd-listas').textContent = this.#qtdLista


        const criarTarfea = new Dialog(document.querySelector('.criar-tarefa-dialog'))
        // inicializa os eventListeners da lista
        this.#listaInit(lista, obj, criarTarfea)
    }

    // rederiza conteúdo interno da lista, como tarefas e botões necessários
    #insideLista() {
        const inside = Utils.newEl('div', ['content', 'hide'], null, null)

        
        const divFilter = Utils.newEl('div', 'filtros')
        
        const selectWrapper = Utils.newEl('div', 'select-wrapper')

        const filterWrapper1 = Utils.newEl('div', 'filter-wrapper')
        const filter = Utils.newEl('select', ['select-filter', 'filtros-select'], null, null)
        const filOpt1 = Utils.newEl('option', null, null, 'Todos')
        const filOpt2 = Utils.newEl('option', null, null, 'Pendentes')
        const filOpt3 = Utils.newEl('option', null, null, 'Ccompletos')
        filter.append(filOpt1, filOpt2, filOpt3)
        const arrow1 = Utils.newEl('span', ['icon', 'arrow'], null, 'keyboard_arrow_up')
        filterWrapper1.append(filter, arrow1)
        
        const filterWrapper2 = Utils.newEl('div', 'filter-wrapper')
        const order = Utils.newEl('select', ['select-order', 'filtros-select'], null, null)
        const ordOpt1 = Utils.newEl('option', null, null, 'Mais Importante')
        const ordOpt2 = Utils.newEl('option', null, null, 'Menos Importate')
        const ordOpt3 = Utils.newEl('option', null, null, 'Menor Prazo')
        const ordOpt4 = Utils.newEl('option', null, null, 'Maior Prazo')
        order.append(ordOpt1, ordOpt2, ordOpt3, ordOpt4)
        const arrow2 = Utils.newEl('span', ['icon', 'arrow'], null, 'keyboard_arrow_up')
        filterWrapper2.append(order, arrow2)

        selectWrapper.append(filterWrapper1, filterWrapper2)

        const search = Utils.newEl('div', 'searchbar')
        const lupa = Utils.newEl('span', ['icon', 'glass'], null, 'search')
        const bar = Utils.newEl('input')
        bar.placeholder = 'Pesquisar'

        search.append(lupa, bar)
        divFilter.append(selectWrapper, search)


        // botão de criar nova tarefa
        const novaTarefa = Utils.newEl('div', ['botao-criar', 'nova-tarefa'], null, null)
        const plus = Utils.newEl('span', ['icon', 'add'], null, 'add')
        const novaTarefaP = Utils.newEl('p', null, null, 'Criar nova tarefa')
        novaTarefa.append(plus, novaTarefaP)

        inside.append( divFilter, novaTarefa )
        return inside
    }

    // inicializa os eventListeners da lista
    #listaInit(lista, obj, criarTarfea) {
        // abre e fecha lista
        lista.addEventListener('click', e => {
            if (e.target.closest('.more') || e.target.closest('.more-dropdown')) return
            // captura o ID da lista sendo clicada
           const idLista = e.target.closest('.lista').id
           // garante que as listas abertas sejam fechadas
           // antes da lista clicada seja aberta
            this.#abreLista(idLista)
        })

        lista.querySelector('.more').addEventListener('click', e => {
            e.stopPropagation()
            const dropdown = lista.querySelector('.more-dropdown')
            dropdown.classList.toggle('hide')
        })

        document.addEventListener('click', e => {
            e.stopPropagation()
            if (!e.target.closest('.more-dropdown') || e.target.closest('.more-li')) {
                document.querySelectorAll('.more-dropdown').forEach(drop => drop.classList.add('hide'))
            }
        })

        lista.querySelector('.more-del').addEventListener('click', e => {
            console.log(obj.idLista)
            lista.remove()
            this.#qtdLista--
            document.querySelector('.esquerdo').querySelector('.qtd-listas').textContent = this.#qtdLista
        })

        lista.querySelector('.more-edit').addEventListener('click', e => {
            console.log(obj.idLista)
            console.log('EDITAR LISTA')
        })

        lista.querySelector('.more-del').addEventListener('click', e => {
            console.log(obj.idLista)
            console.log('MOVER LISTA')
        })

        
        criarTarfea.new(lista.querySelector('.nova-tarefa'), obj.idLista)

    }

    // ABRE LISTA
    #abreLista(idLista) {
        const listas = this.pendentes.querySelectorAll('.lista')

        // fecha listas que estiverem abertas
        listas.forEach(l => {
            const alvo = l.querySelector('.content')
            const info = l.querySelector('.lista-info')
            if (!alvo.classList.contains('hide')) {
                alvo.classList.add('hide')
                info.classList.remove('hide')
            }

            if (l.id === idLista) {
                alvo.classList.remove('hide')
                info.classList.add('hide')
            }

        })
    }

}

class Dialog {

    #dom = new DOM()
    // carrega o id lista
    #idLista = null;

    constructor(dialog) {
        this.dialog = dialog
    }

    // inicializa os eventListeners de cada dialog de acordo com a classe
    new(triggerElement, idLista) {
        if (triggerElement.classList.contains('nova-tarefa')) {
            this.#idLista = idLista
        }
    
        triggerElement.addEventListener('click', () => this.dialog.showModal())
    
        this.dialog.addEventListener('click', e => this.#fecharModal(e))
    
        this.dialog.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', e => this.#formSubmit(e))
        })
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
        console.log(formData)
        
        // cria NOVA LISTA caso seja a ORIGEM do
        // forms seja do DIALOG seja NOVA-LISTA
        if (formData.func === 'nova-lista') {   
            this.#dom.newList(new Lista(formData))
        }
        
        // cria NOVA TAREDA caso seja a ORIGEM do
        // forms seja do DIALOG seja NOVA-TAREFA
        else if (formData.func === 'nova-tarefa') {   
            // this.#dom.newList(new Lista(formData))
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
