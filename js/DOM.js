class DOM {
    constructor(dialog) {
        this.dialog = dialog
        this.init()
    }

    init() {
        console.log('working init')
        document.querySelector('.nova-lista').addEventListener('click', () => {
            this.dialog.showModal()
        })

        this.dialog.addEventListener('click', e => this.fecharModal(e))

        this.dialog.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', e => this.formSubmit(e))
        })
    }

    fecharModal(e) {
        if (e.target.tagName.toLowerCase() === 'dialog') {
            this.dialog.close()
            this.resetForm()
        }
    }

    formSubmit(e) {
        e.preventDefault()
        this.dialog.close()
        e.target.reset()
    }

    resetForm() {
        this.dialog.querySelectorAll('form').forEach(form => form.reset())
    }
}

export { DOM }