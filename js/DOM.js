class Dialog {
    constructor(dialog) {
        this.dialog = dialog
    }

    new(tag) {
        document.querySelector(tag).addEventListener('click', () => this.dialog.showModal())

        this.dialog.addEventListener('click', e => this.#fecharModal(e))

        this.dialog.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', e => this.#formSubmit(e))
        })
    }

    #fecharModal(e) {
        if (e.target.tagName.toLowerCase() === 'dialog') {
            this.dialog.close()
            this.#resetForm()
        }
    }

    #formSubmit(e) {
        e.preventDefault()
        this.dialog.close()
        const input = this.#getContent()
        console.log(input)
        e.target.reset()
    }

    #resetForm() {
        this.dialog.querySelectorAll('form').forEach(form => form.reset())
    }

    #getContent() {
        const data = new FormData(this.dialog.querySelector('form'))
        const inputs = {}
        data.forEach( (val, key) => {
            inputs[key] = val
        })

        return inputs
    }


}

export { Dialog }
