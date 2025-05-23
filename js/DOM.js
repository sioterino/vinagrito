import { Utils } from "./Utils.js"
import { Controle } from "./Controle.js"
import { Dialog } from "./Dialog.js"

class DOM {

  constructor() {
    this.controle = new Controle() // controle de listas
    this.pendentes = document.querySelector(".listas") // container das listas

    // caixa de dialogo para criação de novas listas
    this.taskDialog = new Dialog(
      null,
      (data, id) => this.#newTask(data, id),
      'criar-tarefa'
    )

    this.editarListaDialog = new Dialog(
      null,
      (data, id) => this.#editarLista(id, data),
      'editar-lista'
    )

    this.editarTarefaDialog = new Dialog(
      null,
      (data, idLista, idTarefa) => this.#editarTarefa(idLista, idTarefa, data),
      'editar-tarefa'
    )
  }

  // =======================================================================================================================================

  loadListasFromStorage() {
    // carrega listas do localStorage para dentro do Controle
    this.controle.loadFromLocalStorage()
    
    this.pendentes.innerHTML = ''

    // itera o as listas no Controle e renderiza elas
    this.controle.listas.forEach(listObj => {
      this.#renderizarLista( listObj )
    })
  }

  //Lida com a busca de listas ou tarefas com base em um evento de entrada
  handleSearch(e, isList = true, idLista = null) {
    
    //obtem valor digitado no campo de busca
    const valor = e.target.value
    
    //se isList, realiza busca nas listas
    if (isList) {
        this.controle.buscaLista(valor)
        this.#carregaListasVisiveis()
    
    //realiza busca dentro de uma lista específica através do id
    } else {
        this.controle.buscaTarefa(idLista, valor)
        this.#carregaTarefasVisiveis(idLista)
    }

    this.#updateContadorListas()
  }

  #carregaListasVisiveis() {
    // limpa container de listas
    this.pendentes.innerHTML = ''
    // itera sobre a lista de listas visíveis e renderizaapenas as correspondentes à pesquisa
    const listasVisiveis = this.controle.getListasVisiveis()
    listasVisiveis.forEach(listaObj => {
      this.#renderizarLista(listaObj)
    })
  }

  #carregaTarefasVisiveis(idLista) {
    const lista = this.pendentes.querySelector(`.lista[id="${idLista}"]`)
    const tarefas = lista.querySelector('.tarefas')
    tarefas.innerHTML = ''
    
    const tarefasVisiveis = this.controle.getTarefasVisiveis(idLista)
    tarefasVisiveis.forEach(taskObj => {
        const t = this.#renderTarefa(taskObj)
        tarefas.append(t)
    })
  }

  favicon() {
    // randomiza icone da página e logo da header
    const icons = [
      "../img/pimentao-vermelho.png",
      "../img/pimentao-amarelo.png",
      "../img/pimentao-verde.png",
    ]

    const img = icons[Utils.randint(2)]

    document.querySelector("#favicon").href = img
    document.querySelector(".logo").src = img
  }

  // =======================================================================================================================================

  newList(formObj) {
    // cria nova lista no controle
    const listObj = this.controle.adicionar(formObj) || formObj
    //renderiza lista na página
    this.#renderizarLista(listObj)
  }

  #renderizarLista(listObj) {

    // clona template de lista
    const lista = document.querySelector("#lista-template").content.cloneNode(true).querySelector(".lista")

    lista.id = listObj.idLista // ID LISTA
    // adiciona classes de cor padrão
    lista.classList.add(`${listObj.cor}-fundo`)
    lista.classList.add(`${listObj.cor}-borda`)
    lista.querySelector(".circle").classList.add(listObj.cor)

    // NOME
    lista.querySelector(".lista-nome").textContent = listObj.nome

    // adiciona lista ao container de lista
    this.pendentes.append(lista)

    // INICIALIZA EVENT LISTENERS
    this.#listInit(lista, listObj)
    // atualiza contador de listas
    this.#updateContadorListas()

    // carrega array de tarefas da lista
    const tarefasVisiveis = this.controle.getTarefasVisiveis(listObj.idLista)
    if (tarefasVisiveis.length) {
        // caso haja tarefas no array
        tarefasVisiveis.forEach((t) => {
            // retorna e elemento tarefa para ser renderizado
            const tarefa = this.#renderTarefa(t)
            // adiciona tarefa ao container de tarefas da lista
            lista.querySelector(".tarefas").append(tarefa)
        })
        // atualiza contador de tarefas
        this.#updateCompletas(lista, listObj)
    }
  }

  #listInit(lista, listObj) {
    const idLista = listObj.idLista

    // TOGGLE LIST
    lista.addEventListener("click", (e) => {
      if (e.target.closest(".more") || e.target.closest(".more-dropdown"))
        return
      const eID = e.target.closest(".lista").id
      this.#toggleLista(eID)
    })

    // abre e fecha o dropdown MORE
    this.#toggleDropdown(lista)

    // fecha dropdown MORE e LISTAS quando clicado fora desses dois elementos
    document.addEventListener("click", (e) => {
      e.stopPropagation()
      if (!e.target.closest(".more-dropdown") || e.target.closest(".more-li")) {
        // fecha dropdown MORE
        document.querySelectorAll(".more-dropdown").forEach((drop) => drop.classList.add("hide"))
      }

      if (!e.target.closest(".lista") && !e.target.closest("dialog")) {
        // fecha lista
        this.#toggleLista()

        this.pendentes.querySelectorAll(".lista").forEach((l) => {
          l.querySelector('#searchbar').value = ''
          l.querySelector('.select-filter').selectedIndex = 0
          l.querySelector('.select-order').selectedIndex = 0
      })

      //mostra apenas tarefas ativas na interface
      const tarefas = lista.querySelector('.tarefas')
      tarefas.innerHTML = ''
      listObj.tarefas.forEach(taskObj => {
          if (taskObj.ativo) {
            const t = this.#renderTarefa(taskObj)
            tarefas.append(t)
          }
      })
      // =================================================================================================================

      }
    })

    lista.querySelectorAll('.filtros-select').forEach(select => {
        select.addEventListener('click', e => e.stopPropagation())
    })

    lista.querySelector(".more-del").addEventListener("click", (e) => {
      // deleta uma lista
      this.controle.remover(idLista)
      lista.remove()
      this.#updateContadorListas()
    })

    // =====================================================================================================================================

    // pesquisar por tarefas
    const searchbar = lista.querySelector('#searchbar')
    searchbar.addEventListener('input', e => {
        e.stopPropagation()
        this.handleSearch(e, false, idLista)
    })

    const ordenar = lista.querySelector('.select-order')
    ordenar.addEventListener('change', e => {
        const value = e.target.value
        const ordenado = Utils.getListaByID(this.controle.listas, idLista).ordenarTarefa(value)

        const tarefas = lista.querySelector('.tarefas')

        //limpa conteúdo do container 
        tarefas.innerHTML = ''

        //Renderiza e adiciona ao container cada tarefa ordenada
        ordenado.forEach(taskObj => {
            const t = this.#renderTarefa(taskObj)
            tarefas.append(t)
        })
    })
  
    //aplica filtros a tarefas e atualiza interface conforme os filtros
    const filtrar = lista.querySelector('.select-filter')
    filtrar.addEventListener('change', e => {
        const value = e.target.value
        
        //seleciona lista por id
        const filtrado = Utils.getListaByID(this.controle.listas, idLista).filtrarTarefa(value)

        const tarefas = lista.querySelector('.tarefas')
        tarefas.innerHTML = ''

        //Renderiza e adiciona ao container cada tarefa ordenada
        filtrado.forEach(taskObj => {
            const t = this.#renderTarefa(taskObj)
            tarefas.append(t)
        })
    })

    // =============================================================================================

    // EDITAR LISTA
    const editarBotao = lista.querySelector(".more-edit")
    this.editarListaDialog.setBotao(editarBotao, listObj)

    // =============================================================================================

    // NOVA TAREFA
    const botao = lista.querySelector(".nova-tarefa")
    this.taskDialog.setBotao(botao, listObj)

    // =============================================================================================
  }

  #editarLista(idLista, newData) {
    this.controle.editarLista(newData, idLista)
    this.loadListasFromStorage()
  }

  #toggleLista(idLista = null) {
    // abre e fecha conteúdo interno das listas
    this.pendentes.querySelectorAll(".lista").forEach((l) => {
        const alvo = l.querySelector(".content")
        alvo.classList.add("hide")

        if (idLista !== null && l.id === idLista) {
            alvo.classList.remove("hide")          
        }
    })
  }

  #updateContadorListas() {
    // atualiza contador de LISTAS
    const qtdLista = this.controle.listas.filter( l => l.ativo && l.isShown ).length
    document.querySelector(".fazendo .qtd-listas").textContent = qtdLista
  }

  #updateCompletas(lista, listObj) {
    // atualiza contador de TAREFAS
    const qtdTask = listObj.tarefas?.filter((task) => task.ativo).length
    const qtdDone = listObj.tarefas?.filter((task) => task.ativo && task.completa).length

    lista.querySelector(".lista-status").textContent = `${qtdDone}/${qtdTask}`
  }

  // =======================================================================================================================================

  #newTask(formObj, idLista) {
    // CRIA NOVA TAREFA

    const listObj = Utils.getListaByID(this.controle.listas, idLista)

    formObj.completo = false
    formObj.isShown = true
    formObj.ativo = true

    // cria objeto com nova tarefa, incluindo ID e etc
    const taskObj = this.controle.novaTarefa(formObj, listObj.idLista)
    // renderiza nova tarefa na ágina usando o obj ^ acima
    const tarefa = this.#renderTarefa(taskObj)

    // carrega elemento LISTA e adiciona TAREFA ao container de tarefas
    const lista = this.pendentes.querySelector(`.lista[id="${listObj.idLista}"]`)
    lista.querySelector('.tarefas').append(tarefa)

    // atualiza o contador de tarefas
    this.#updateCompletas(lista.closest(".lista"), listObj)
  }

  #renderTarefa(taskObj) {
    // clona template de tarefa
    const tarefa = document.querySelector("#tarefa-template").content.cloneNode(true).querySelector(".tarefa")

    tarefa.id = taskObj.idTarefa // ID TAREFA
    // CLASSES DE COR TAREFA
    tarefa.classList.add(`${taskObj.cor}-borda`)
    tarefa.classList.add(`${taskObj.cor}-borda`)

    if (taskObj.completa) {
        tarefa.querySelector('.unchecked').classList.add('hide')
        tarefa.querySelector('.checked').classList.remove('hide')
    }

    // NOME
    tarefa.querySelector(".tarefa-nome").textContent = taskObj.nome
    
    // DESCRIÇÃO
    const desc = tarefa.querySelector(".tarefa-desc")
    desc.textContent = taskObj.descricao
    desc.classList.add(`${taskObj.cor}-fundo`)

    // PRIORIDDE
    const prioridade = tarefa.querySelector(".prioridade")
    prioridade.textContent = `${taskObj.prioridade}P`
    prioridade.classList.add(`p${taskObj.prioridade}`)
    // PRAZO
    tarefa.querySelector(".prazo").textContent = Utils.formatDate(taskObj.prazo)

    // TEMPO RESTANTE
    const faltam = tarefa.querySelector('.faltam')
    faltam.classList.add(`${taskObj.cor}-fundo`)

    const tempo = Utils.calculaTempoRestante(taskObj.prazo)
    const pimentao = Utils.getPimentao(tempo)
    tarefa.querySelector(".tempo").textContent = tempo
    tarefa.querySelector(".pimentao-tempo").src = pimentao

    // INICIALIZA OS EVENT LISTENERS
    this.#taskInit(tarefa, taskObj)
    return tarefa
  }

  #taskInit(tarefa, taskObj) {
    // INICIALIZA OS EVENT LISTENERS

    const idTarefa = taskObj.idTarefa
    const listObj = this.controle.listas.find( l => {
        return l.tarefas.some( t => t.idTarefa === idTarefa )
    })
    // elemento DIV da lista inteira
    const lista = document.querySelector(`.lista[id="${listObj.idLista}"]`)

    // =============================================================================================

    // abre fecha o dropdown MORE
    this.#toggleDropdown(tarefa)

    // =============================================================================================

    const uncheck = tarefa.querySelector(".unchecked")
    const check = tarefa.querySelector(".checked")
    uncheck.addEventListener("click", () => {
      // marca a caixa de seleção
      uncheck.classList.toggle("hide")
      check.classList.toggle("hide")
      // atualiza informações por trás
      taskObj.toggleStatus()
      // atualiza contador de tarefas lista
      this.#updateCompletas(lista, listObj)
      this.controle.saveToLocalStorage()
    })
    check.addEventListener("click", () => {
      // desmarca a caixa de seleção
      uncheck.classList.toggle("hide")
      check.classList.toggle("hide")
      // atualiza informações por trás
      taskObj.toggleStatus()
      // atualiza contador de tarefas lista
      this.#updateCompletas(lista, listObj)
      this.controle.saveToLocalStorage()
    })

    // =============================================================================================

    // deleta tarefa
    tarefa.querySelector(".more-del").addEventListener("click", (e) => {
      e.stopPropagation()

      this.controle.excluirTarefa(listObj.idLista, idTarefa)
      // atualiza contador de tarefas da lista
      this.#updateCompletas(lista, listObj)

      tarefa.remove()
    })

    // =============================================================================================

    // EDITAR LISTA
    const editarBotao = tarefa.querySelector(".more-edit")
    this.editarTarefaDialog.setBotao(editarBotao, listObj, taskObj)

    // =============================================================================================

    const moveBotao = tarefa.querySelector(".more-move")
    moveBotao.addEventListener("click", (e) => {
      const moverTarefa = new Dialog(
        moveBotao,
        (data) => this.#moverTarefa(data, idTarefa, listObj.idLista),
        'mover-tarefa'
      )
      moverTarefa.abrirMover(this.controle.listas, listObj.idLista)
      
    })

    // =============================================================================================
  }

  #moverTarefa(data, idTarefa, idOrigem) {
    this.controle.moverTarefa( idTarefa, idOrigem, data['mover-para'] )
    this.loadListasFromStorage()
  }

  #editarTarefa(idLista, idTarefa, newData) {
    this.controle.editarTarefa(idLista, idTarefa, newData)
    this.#carregaTarefasVisiveis(idLista)  
  }

  // =======================================================================================================================================
  
  #toggleDropdown(element) {
    // abre e fecha elemento genérico 'div.more'
    element.querySelector(".more").addEventListener("click", (e) => {
      e.stopPropagation()
      const dropdown = element.querySelector(".more-dropdown")
      dropdown.classList.toggle("hide")
    })
  }
}

export { DOM }
