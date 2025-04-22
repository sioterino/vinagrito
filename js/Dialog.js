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

    abrirEdicao(data, idLista) {
        this.#idLista = idLista
        this.#dialog.showModal()
    
        for (const [key, value] of Object.entries(data)) {
            const field = this.form.querySelector(`[name="${key}"]`)
            if (field) field.value = value
        }
    }
    
}

export { Dialog }