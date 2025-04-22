import { Utils } from "./Utils.js"
import { Controle } from "./Controle.js"
import { Dialog } from "./Dialog.js"

class DOM {

  #qtdLista = 0 // contador de listas

  constructor() {
    this.controle = new Controle() // controle de listas
    this.pendentes = document.querySelector(".listas") // container das listas

    // caixa de dialogo para criação de novas listas
    this.taskDialog = new Dialog(null, (data, id) => this.#newTask(data, id))
  }

  loadListasFromStorage() {
    // carrega listas do localStorage para dentro do Controle
    this.controle.loadFromLocalStorage()
    
    // itera o as listas no Controle e renderiza elas
    this.controle.listas.forEach(listObj => {
      this.#renderizarLista( listObj )
    })
  }

  handleSearch(e, isList = true, idLista = null) {
    const valor = e.target.value
    
    if (isList) {
        this.controle.buscaLista(valor)
        this.#carregaListasVisiveis()
    } else {
        this.controle.buscaTarefa(idLista, valor)
        this.#carregaTarefasVisiveis(idLista)
    }

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

  newList(formObj, id = null) {
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
    this.#addQtdLista()

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
      }
    })

    lista.querySelectorAll('.filtros-select').forEach(select => {
        select.addEventListener('click', e => e.stopPropagation())
    })

    lista.querySelector(".more-del").addEventListener("click", (e) => {
      // deleta uma lista
      this.controle.remover(idLista)
      lista.remove()
      this.#addQtdLista(false)
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
        tarefas.innerHTML = ''
        ordenado.forEach(taskObj => {
            const t = this.#renderTarefa(taskObj)
            tarefas.append(t)
        })
    })

    const filtrar = lista.querySelector('.select-filter')
    filtrar.addEventListener('change', e => {
        const value = e.target.value
        const filtrado = Utils.getListaByID(this.controle.listas, idLista).filtrarTarefa(value)

        const tarefas = lista.querySelector('.tarefas')
        tarefas.innerHTML = ''
        filtrado.forEach(taskObj => {
            const t = this.#renderTarefa(taskObj)
            tarefas.append(t)
        })
    })


    // =====================================================================================================================================

    // EDITAR TAREFA
    const editarBotao = lista.querySelector(".more-edit")
    editarBotao.addEventListener("click", (e) => {
      e.stopPropagation()
      const listObj = this.controle.listas.find((l) => l.idLista == idLista)

      const editarDialog = new Dialog(editarBotao, (data, _) =>
        this.#editarLista(idLista, data)
      )
      editarDialog.abrirEdicao(listObj, idLista)
    })

    // NOVA TAREFA
    const botao = lista.querySelector(".nova-tarefa")
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
    // abre e fecha conteúdo interno das listas
    this.pendentes.querySelectorAll(".lista").forEach((l) => {
        const alvo = l.querySelector(".content")
        alvo.classList.add("hide")

        if (idLista !== null && l.id === idLista) {
            alvo.classList.remove("hide")

            // LIMPA VALORES DE FILTRO QUANDO FECHAR / ABRIR LISTA >> CORRIGIR ERROS CASO HAJA TEMPO =======================================
            // l.querySelector('#searchbar').value = ''
            // l.querySelector('.select-filter').selectedIndex = 0
            // l.querySelector('.select-order').selectedIndex = 0
        }
    })
  }

  #toggleDropdown(element) {
    // abre e fecha elemento genérico 'div.more'
    element.querySelector(".more").addEventListener("click", (e) => {
      e.stopPropagation()
      const dropdown = element.querySelector(".more-dropdown")
      dropdown.classList.toggle("hide")
    })
  }

  #addQtdLista(add = true) {
    // atualiza contador de LISTAS
    // se (add == true) : ++
    // se (add == false) : --
    this.#qtdLista += add ? 1 : -1
    document.querySelector(".fazendo .qtd-listas").textContent = this.#qtdLista
  }

  #updateCompletas(lista, listObj) {
    // atualiza contador de TAREFAS
    const qtdTask = listObj.tarefas?.filter((task) => task.ativo).length
    const qtdDone = listObj.tarefas?.filter((task) => task.ativo && task.completa).length

    lista.querySelector(".lista-status").textContent = `${qtdDone}/${qtdTask}`
  }

  #newTask(formObj, idLista) {
    // CRIA NOVA TAREFA

    // cria objeto com nova tarefa, incluindo ID e etc
    const taskObj = this.controle.novaTarefa(formObj, idLista)
    // renderiza nova tarefa na ágina usando o obj ^ acima
    const tarefa = this.#renderTarefa(taskObj)

    // carrega elemento LISTA e adiciona TAREFA ao container de tarefas
    const lista = this.pendentes.querySelector(`.lista[id="${idLista}"]`)
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
        tarefa.querySelector('unchecked').classList.add('hide')
        tarefa.querySelector('checked').classList.remove('hide')
    }

    // NOME
    tarefa.querySelector(".tarefa-nome").textContent = taskObj.nome
    
    // DESCRIÇÃO
    const desc = tarefa.querySelector(".tarefa-desc")
    desc.textContent = taskObj.descricao
    desc.classList.add(`${taskObj.cor}-fundo`)

    // PRIORIDDE
    tarefa.querySelector(".prioridade").textContent = `${taskObj.prioridade}P`
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

    // abre fecha o dropdown MORE
    this.#toggleDropdown(tarefa)

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

    // deleta tarefa
    tarefa.querySelector(".more-del").addEventListener("click", (e) => {
      e.stopPropagation()

      this.controle.excluirTarefa(listObj.idLista, idTarefa)
      // atualiza contador de tarefas da lista
      this.#updateCompletas(lista, listObj)

      tarefa.remove()
    })

    tarefa.querySelector(".more-edit").addEventListener("click", (e) => {
      console.log("EDIT") // ===============================================================================================================
    })

    tarefa.querySelector(".more-move").addEventListener("click", (e) => {
      console.log("MOVE") // ===============================================================================================================
    })
  }
}

export { DOM }
