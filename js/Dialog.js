class Dialog {
    #botao
    #dialog
    #callback
    #idLista = null
    #idTarefa = null
    #mode = 'none'  // 'criar-*' | 'editar-*' | 'mover-*'

    constructor(botao = null, callback = null, mode = 'none') {
        this.#callback = callback
        this.#mode = mode
        this.data = {}

        if (botao) {
            this.setBotao(botao)
        }

        this.#setDialogByMode()
        this.#dialog.addEventListener('click', e => this.#fecharModal(e))
        this.form.addEventListener('submit', e => this.#formSubmit(e))
    }

    setBotao(botao, listObj = null, taskObj = null) {
        this.#botao = botao
        
        if (!this.#dialog) this.#setDialogByMode()
            
        if (this.#mode === 'editar-tarefa') {
            this.#botao.addEventListener('click', () => {
                this.#dialog.showModal()
                if (taskObj) this.#abrirEdicaoTarefa(taskObj)
                this.#idLista = listObj?.idLista ?? null
                this.#idTarefa = taskObj?.idTarefa ?? null
            })
        }

        else if (this.#mode === 'editar-lista') {
            this.#botao.addEventListener('click', () => {
                this.#dialog.showModal()
                if (listObj) this.#abrirEdicaoLista(listObj)
            })
        }

        else {
            this.#botao.addEventListener('click', () => {
                this.#dialog.showModal()
                this.#idLista = listObj?.idLista ?? null
            })
        }
    }

    #setDialogByMode() {
        switch (this.#mode) {
            case 'criar-lista':
                this.#dialog = document.querySelector('#nova-lista')
                break
            case 'editar-lista':
                this.#dialog = document.querySelector('#editar-lista')
                break
            case 'criar-tarefa':
                this.#dialog = document.querySelector('#nova-tarefa')
                break
            case 'editar-tarefa':
                this.#dialog = document.querySelector('#editar-tarefa')
                break
            case 'mover-tarefa':
                this.#dialog = document.querySelector('#mover-tarefa')
                break
        }

        this.form = this.#dialog.querySelector('form')
    }

    #fecharModal(e) {
        if (e.target.tagName.toLowerCase() === 'dialog') {
            this.#dialog.close()
            this.form.reset()
        }

        if (this.#mode === 'move-tarefa') {
            this.#dialog.querySelector('#mover-para').innerHTML = ''
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
            
            if (this.#mode !== 'editar-tarefa') {
                this.#callback(this.data, this.#idLista)
            } else {
                // console.log('lista: ', this.#idLista)
                // console.log('tarefa: ', this.#idTarefa)
                // console.log('data: ', this.data)
                this.#callback(this.data, this.#idLista, this.#idTarefa)
            }

        }

        this.#idLista = null

        if (this.#mode === 'move-tarefa') {
            const moverPara = this.#dialog.querySelector('#mover-para')
            if (moverPara) moverPara.innerHTML = ''
        }
    }

    #abrirEdicaoLista(data) {
        this.#idLista = data.idLista
        this.form.querySelector('#nome-editar-lista').value = data.nome
        this.form.querySelector('#cor-editar-lista').value = data.cor
    }

    #abrirEdicaoTarefa(data) {
        this.#idLista = data.idLista
        this.form.querySelector('#nome-editar-tarefa').value = data.nome
        this.form.querySelector('#desc-editar-tarefa').value = data.descricao
        this.form.querySelector('#prioridade-editar-lista').value = data.prioridade
        this.form.querySelector('#data-editar-lista').value = data.prazo
    }

    abrirMover(listas, idLista) {
        this.#idLista = idLista

        const select = this.#dialog.querySelector('#mover-para')
        listas.forEach(l => {
            if (l.ativo) {
                const option = document.createElement('option')
                option.value = l.idLista
                option.textContent = l.nome

                if (l.idLista === idLista) {
                    option.disabled = true
                    option.selected = true
                    select.prepend(option)
                } else {
                    select.appendChild(option)
                }
            }
        })

        this.#dialog.showModal()
    }
}

export { Dialog }
