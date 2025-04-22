class Utils {

    static #listaIDS = [] // armazena todos os ids do sistema

    // RETORNA UM NOVO ID PARA TAREFAS E LISTAS
    static #gerarID ( tipo ) {
        // TAREFAS possuem início padrão de 67, enquanto LISTAS começam com 48

        // (Date.now()) : retorna um valor em milissegundos desde 01/01/1970
        // (Math.floor(Math.random() * 1000)) : retorna um valor entre 1 e 1000

        switch ( tipo ) {
            case 'tarefa':
                return '67' + Date.now() + Math.floor( Math.random() * 1000 )

            case 'lista':
                return '48' + Date.now() + Math.floor( Math.random() * 1000 )

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

    static formatDate(input, monthMethod = 'short') {
        const data = new Date(input)
    
        if (!isNaN(data)) {
            const options = {
                day: '2-digit',
                month: monthMethod,
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
            }
    
            return new Intl.DateTimeFormat('pt-BR', options).format(data).replace('.', '')
        }
    
        return 'Data inválida'
    }
    

    static calculaTempoRestante(input) {
        const data = new Date(input)

        const agora = new Date()
        const diferenca = data.getTime() - agora.getTime()

        const negativo = diferenca < 0
        const diferencaModular = Math.abs(diferenca)
    
        const segundos = Math.floor(diferencaModular / 1000)
        const minutos = Math.floor(segundos / 60)
        const horas = Math.floor(minutos / 60)
        const dias = Math.floor(horas / 24)
    
        if (dias > 0) return `${negativo ? '-' : ''}${dias}d`
        if (horas > 0) return `${negativo ? '-' : ''}${horas % 24}h`
        if (minutos > 0) return `${negativo ? '-' : ''}${minutos % 60}min`
        if (segundos > 0) return `${negativo ? '-' : ''}${segundos % 60}s`
    
        return 'agora'
    }

    static getListaByID(listas, id) {
        return listas.find(item => item.idLista === id)
    }

    static getTaskByID(tarefas, id) {
        return tarefas.find(item => item.idTarefa === id)
    }

    static randint(max, min = 0, inclusive = true) {
        if (inclusive) return Math.floor(Math.random() * (max - min + 1)) + min
        
        else return Math.floor(Math.random() * (max - min)) + min
    }

    static getPimentao(str) {
        if (str.includes('-')) {
            return '../img/podre-claro.png'
        }

        else if (str.includes('d')) {
            return '../img/pimentao-vermelho.png'
        }

        else if (str.includes('h')) {
            return '../img/pimentao-amarelo.png'
        }

        else if (str.includes('m')) {
            return '../img/pimentao-verde.png'
        }
    }

}

export { Utils }