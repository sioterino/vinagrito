class Utils {

    static #listaIDS = []

    // RETORNA UM NOVO ID PARA TAREFAS E LISTAS
    static #geararID ( tipo ) {
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
        let id = this.#geararID( tipo )


        while ( true ) {
            // se o ID não estiver contido na listaIDS, então ele
            // salva esse novo ID e o retorna ao sistema
            if ( ! this.#listaIDS.includes( id ) ) {
                this.#listaIDS.push( id )
                return id

            } else {
                // caso esse ID ele já exista,
                // um novo é gerado e o laço reinicia
                id = this.#geararID( tipo )
            }
        }

    }
    
}

