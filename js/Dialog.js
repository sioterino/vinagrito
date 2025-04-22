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

        if (botao?.classList.contains('more-move')) {
            this.#dialog = document.querySelector('#mover-lista')

        } else if (botao?.classList.contains('nova-lista')) {
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
        if (e.target.id === 'mover-lista') {
            this.#dialog.querySelector('#mover-para').textContent = ''
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

    abrirEdicao(data, idLista) {
        this.#idLista = idLista
        this.#dialog.showModal()
    
        for (const [key, value] of Object.entries(data)) {
            const field = this.form.querySelector(`[name="${key}"]`)
            if (field) field.value = value
        }
    }

    abrirMover(listas, idLista) {
        this.#idLista = idLista

        const nomesID = listas.map(l => {
            return { nome: l.nome, id: l.idLista }
        })
        const select = this.#dialog.querySelector('#mover-para')
        nomesID.forEach(l =>  {
            const el = document.createElement('option')
            el.value = l.id
            el.textContent = l.nome

            if (l.id === idLista) {
                el.selected = true;
                el.disabled = true;
                select.prepend(el)

            } else {
                select.append(el)
            }
        })

        this.#dialog.showModal()
    }
    
}

export { Dialog }