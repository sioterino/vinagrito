class Listas {
    // construtor das lista que recebe nome e cor como parametro
    constructor(nome, cor) {
        this.idTarefa = Utils.novoID('lista');
        this.nome = this.nome;
        this.cor = this.cor;
        this.tarefas = [];
    }

    adicionarTarefa(tarefa) {
        this.tarefas.push(tarefa);
    }

    removerTarefa(idTarefa) {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
    }

    ordenarTarefa(criterio = 'none') {
        const sorters = {
          dataCrescente: (a, b) => new Date(a.date) - new Date(b.date),
          dataDecrescente: (a, b) => new Date(b.date) - new Date(a.date),
          prioridadeCrescente: (a, b) => a.prioridade - b.prioridade,
          prioridadeDescrescente: (a, b) => b.prioridade- a.prioridade,
          descriçãoMaior: (a, b) => a.descrição.length - b.descrição.length,  
          descriçãoMenor: (a, b) => b.descrição.length - a.descrição.length,  
          none: () => 0,
        };
      
        return this.tasks.sort(sorters[criterio] || sorters['none']);
      }
      

    filtrarTarefa(filter = 'all') {
       
    }

    editar(novoNome, novaCor) {
        this.nome = novoNome;
        this.cor = novaCor;
    }

    apagartarefa(idTarefa, ) {
       
    }

    moverTarefa(idTarefa, lista) {
        const tarefa = this.getTarefaByID(idTarefa);
        if(tarefa){
            this.removerTarefa(idTarefa);
            tarefa.idLista = idListaDestino;
            idListaDestino.adicionarTarefa(this.tarefas);
        }
    }

    // retorna a tarefa com o ID correspondente
    getTarefaByID(idTarefa) {
        return this.tarefas.find(tarefas=> tarefas.id === idTarefa); 
    }

    editarNomeLista(novoNome){
        this.name = novoNome;
    }
}