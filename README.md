*<p align="center"> Instituto Federal de Santa Catarina - Análise e Desenvolvimento de Sistemas - Programação Frontend II - 2025.1 </p>*
<br>

*<h1 align="center"> Projeto 1 / Sistema de Gerenciamento de Tarefas : Vinagrito </h1>*
*<p align="center"> Programação Orientada a Objetos </p>*
### 
<br>

Professor: Adriano Lima  
Equipe: Júlia Manuela Turnes, Sofia Alves Toreti e Sant Semeghini
<br> 
<br>

# *Nosso Projeto*
Vinagrito é um sistema de gerenciamento de tarefas projetado para acompanhar os usuários em suas diversas atividades diárias. Por meio da criação de listas personalizáveis, o Vinagrito permite que o usuário agrupe tarefas, defina prioridades, prazos, descrições e datas, facilitando a visualização, organização e conclusão de suas metas.

<br>

# *Conceitos de POO utilizados*

  1. ### Encapsulamento
     1. *Em programação orientada a objetos, o “encapsulamento” refere-se a “esconder” atributos de uma classe de quem for utilizá-la, tornando-os inacessíveis fora da classe. Na implementação do Vinagrito, esse conceito foi utilizado para garantir que a lógica interna estivesse protegida de modificações e/ou acessos indevidos, promovendo a segurança e integridade do código.* <br>

     2. *Pode ser visto na classe DOM, a qual utiliza métodos e propriedades privadas, como #qtdLista, #renderizarLista, #newTask e etc.. (linhas de código 42, 52, 85 em DOM.js)*
<br>

  2. ### Polimorfismo
     1. *O “polimorfismo” é a maneira com que objetos de diferentes classes podem responder à mesma situação de formas diferentes, por meio de heranças, interfaces ou classes abstratas. Na implementação do Vinagrito, esse conceito é visto na classe Dialog, a qual se altera em diferentes aplicações, expressando a mesma interface com diferentes comportamentos.* <br>

     2. *Pode ser visto em : <br> <br> 
              “this.taskDialog” → Resulta na criação de uma nova tarefa, chamando #newTask (linhas de código 14 e 223 em DOM.js), <br>
              “editarDialog” → Resulta na edição de uma lista, chamando #editarLista (linhas de código 215 e 218 em DOM.js).*
<br>

  3. ### Abstração
     1. *Outro pilar da POO é a "abstração", um conceito que visa o foco nos aspectos essenciais do objeto, criando um modelo simplificado de algo complexo. No Vinagrito, esse conceito pode ser visto na classe DOM, a qual oculta detalhes da manipulação de listas e tarefas, utilizando-se de métodos públicos como loadListasFromStorage() e newList(). Usos assim permitem que o código seja segmentado e funcional no contexto de equipe e eficiência do código.* <br>

     2. *(linhas de código 17 e 78 DOM.js)*
<br>

  4. ### Instanciação de Objetos
     1. *Em POO, a “instanciação de objetos” consiste na criação de objetos a partir de uma classe, propiciando a modelagem de entidades do mundo real, assim como a flexibilização do código. No Vinagrito, isso foi utilizado através da chamada do construtor do objeto, o qual carrega seu próprio conjunto de dados e comportamentos.* <br>

     2. *Pode ser visto em :* <br><br>
        ```
         // main.js (linhas de código 5 e 10)

            const dom = new DOM();
            new Dialog(criarLista, callback);


        // Controle.js (linha de código 30)

            const novaLista = new Lista(data);
        
         ```
<br>

  5. ### Relacionamento
     1. *A “associação” ou “relacionamento” entre duas ou mais classes é um conceito fundamental da POO, onde uma classe utiliza objetos de outra como parte de sua operação. No Vinagrito, isso foi utilizado para garantir a simplificação de testes e instanciações.* <br>

     2. *Pode ser visto em :* <br><br>
        ```
         // DOM.js (linhas de código 10, 14 ..)

          this.controle = new Controle();
          this.taskDialog = new Dialog(...);
        
         ```
<br>
