class Utils {

    static #listaIDS = [] // armazena todos os ids do sistema

    // RETORNA UM NOVO ID PARA TAREFAS E LISTAS
    static #gerarID ( tipo ) {
        // TAREFAS possuem início padrão de 67, enquanto LISTAS começam com 48

        // (Date.now()) : retorna um valor em milissegundos desde 01/01/1970
        // (Math.floor(Math.random() * 1000)) : retorna um valor entre 1 e 1000

        switch ( tipo ) {
            case 'tarefa':
                return '67' + Date.now() + Math.floor( Math.random() * 1000 );

            case 'lista':
                return '48' + Date.now() + Math.floor( Math.random() * 1000 );

            default:
                throw new Error( 'Tipo inválido' )
        }
    }


    // RETORNA UM ID NOVO E GARANTE QUE ELE É ÚNICO NO SISTEMA
    static novoID ( tipo = 'tarefa' ) {

        // gera o id aléatório
        let id = this.#gerarID( tipo )


        while ( true ) {
            // se o ID não estiver contido na listaIDS, então ele
            // salva esse novo ID e o retorna ao sistema
            if ( ! this.#listaIDS.includes( id ) ) {
                this.#listaIDS.push( id )
                return id

            } else {
                // caso esse ID ele já exista,
                // um novo é gerado e o laço reinicia
                id = this.#gerarID( tipo )
            }
        }

    }
    


    // RETORNA UM ELEMENTO NO DOM EM MENOS LINHAS
    static newEl (tag, classes = null, id = null, textContent = null) {
        // por padrão, o elemento não possui classe, id ou textContent

        /*
            COMO USAR:
            Utils.newEl( 'p', 'desc', 'aqui fica escrito a descrição')
            Utils.newEl( 'span', ['icon', 'close'], 'close')
            Utils.newEl( 'div', 'wrapper')
            Utils.newEl( 'li', null, 'item de uma lista')
            Utils.newEl( 'ul')
        */

        const el = document.createElement( tag )

        if ( Array.isArray(classes) ) {
            classes.forEach(c => {
                el.classList.add(c)
            })

        } else {
            el.classList.add(classes)
        }

        if (id != null) {
            el.id = id
        }

        if (textContent != null) {
            el.textContent = textContent
        }

        return el
    }
}

export { Utils }