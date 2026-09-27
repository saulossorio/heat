
// Conjuntos de heurísticas — siga esta estrutura para adicionar novos conjuntos.
//
// CONVENÇÃO DE NOMES DE IMAGENS:
// Coloque as imagens em images/ usando o padrão:
//   images/{set-key}-{heuristic-id-lowercase}-good.jpg
//   images/{set-key}-{heuristic-id-lowercase}-bad.jpg
//
// Formatos suportados: .jpg, .png, .gif, .webp

const HEURISTIC_SETS = {
  nielsen: {
    name: "Heurísticas de Controle (Nielsen)",
    heuristics: [
      {
        id: 'H1',
        name: 'Visibilidade do status do sistema',
        description: 'O design deve sempre manter os usuários informados sobre o que está acontecendo, por meio de feedback apropriado dentro de um período razoável de tempo.',
        goodExample: 'Após o usuário acionar um comando, um indicador visual confirma imediatamente que a ação foi recebida. Operações que demandam tempo exibem um indicador de progresso. O estado atual da interface (selecionado, desativado, processando) é sempre visível.',
        badExample:  'O usuário aciona um botão e nada acontece visivelmente, deixando-o em dúvida se a ação foi registrada. O sistema executa operações em segundo plano sem qualquer indicação. Não fica claro qual é o estado atual da interface.',
        goodImage: 'images/nielsen-h1-good.jpg',
        badImage:  'images/nielsen-h1-bad.jpg'
      },
      {
        id: 'H2',
        name: 'Correspondência entre o sistema e o mundo real',
        description: 'O design deve falar a língua dos usuários. Use palavras, frases e conceitos familiares ao usuário, em vez de jargão interno. Siga as convenções do mundo real, fazendo com que a informação apareça em uma ordem natural e lógica.',
        goodExample: 'Ícones e símbolos correspondem a objetos ou ações reconhecíveis (uma lixeira para descartar, uma lupa para buscar). A linguagem usada é familiar ao público-alvo, sem jargão técnico desnecessário. As informações seguem uma sequência natural.',
        badExample:  'O sistema apresenta mensagens com termos técnicos ou códigos internos que o usuário não compreende. As metáforas visuais são abstratas ou genéricas demais. A ordem das etapas não corresponde ao fluxo mental do usuário.',
        goodImage: 'images/nielsen-h2-good.jpg',
        badImage:  'images/nielsen-h2-bad.jpg'
      },
      {
        id: 'H3',
        name: 'Controle e liberdade do usuário',
        description: 'Os usuários frequentemente realizam ações por engano. Eles precisam de uma "saída de emergência" claramente marcada para deixar a ação indesejada sem ter que passar por um processo extenso.',
        goodExample: 'O sistema oferece comandos para desfazer e refazer ações. Diálogos modais têm um botão claro de cancelar. O usuário consegue interromper processos em andamento sem perder o trabalho já feito.',
        badExample:  'O usuário inicia uma ação por engano e não encontra forma de cancelá-la, sendo obrigado a completá-la. Não há mecanismo de desfazer. Para sair de um fluxo, é preciso fechar o aplicativo inteiro.',
        goodImage: 'images/nielsen-h3-good.jpg',
        badImage:  'images/nielsen-h3-bad.jpg'
      },
      {
        id: 'H4',
        name: 'Consistência e padrões',
        description: 'Os usuários não devem ter que se perguntar se diferentes palavras, situações ou ações significam a mesma coisa. Siga as convenções da plataforma e da indústria.',
        goodExample: 'O mesmo termo é usado consistentemente para a mesma ação em todo o sistema. Os controles seguem convenções da plataforma. Elementos visuais similares têm comportamentos similares em qualquer parte do sistema.',
        badExample:  'A mesma ação é descrita com termos diferentes em telas diferentes. Os controles violam convenções estabelecidas, exigindo aprendizado adicional. Botões de aparência idêntica produzem resultados imprevisíveis dependendo da tela.',
        goodImage: 'images/nielsen-h4-good.jpg',
        badImage:  'images/nielsen-h4-bad.jpg'
      },
      {
        id: 'H5',
        name: 'Prevenção de erros',
        description: 'Mensagens de erro boas são importantes, mas os melhores designs previnem cuidadosamente problemas de ocorrerem em primeiro lugar. Ou elimine condições propensas a erros, ou verifique-as e apresente aos usuários uma opção de confirmação antes que se comprometam com a ação.',
        goodExample: 'O sistema valida campos de formulário em tempo real, mostrando dicas antes do envio. Ações destrutivas pedem confirmação explícita. Valores padrão sensatos reduzem a chance de erros de configuração.',
        badExample:  'O usuário só descobre que preencheu um campo errado depois de enviar o formulário inteiro. Ações destrutivas são executadas sem qualquer confirmação. Não há valores padrão, e qualquer combinação inválida é aceita silenciosamente.',
        goodImage: 'images/nielsen-h5-good.jpg',
        badImage:  'images/nielsen-h5-bad.jpg'
      },
      {
        id: 'H6',
        name: 'Reconhecimento em vez de memorização',
        description: 'Minimize a carga de memória do usuário tornando objetos, ações e opções visíveis. O usuário não deve ter que lembrar informações de uma parte da interface para outra. Informações necessárias para usar o design devem estar visíveis ou ser facilmente recuperáveis quando necessário.',
        goodExample: 'As opções disponíveis estão visíveis em menus e listas, em vez de exigirem memorização de comandos. O sistema mantém histórico de itens recentes. Informações relevantes permanecem acessíveis durante todo o fluxo.',
        badExample:  'O usuário precisa decorar comandos ou códigos para usar o sistema. Informações importantes desaparecem da tela quando o usuário avança para a próxima etapa. Não há histórico ou referência ao que já foi feito.',
        goodImage: 'images/nielsen-h6-good.jpg',
        badImage:  'images/nielsen-h6-bad.jpg'
      },
      {
        id: 'H7',
        name: 'Flexibilidade e eficiência de uso',
        description: 'Atalhos, ocultos para usuários novatos, podem acelerar a interação para o usuário especialista, de modo que o design possa atender tanto a usuários inexperientes quanto experientes. Permita que os usuários personalizem ações frequentes.',
        goodExample: 'O sistema oferece atalhos de teclado ou gestos para usuários avançados, sem prejudicar quem prefere navegar pelos menus. Há opções de personalização para fluxos frequentes. Diferentes caminhos levam ao mesmo resultado conforme a preferência do usuário.',
        badExample:  'O sistema obriga todos os usuários ao mesmo fluxo, sem oferecer atalhos. Não há nenhuma opção de personalização para usuários experientes. A interface é otimizada apenas para iniciantes ou apenas para experientes, excluindo o outro grupo.',
        goodImage: 'images/nielsen-h7-good.jpg',
        badImage:  'images/nielsen-h7-bad.jpg'
      },
      {
        id: 'H8',
        name: 'Design estético e minimalista',
        description: 'Interfaces não devem conter informações que sejam irrelevantes ou raramente necessárias. Cada unidade extra de informação em uma interface compete com as unidades relevantes de informação e diminui sua visibilidade relativa.',
        goodExample: 'A interface mostra apenas o necessário para a tarefa atual. A hierarquia visual reforça os elementos mais importantes. Elementos decorativos são usados com moderação e não competem com o conteúdo funcional.',
        badExample:  'A tela está sobrecarregada com elementos decorativos, anúncios e informações secundárias que distraem da tarefa principal. A hierarquia visual é confusa e não orienta o olhar do usuário.',
        goodImage: 'images/nielsen-h8-good.jpg',
        badImage:  'images/nielsen-h8-bad.jpg'
      },
      {
        id: 'H9',
        name: 'Ajude os usuários a reconhecer, diagnosticar e recuperar-se de erros',
        description: 'Mensagens de erro devem ser expressas em linguagem simples (sem códigos de erro), indicar precisamente o problema e sugerir construtivamente uma solução.',
        goodExample: 'Mensagens de erro descrevem o que aconteceu em linguagem compreensível e sugerem como resolver. O sistema destaca o campo com erro no formulário e fornece orientação direta. As mensagens são respeitosas e construtivas.',
        badExample:  'O erro mostra apenas um código numérico sem explicação. A mensagem culpa o usuário sem oferecer caminho para a solução. O sistema não indica onde está o erro nem como corrigi-lo.',
        goodImage: 'images/nielsen-h9-good.jpg',
        badImage:  'images/nielsen-h9-bad.jpg'
      },
      {
        id: 'H10',
        name: 'Ajuda e documentação',
        description: 'É melhor se o sistema não precisar de nenhuma explicação adicional. No entanto, pode ser necessário fornecer documentação para ajudar os usuários a entender como completar suas tarefas.',
        goodExample: 'A documentação está disponível e é fácil de pesquisar. As instruções são focadas na tarefa do usuário, com etapas concretas. Há ajuda contextual em pontos críticos da interface, sem interromper o fluxo da tarefa.',
        badExample:  'A documentação é difícil de encontrar ou está organizada por funcionalidade do sistema em vez de por tarefa do usuário. A ajuda contextual está ausente. O usuário precisa sair do sistema para encontrar orientação.',
        goodImage: 'images/nielsen-h10-good.jpg',
        badImage:  'images/nielsen-h10-bad.jpg'
      },
    ]
  },

  domain: {
    name: "Heurísticas de Domínio (AAVIs)",
    heuristics: [
      {
        id: 'Hp1',
        name: 'Naturalidade da interação e senso de presença',
        description: 'A interação no ambiente virtual deve se aproximar o máximo possível do que o usuário faria no mundo real, criando uma sensação convincente de estar presente naquele espaço. Quanto mais natural for a interação, menos o usuário perceberá que está usando um sistema virtual.',
        goodExample: 'O usuário pega um objeto estendendo a mão e fechando os dedos com o controlador, exatamente como faria no mundo real. A movimentação responde imediatamente aos movimentos do corpo, sem atraso perceptível.',
        badExample:  'O usuário precisa aprender que deve pressionar um botão específico para pegar objetos. Ao mover a cabeça rapidamente, o ambiente demora para atualizar o ponto de vista, quebrando a sensação de presença.',
        goodImage: 'images/domain-hp1-good.jpg',
        badImage:  'images/domain-hp1-bad.jpg'
      },
      {
        id: 'Hp2',
        name: 'Experiência de aprendizagem ativa e significativa',
        description: 'O ambiente deve proporcionar uma experiência educacional em que o usuário aprende fazendo, explorando e interagindo, não apenas observando. As atividades devem ter conexão clara com os objetivos de aprendizagem.',
        goodExample: 'O usuário realiza procedimentos práticos que simulam situações reais de trabalho, recebendo retorno imediato sobre cada ação. A experiência incentiva a experimentação e a descoberta por meio da interação direta.',
        badExample:  'O ambiente limita-se a apresentar vídeos ou textos explicativos, sem permitir que o usuário pratique. As atividades disponíveis não têm relação clara com os objetivos de aprendizagem declarados.',
        goodImage: 'images/domain-hp2-good.jpg',
        badImage:  'images/domain-hp2-bad.jpg'
      },
      {
        id: 'Hp3',
        name: 'Feedback imediato e visível das ações',
        description: 'Cada ação realizada pelo usuário deve ter uma resposta clara e rápida do ambiente. O usuário precisa entender imediatamente o que aconteceu como resultado de sua ação e se ela foi executada corretamente.',
        goodExample: 'Ao interagir com um objeto, o ambiente responde visualmente em menos de 100ms com uma animação coerente. Ao completar uma tarefa, aparece uma confirmação clara dentro do espaço virtual.',
        badExample:  'O usuário interage com um objeto e nada acontece visivelmente, sem saber se a ação funcionou. O ambiente demora para responder, criando confusão sobre o resultado.',
        goodImage: 'images/domain-hp3-good.jpg',
        badImage:  'images/domain-hp3-bad.jpg'
      },
      {
        id: 'Hp4',
        name: 'Sinalização de objetos interativos e orientação contextual',
        description: 'O usuário deve conseguir identificar facilmente quais objetos pode usar e receber orientações contextuais quando necessário. O ambiente não deve deixar o usuário sem saber o que fazer ou para onde olhar.',
        goodExample: 'Objetos interativos são destacados visualmente (brilho suave ou ícone). Ao se aproximar de um equipamento importante, aparece uma dica curta explicando o que fazer.',
        badExample:  'O usuário não sabe quais objetos são interativos e testa aleatoriamente tudo no ambiente. Não há nenhuma orientação nos momentos críticos da atividade.',
        goodImage: 'images/domain-hp4-good.jpg',
        badImage:  'images/domain-hp4-bad.jpg'
      },
      {
        id: 'Hp5',
        name: 'Fidelidade visual e comportamental ao mundo real',
        description: 'A aparência e o comportamento dos objetos e ferramentas do ambiente devem corresponder ao que o usuário espera encontrar no mundo real. Quando o usuário reconhece algo, deve poder usá-lo da mesma forma que usaria na realidade.',
        goodExample: 'Ferramentas e equipamentos virtuais têm aparência reconhecível e se comportam como seus equivalentes reais. O usuário reconhece os objetos e sabe como usá-los sem instrução adicional.',
        badExample:  'Objetos virtuais têm comportamentos físicos estranhos, como itens que flutuam ou atravessam superfícies sem razão. A aparência não corresponde ao que o usuário esperaria no contexto da tarefa.',
        goodImage: 'images/domain-hp5-good.jpg',
        badImage:  'images/domain-hp5-bad.jpg'
      },
      {
        id: 'Hp6',
        name: 'Engajamento ativo e senso de agência do aluno',
        description: 'O ambiente deve dar ao usuário a sensação de que ele está no controle da sua experiência de aprendizagem. O usuário deve poder fazer escolhas, explorar caminhos diferentes e sentir que suas decisões têm consequências.',
        goodExample: 'O usuário pode escolher entre diferentes abordagens para resolver um problema e recebe retorno sobre as consequências de cada escolha. As atividades estimulam a tomada de decisão autônoma.',
        badExample:  'O ambiente é completamente linear, sem nenhuma oportunidade de escolha ou exploração. O usuário apenas executa instruções passo a passo sem poder tomar decisões próprias.',
        goodImage: 'images/domain-hp6-good.jpg',
        badImage:  'images/domain-hp6-bad.jpg'
      },
      {
        id: 'Hp7',
        name: 'Ajuda contextual integrada ao ambiente',
        description: 'O ambiente deve oferecer orientação e suporte quando o usuário precisar, sem que ele precise sair da experiência imersiva para buscar ajuda externa. A ajuda deve aparecer no momento certo e no lugar certo.',
        goodExample: 'Ao se aproximar de um equipamento complexo, o ambiente exibe discretamente uma dica de como usá-lo. O usuário acessa um painel de ajuda dentro do próprio espaço virtual sem sair da experiência.',
        badExample:  'Para obter ajuda, o usuário precisa remover o headset e consultar um manual externo. O ambiente não oferece nenhum suporte contextual.',
        goodImage: 'images/domain-hp7-good.jpg',
        badImage:  'images/domain-hp7-bad.jpg'
      },
      {
        id: 'Hp8',
        name: 'Clareza dos objetivos de aprendizagem',
        description: 'O usuário deve sempre saber o que precisa aprender ou realizar no ambiente. Os objetivos das atividades devem ser apresentados de forma clara desde o início e o usuário deve conseguir acompanhar seu progresso.',
        goodExample: 'Ao iniciar uma atividade, o ambiente apresenta claramente o que o usuário deve aprender e o que se espera ao final. Indicadores de progresso mostram o quanto o usuário já avançou.',
        badExample:  'O usuário não sabe o que deve aprender durante a atividade. Os objetivos são tão genéricos que não orientam as ações. Não há nenhum indicador de progresso ou de conclusão.',
        goodImage: 'images/domain-hp8-good.jpg',
        badImage:  'images/domain-hp8-bad.jpg'
      },
      {
        id: 'Hp9',
        name: 'Liberdade de movimento e representação corporal natural',
        description: 'A representação do corpo do usuário no ambiente deve responder fielmente aos seus movimentos físicos, sem restrições artificiais que impeçam ações naturais. O usuário deve sentir que seu corpo virtual é uma extensão do seu corpo real.',
        goodExample: 'As mãos virtuais respondem com precisão aos movimentos das mãos reais. O usuário pode se mover e agir no ambiente de forma intuitiva, sem bloqueios artificiais.',
        badExample:  'O avatar apresenta movimentos rígidos ou limitados que não correspondem aos movimentos reais. Restrições artificiais impedem que o usuário realize ações naturais no contexto da tarefa.',
        goodImage: 'images/domain-hp9-good.jpg',
        badImage:  'images/domain-hp9-bad.jpg'
      },
      {
        id: 'Hp10',
        name: 'Correspondência visual e responsividade do ponto de vista',
        description: 'Quando o usuário move a cabeça, o que ele vê no ambiente deve se atualizar imediatamente, sem atraso. A perspectiva visual deve corresponder exatamente à posição e à direção em que o usuário está olhando.',
        goodExample: 'Ao mover a cabeça para os lados, para cima ou para baixo, o ponto de vista se atualiza instantaneamente. A perspectiva visual é sempre coerente com a posição e orientação reais do usuário.',
        badExample:  'A atualização da imagem demora depois que o usuário move a cabeça, causando a sensação de que o ambiente está atrasado. A perspectiva visual não corresponde à direção real em que o usuário está olhando.',
        goodImage: 'images/domain-hp10-good.jpg',
        badImage:  'images/domain-hp10-bad.jpg'
      },
      {
        id: 'Hp11',
        name: 'Prevenção de desconforto físico e bem-estar durante o uso',
        description: 'O ambiente deve ser projetado para que o usuário possa usá-lo sem sentir náusea, tontura ou fadiga visual. Isso inclui evitar movimentos bruscos de câmera, transições abruptas e sessões muito longas sem pausa.',
        goodExample: 'O ambiente usa transições suaves entre cenas e evita movimentos de câmera rápidos. Quando a sessão é longa, o sistema sugere pausas. Técnicas como ponto de referência fixo ajudam a reduzir a cinetose.',
        badExample:  'Transições de cena abruptas e movimentos de câmera bruscos causam desorientação imediata. O ambiente não oferece nenhuma orientação sobre pausas, expondo o usuário a sessões longas sem descanso.',
        goodImage: 'images/domain-hp11-good.jpg',
        badImage:  'images/domain-hp11-bad.jpg'
      },
      {
        id: 'Hp12',
        name: 'Comunicação e colaboração entre participantes',
        description: 'Em ambientes com mais de um participante, o usuário deve poder se comunicar e colaborar de forma clara. As regras de comunicação devem estar bem definidas, incluindo como e quando cada participante pode falar ou agir. (Aplicável apenas a ambientes multiusuário.)',
        goodExample: 'Os participantes têm acesso a canais de comunicação integrados ao ambiente, como voz ou gestos. Há indicações visuais claras de quem está com a palavra.',
        badExample:  'Os usuários não encontram meios claros de se comunicar dentro do ambiente. Não há indicação de quem está falando, gerando confusão e sobreposição de ações.',
        goodImage: 'images/domain-hp12-good.jpg',
        badImage:  'images/domain-hp12-bad.jpg'
      },
      {
        id: 'Hp13',
        name: 'Controles intuitivos e pontos de entrada e saída claros',
        description: 'O usuário deve conseguir navegar pelo ambiente, entrar e sair de atividades de forma intuitiva, sem precisar memorizar comandos. Os controles devem corresponder ao que o usuário já espera com base na sua experiência com outros sistemas.',
        goodExample: 'Os pontos de entrada e saída do ambiente estão claramente sinalizados e acessíveis a qualquer momento. Os controles de navegação seguem convenções reconhecíveis.',
        badExample:  'O usuário não encontra facilmente como sair do ambiente ou voltar a um ponto anterior. Os controles de navegação são arbitrários e exigem memorização de comandos não intuitivos.',
        goodImage: 'images/domain-hp13-good.jpg',
        badImage:  'images/domain-hp13-bad.jpg'
      },
      {
        id: 'Hp14',
        name: 'Visibilidade contínua do estado do sistema',
        description: 'O usuário deve sempre saber o que está acontecendo no ambiente: se o sistema está processando algo, quais objetos pode usar e qual é o estado atual das suas atividades. O ambiente não deve deixar o usuário sem informação.',
        goodExample: 'Quando o sistema está processando, aparece um indicador visual discreto. Os objetos interativos estão claramente diferenciados dos elementos decorativos por sinalizações visuais consistentes.',
        badExample:  'Após realizar uma ação que leva alguns segundos, o ambiente não mostra nenhum sinal de que algo está acontecendo. O usuário não consegue distinguir quais objetos são interativos.',
        goodImage: 'images/domain-hp14-good.jpg',
        badImage:  'images/domain-hp14-bad.jpg'
      },
      {
        id: 'Hp15',
        name: 'Orientação espacial e retorno a posições conhecidas',
        description: 'O usuário deve sempre saber onde está no ambiente virtual e ter meios de retornar a um ponto de referência conhecido. Em ambientes grandes ou complexos, é fácil perder a orientação espacial.',
        goodExample: 'O ambiente dispõe de algum recurso de orientação espacial, como um minimapa discreto ou marcos visuais reconhecíveis. Existe um mecanismo simples para retornar ao ponto de início.',
        badExample:  'Após explorar algumas áreas, o usuário perde completamente a orientação e não encontra nenhum meio de se localizar ou retornar a um ponto conhecido.',
        goodImage: 'images/domain-hp15-good.jpg',
        badImage:  'images/domain-hp15-bad.jpg'
      },
      {
        id: 'Hp16',
        name: 'Consistência de comportamentos e padrões no ambiente',
        description: 'Quando o ambiente usa comportamentos que diferem do mundo real, isso deve ser aplicado de forma consistente em todo o espaço e comunicado ao usuário. O usuário não deve ser surpreendido por comportamentos inconsistentes.',
        goodExample: 'O ambiente usa teletransporte para navegação. Esse mecanismo é apresentado ao usuário no início e funciona exatamente da mesma forma em todos os espaços do ambiente.',
        badExample:  'O ambiente alterna entre diferentes modos de navegação sem aviso. Objetos similares se comportam de formas diferentes em partes distintas do ambiente sem nenhuma justificativa.',
        goodImage: 'images/domain-hp16-good.jpg',
        badImage:  'images/domain-hp16-bad.jpg'
      },
      {
        id: 'Hp17',
        name: 'Uso intencional de elementos audiovisuais',
        description: 'Sons, imagens e vídeos devem ser usados de forma deliberada para apoiar o aprendizado e a imersão, não como decoração. Elementos audiovisuais desnecessários distraem o usuário e podem prejudicar a experiência.',
        goodExample: 'O áudio espacial é usado para orientar o usuário em direção a elementos relevantes da atividade. Os elementos visuais têm qualidade suficiente para representar adequadamente os objetos e procedimentos.',
        badExample:  'Sons aleatórios e animações desnecessárias distraem o usuário das tarefas pedagógicas. A qualidade visual dos objetos é tão baixa que o usuário não consegue reconhecê-los no contexto da tarefa.',
        goodImage: 'images/domain-hp17-good.jpg',
        badImage:  'images/domain-hp17-bad.jpg'
      },
      {
        id: 'Hp18',
        name: 'Prevenção de erros e recuperação sem reiniciar',
        description: 'Em um ambiente imersivo, cometer erros é parte natural do aprendizado. O sistema deve permitir que o usuário desfaça ações ou retome a atividade a partir de onde errou, sem precisar recomeçar tudo do início.',
        goodExample: 'O usuário pode desfazer a última ação com um gesto simples. Quando erra em uma etapa de um procedimento, pode retomar a partir daquele passo sem reiniciar toda a atividade.',
        badExample:  'Um único erro em uma sequência de procedimentos força o usuário a reiniciar tudo desde o início, perdendo todo o progresso anterior. O ambiente não oferece nenhum mecanismo de desfazer ações.',
        goodImage: 'images/domain-hp18-good.jpg',
        badImage:  'images/domain-hp18-bad.jpg'
      },
      {
        id: 'Hp19',
        name: 'Redução da carga cognitiva e visibilidade das ações',
        description: 'O ambiente deve evitar sobrecarregar a memória do usuário. Informações e opções necessárias devem estar visíveis e acessíveis no próprio ambiente, sem exigir que o usuário memorize procedimentos ou regras complexas.',
        goodExample: 'As instruções e os passos necessários para uma tarefa estão disponíveis dentro do próprio ambiente, sem que o usuário precise memorizá-los. Os objetos interativos estão organizados de forma lógica.',
        badExample:  'O usuário precisa memorizar longas sequências de passos antes de começar, porque o ambiente não fornece nenhuma referência durante a execução. Os objetos estão espalhados de forma aleatória.',
        goodImage: 'images/domain-hp19-good.jpg',
        badImage:  'images/domain-hp19-bad.jpg'
      },
      {
        id: 'Hp20',
        name: 'Prática repetitiva e progressão baseada em desempenho',
        description: 'O ambiente deve permitir que o usuário pratique as habilidades mais de uma vez e acompanhe sua evolução por meio de resultados mensuráveis. A progressão para etapas mais avançadas deve ser baseada no desempenho demonstrado.',
        goodExample: 'O ambiente estrutura as atividades em ciclos de prática com feedback quantitativo ao final de cada ciclo. O usuário só avança para a próxima etapa após demonstrar um nível mínimo de desempenho.',
        badExample:  'As atividades são realizadas uma única vez sem oportunidade de prática repetida. O desempenho do usuário não é mensurado e nenhum retorno quantitativo é fornecido sobre sua evolução.',
        goodImage: 'images/domain-hp20-good.jpg',
        badImage:  'images/domain-hp20-bad.jpg'
      },
      {
        id: 'Hp21',
        name: 'Adaptação a diferentes perfis e níveis de experiência',
        description: 'O ambiente deve funcionar bem tanto para usuários que nunca usaram realidade virtual quanto para usuários experientes. Iniciantes precisam de mais orientação, enquanto usuários avançados devem poder explorar com mais autonomia.',
        goodExample: 'O ambiente oferece um modo guiado para iniciantes, com instruções passo a passo, e um modo avançado para usuários experientes, com maior liberdade de exploração.',
        badExample:  'O ambiente apresenta o mesmo nível de dificuldade e a mesma quantidade de orientação para todos os usuários. Iniciantes ficam perdidos sem orientação suficiente, enquanto experientes se entediam com excesso de instrução.',
        goodImage: 'images/domain-hp21-good.jpg',
        badImage:  'images/domain-hp21-bad.jpg'
      },
    ]
  },

  // ADICIONE MAIS CONJUNTOS AQUI:
  // example: {
  //   name: "Nome do Conjunto",
  //   heuristics: [
  //     { id: 'X1', name: '...', description: '...', goodExample: '...', badExample: '...',
  //       goodImage: 'images/example-x1-good.jpg', badImage:  'images/example-x1-bad.jpg' },
  //   ]
  // }
};
