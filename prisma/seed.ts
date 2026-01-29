/**
 * Seed de perguntas e catálogo de IAs para IA ou Não?
 * - 16 questões para o jogo
 * - Categorias e ferramentas de IA para o catálogo
 */

import { PrismaClient, QuestionType, PricingType } from '@prisma/client';

const prisma = new PrismaClient();

interface QuestionData {
  type: QuestionType;
  prompt: string;
  imageUrl?: string;
  options: string[];
  correctOption: number;
  explanation: string;
}

const questions: QuestionData[] = [
  // ============================================
  // IMAGE_CLASSIFY (8 questões: 4 IA, 4 Humanas)
  // ============================================
  {
    type: 'IMAGE_CLASSIFY',
    prompt: 'Esta paisagem foi criada por IA ou por um artista humano?',
    imageUrl: '/images/img_01_ia_paisagem.jpg',
    options: ['Feita por IA', 'Feita por Humano'],
    correctOption: 0,
    explanation: 'Esta imagem foi gerada por Midjourney. Note a perfeição "surreal" e alguns detalhes de textura que parecem artificiais ao ampliar.',
  },
  {
    type: 'IMAGE_CLASSIFY',
    prompt: 'Este retrato fotográfico é real ou gerado por IA?',
    imageUrl: '/images/img_02_ia_retrato.jpg',
    options: ['Gerado por IA', 'Foto Real de Humano'],
    correctOption: 0,
    explanation: 'Este retrato foi criado com StyleGAN. Pistas: assimetrias sutis nos brincos, fundo desfocado de forma não natural e textura de pele muito lisa.',
  },
  {
    type: 'IMAGE_CLASSIFY',
    prompt: 'Esta obra de arte abstrata foi pintada por humano ou gerada por IA?',
    imageUrl: '/images/img_03_humano_abstrato.jpg',
    options: ['Gerada por IA', 'Pintada por Humano'],
    correctOption: 1,
    explanation: 'Esta é uma obra de Kandinsky. Arte abstrata histórica anterior à era da IA gerativa tem padrões e intenções artísticas documentadas.',
  },
  {
    type: 'IMAGE_CLASSIFY',
    prompt: 'Esta foto de natureza é real ou criada por IA?',
    imageUrl: '/images/img_04_humano_natureza.jpg',
    options: ['Criada por IA', 'Foto Real'],
    correctOption: 1,
    explanation: 'Foto real de um fotógrafo profissional. Note os detalhes naturais como imperfeições nas folhas e iluminação ambiente realista.',
  },
  {
    type: 'IMAGE_CLASSIFY',
    prompt: 'Este gato fofo é uma foto real ou imagem de IA?',
    imageUrl: '/images/img_05_ia_gato.jpg',
    options: ['Imagem de IA', 'Foto Real'],
    correctOption: 0,
    explanation: 'Imagem gerada por DALL-E 3. Observe os olhos: têm um brilho "perfeito demais" e o pelo tem textura uniforme artificial.',
  },
  {
    type: 'IMAGE_CLASSIFY',
    prompt: 'Este prato de comida é foto real ou gerado por IA?',
    imageUrl: '/images/img_06_humano_comida.jpg',
    options: ['Gerado por IA', 'Foto Real'],
    correctOption: 1,
    explanation: 'Foto real de food photography. Comida real tem imperfeições naturais, reflexos de gordura autênticos e disposição orgânica.',
  },
  {
    type: 'IMAGE_CLASSIFY',
    prompt: 'Esta ilustração de cidade futurista é arte humana ou IA?',
    imageUrl: '/images/img_07_ia_cidade.jpg',
    options: ['Gerada por IA', 'Arte de Humano'],
    correctOption: 0,
    explanation: 'Criada com Stable Diffusion. Cidades de IA frequentemente têm perspectivas inconsistentes e detalhes arquitetônicos que não fazem sentido estrutural.',
  },
  {
    type: 'IMAGE_CLASSIFY',
    prompt: 'Este desenho a lápis é feito por humano ou IA?',
    imageUrl: '/images/img_08_humano_desenho.jpg',
    options: ['Feito por IA', 'Feito por Humano'],
    correctOption: 1,
    explanation: 'Desenho manual tradicional. Note as variações naturais na pressão do lápis, borrados intencionais e textura do papel visível.',
  },

  // ============================================
  // TEXT_CLASSIFY (4 questões: 2 IA, 2 Humanas)
  // ============================================
  {
    type: 'TEXT_CLASSIFY',
    prompt: 'Este parágrafo foi escrito por IA ou por humano?\n\n"A implementação de inteligência artificial no contexto educacional apresenta tanto oportunidades quanto desafios significativos. É fundamental considerar aspectos éticos, pedagógicos e tecnológicos ao integrar essas ferramentas no ambiente de aprendizagem, garantindo que complementem e não substituam a interação humana essencial."',
    options: ['Escrito por IA', 'Escrito por Humano'],
    correctOption: 0,
    explanation: 'Texto gerado por ChatGPT. Características: estrutura muito equilibrada, uso de palavras como "fundamental", "significativos", tom neutro e genérico sem opinião pessoal forte.',
  },
  {
    type: 'TEXT_CLASSIFY',
    prompt: 'Este trecho foi escrito por IA ou por humano?\n\n"Olha, eu tentei usar o ChatGPT pra preparar aula e no começo achei incrível. Mas aí percebi que os exemplos que ele dava eram meio... sem graça? Tipo, corretos mas sem aquele tempero que a gente coloca quando conhece a turma. Acabei usando só pra ter ideias iniciais."',
    options: ['Escrito por IA', 'Escrito por Humano'],
    correctOption: 1,
    explanation: 'Texto humano. Características: linguagem informal, expressões coloquiais ("tipo", "sem graça"), hesitações naturais, opinião pessoal e experiência específica.',
  },
  {
    type: 'TEXT_CLASSIFY',
    prompt: 'Este e-mail foi escrito por IA ou por humano?\n\n"Prezado(a) Professor(a),\n\nEspero que esta mensagem o(a) encontre bem. Gostaria de solicitar uma reunião para discutir o progresso acadêmico do meu filho. Estou disponível na próxima semana, preferencialmente no período da tarde. Agradeço antecipadamente sua atenção e aguardo seu retorno.\n\nAtenciosamente,"',
    options: ['Escrito por IA', 'Escrito por Humano'],
    correctOption: 0,
    explanation: 'E-mail gerado por IA. Características: formalidade excessiva e uniforme, uso de "(a)" para neutralidade, frases prontas como "encontre bem" e "agradeço antecipadamente".',
  },
  {
    type: 'TEXT_CLASSIFY',
    prompt: 'Esta mensagem foi escrita por IA ou por humano?\n\n"Prof, desculpa mandar tarde mas amanhã não vou poder ir. Minha avó tá no hospital e preciso ficar com ela. Posso entregar o trabalho quinta? Já tá quase pronto, só falta revisar. Obrigada pela compreensão!"',
    options: ['Escrito por IA', 'Escrito por Humano'],
    correctOption: 1,
    explanation: 'Texto humano autêntico. Características: contexto pessoal específico, urgência real, informalidade natural, pedido direto e emoção genuína.',
  },

  // ============================================
  // HALLUCINATION_DETECT (2 questões)
  // ============================================
  {
    type: 'HALLUCINATION_DETECT',
    prompt: 'A IA respondeu: "O Brasil foi descoberto por Pedro Álvares Cabral em 22 de abril de 1500, quando sua frota de 13 navios, a caminho das Índias, avistou o Monte Pascoal. A expedição era composta por cerca de 1.500 homens."\n\nEsta resposta contém erro ou alucinação factual?',
    options: ['Não, está correto', 'Sim, tem erro', 'Preciso verificar'],
    correctOption: 0,
    explanation: 'A informação está correta! A frota tinha 13 navios, cerca de 1.500 homens, e o Monte Pascoal foi avistado em 22 de abril de 1500. Sempre bom verificar, mas neste caso a IA acertou.',
  },
  {
    type: 'HALLUCINATION_DETECT',
    prompt: 'A IA respondeu: "Machado de Assis nasceu no Rio de Janeiro em 1839 e é considerado o maior escritor brasileiro. Entre suas obras mais famosas estão \'Dom Casmurro\', \'Memórias Póstumas de Brás Cubas\' e \'O Cortiço\'."\n\nEsta resposta contém erro ou alucinação factual?',
    options: ['Não, está correto', 'Sim, tem erro', 'Preciso verificar'],
    correctOption: 1,
    explanation: 'ERRO! "O Cortiço" foi escrito por Aluísio Azevedo, não por Machado de Assis. Este é um exemplo clássico de "alucinação" onde a IA mistura informações de diferentes autores.',
  },

  // ============================================
  // LGPD_TRAFFIC_LIGHT (2 questões)
  // ============================================
  {
    type: 'LGPD_TRAFFIC_LIGHT',
    prompt: 'Situação: Um professor quer usar o ChatGPT para corrigir redações dos alunos do 8º ano, copiando e colando o texto completo com o nome do aluno no prompt.\n\nIsso é permitido segundo a LGPD?',
    options: ['🟢 Pode fazer', '🟡 Depende', '🔴 Não pode'],
    correctOption: 2,
    explanation: 'NÃO PODE! Enviar dados pessoais de menores (nome + texto que pode conter informações pessoais) para serviços de IA externos viola a LGPD. Alternativa: remover identificação ou usar ferramentas aprovadas pela escola.',
  },
  {
    type: 'LGPD_TRAFFIC_LIGHT',
    prompt: 'Situação: A coordenação quer usar uma IA para analisar o desempenho geral da turma, enviando apenas dados agregados e anônimos (média de notas, porcentagem de aprovação).\n\nIsso é permitido segundo a LGPD?',
    options: ['🟢 Pode fazer', '🟡 Depende', '🔴 Não pode'],
    correctOption: 0,
    explanation: 'PODE! Dados agregados e anonimizados não identificam indivíduos e portanto não são considerados dados pessoais pela LGPD. Esta é uma prática segura.',
  },
];

async function main() {
  console.log('🌱 Iniciando seed de perguntas...');

  // Limpar perguntas existentes
  await prisma.question.deleteMany();

  // Inserir novas perguntas
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    await prisma.question.create({
      data: {
        type: q.type,
        prompt: q.prompt,
        imageUrl: q.imageUrl || null,
        optionsJson: q.options,
        correctOption: q.correctOption,
        explanation: q.explanation,
        orderIndex: i,
        isActive: true,
      },
    });
    console.log(`  ✅ Pergunta ${i + 1}/${questions.length}: ${q.type}`);
  }

  console.log(`\n🎉 Seed concluído! ${questions.length} perguntas inseridas.`);

  // ==================== CATÁLOGO DE IAs ====================
  console.log('\n🤖 Iniciando seed do catálogo de IAs...');

  // Limpar dados existentes
  await prisma.aiTool.deleteMany();
  await prisma.aiCategory.deleteMany();

  // Criar categorias
  const categories = [
    {
      name: 'Chat e Texto',
      slug: 'chat-texto',
      icon: '💬',
      description: 'Assistentes de IA para conversação, escrita, resumos e análise de textos.',
      orderIndex: 1,
    },
    {
      name: 'Geração de Imagens',
      slug: 'imagens',
      icon: '🎨',
      description: 'Ferramentas para criar, editar e transformar imagens usando IA.',
      orderIndex: 2,
    },
    {
      name: 'Vídeo e Áudio',
      slug: 'video-audio',
      icon: '🎬',
      description: 'Criação e edição de vídeos, áudios e dublagens com inteligência artificial.',
      orderIndex: 3,
    },
    {
      name: 'Educação',
      slug: 'educacao',
      icon: '📚',
      description: 'IAs especializadas para professores, planos de aula e material didático.',
      orderIndex: 4,
    },
    {
      name: 'Pesquisa',
      slug: 'pesquisa',
      icon: '🔍',
      description: 'Ferramentas de busca e pesquisa potencializadas por IA.',
      orderIndex: 5,
    },
    {
      name: 'Produtividade',
      slug: 'produtividade',
      icon: '⚡',
      description: 'Automatização de tarefas, organização e aumento de produtividade.',
      orderIndex: 6,
    },
  ];

  const createdCategories: Record<string, string> = {};
  
  for (const cat of categories) {
    const created = await prisma.aiCategory.create({ data: cat });
    createdCategories[cat.slug] = created.id;
    console.log(`  📁 Categoria: ${cat.icon} ${cat.name}`);
  }

  // Criar ferramentas de IA
  const tools = [
    // ===== CHAT E TEXTO =====
    {
      name: 'ChatGPT',
      slug: 'chatgpt',
      description: 'O ChatGPT (OpenAI) segue líder de mercado com os modelos da série o1 (focados em raciocínio) e GPT-4o (multimodal). O recurso "Canvas" transformou a colaboração em escrita e programação, e a busca integrada (SearchGPT) oferece respostas em tempo real.',
      shortDesc: 'Assistente versátil com modelos de raciocínio (o1/o3) e multimodais.',
      url: 'https://chat.openai.com',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
      categorySlug: 'chat-texto',
      pricingType: 'FREEMIUM' as PricingType,
      pricingDetails: 'Grátis (GPT-4o mini) / Plus $20/mês (o1/o3)',
      features: ['Raciocínio (o1/o3)', 'Interface Canvas', 'Busca na Web', 'Modo de Voz Avançado', 'Análise de Dados'],
      pros: ['Melhor raciocínio lógico (o1)', 'Interface muito polida', 'Ecossistema vasto (GPTs)'],
      cons: ['Limites de mensagens no Plus', 'Filtros de conteúdo rígidos'],
      useCases: ['Programação complexa', 'Planejamento de aulas', 'Escrita criativa', 'Análise de dados'],
      isFeatured: true,
      orderIndex: 1,
    },
    {
      name: 'Claude',
      slug: 'claude',
      description: 'A família Claude 3.5 (Sonnet, Haiku, Opus) da Anthropic é referência em naturalidade e programação. O recurso "Artifacts" permite visualizar aplicativos e documentos interativos, e o "Computer Use" permite que a IA opere o computador.',
      shortDesc: 'IA focada em codificação, segurança e textos longos.',
      url: 'https://claude.ai',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Claude_AI_logo.svg',
      categorySlug: 'chat-texto',
      pricingType: 'FREEMIUM' as PricingType,
      pricingDetails: 'Grátis (3.5 Sonnet lim.) / Pro $20/mês',
      features: ['Artifacts (Visualização)', 'Computer Use', 'Contexto de 200k+', 'Projetos (Memória)'],
      pros: ['Melhor para programação', 'Texto extremamente natural', 'Menos recusas injustificadas'],
      cons: ['Sem geração de imagem nativa', 'Limites diários no plano grátis'],
      useCases: ['Desenvolvimento de software', 'Análise de documentos grandes', 'Escrita humanizada'],
      isFeatured: true,
      orderIndex: 2,
    },
    {
      name: 'DeepSeek',
      slug: 'deepseek',
      description: 'A DeepSeek chocou o mercado com o modelo R1, oferecendo raciocínio de nível avançado (comparável ao o1) com eficiência extrema e código aberto. É conhecida pelo custo de API acessível e forte desempenho em lógica.',
      shortDesc: 'IA Open Source poderosa focada em raciocínio e código.',
      url: 'https://chat.deepseek.com',
      logoUrl: 'https://avatars.githubusercontent.com/u/146604683?s=200&v=4',
      categorySlug: 'chat-texto',
      pricingType: 'FREEMIUM' as PricingType,
      pricingDetails: 'Grátis / API ultra barata',
      features: ['Modelo R1 (Reasoning)', 'Open Weights', 'DeepThink', 'Contexto de 128k'],
      pros: ['Custo-benefício imbatível', 'Desempenho de ponta em lógica', 'Modelo Aberto'],
      cons: ['Servidores instáveis em pico', 'Questões de privacidade (China)'],
      useCases: ['Programação backend', 'Matemática', 'Uso via API'],
      isFeatured: true,
      orderIndex: 3,
    },
    {
      name: 'Google Gemini',
      slug: 'gemini',
      description: 'O Gemini 2.0 trouxe avanços em multimodalidade nativa e latência. Integrado ao Google Workspace, o modelo 1.5 Pro oferece uma janela de contexto massiva de 2 milhões de tokens para analisar grandes volumes de dados.',
      shortDesc: 'IA do Google com integração Workspace e janela de contexto gigante.',
      url: 'https://gemini.google.com',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg',
      categorySlug: 'chat-texto',
      pricingType: 'FREEMIUM' as PricingType,
      pricingDetails: 'Grátis (Flash) / Advanced $20/mês (Pro 2.0)',
      features: ['Contexto de 2M tokens', 'Integração Drive/Docs', 'Gems (Personalização)', 'Multimodal Nativo'],
      pros: ['Integração com Google', 'Maior contexto do mercado', 'Modelo Flash rápido e capaz'],
      cons: ['Histórico de inconsistências', 'Interface pode ser confusa'],
      useCases: ['Analisar múltiplos livros/PDFs', 'Resumir vídeos do YouTube', 'Produtividade no Docs'],
      isFeatured: false,
      orderIndex: 4,
    },

    // ===== GERAÇÃO DE IMAGENS =====
    {
      name: 'Midjourney',
      slug: 'midjourney',
      description: 'Na versão 6.1 (e v7 em testes), Midjourney continua sendo a referência em estética visual e fidelidade fotográfica. O novo editor web facilitou o acesso, removendo a obrigatoriedade do Discord.',
      shortDesc: 'Gerador de imagens com melhor estética e fidelidade.',
      url: 'https://midjourney.com',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Midjourney_Emblem.png',
      categorySlug: 'imagens',
      pricingType: 'PAID' as PricingType,
      pricingDetails: 'A partir de $10/mês',
      features: ['Personalização de Estilo', 'Editor Web', 'Consistência de Personagem', 'Inpainting/Outpainting'],
      pros: ['Melhor qualidade artística', 'Controle detalhado de estilo', 'Editor Web robusto'],
      cons: ['Apenas pago', 'Ainda complexo para iniciantes'],
      useCases: ['Fotografia publicitária', 'Arte conceitual', 'Design gráfico'],
      isFeatured: true,
      orderIndex: 1,
    },
    {
      name: 'Flux.1',
      slug: 'flux',
      description: 'Desenvolvido pela Black Forest Labs, o Flux.1 tornou-se o novo padrão open-weight de qualidade. Destaca-se pelo fotorrealismo impressionante e capacidade inigualável de renderizar textos dentro das imagens.',
      shortDesc: 'IA famosa pelo fotorrealismo e escrita correta em imagens.',
      url: 'https://blackforestlabs.ai',
      logoUrl: 'https://replicate.delivery/pbxt/L7j4xJj4xJj4xJj4xJj4xJj4xJj4xJj4xJj4xJj4xJj4xJj4/flux-logo.png', // Placeholder
      categorySlug: 'imagens',
      pricingType: 'FREEMIUM' as PricingType,
      pricingDetails: 'Grátis (em parceiros) / Pro via API',
      features: ['Texto perfeito em imagens', 'Fotorrealismo extremo', 'Variantes Pro/Dev/Schnell', 'LoRAs comunitários'],
      pros: ['Melhor renderização de texto', 'Disponível localmente/nuvem', 'Qualidade de pele realista'],
      cons: ['Requer hardware forte (local)', 'Menos estilizado que MJ'],
      useCases: ['Posts com texto', 'Pessoas realistas', 'Material didático'],
      isFeatured: true,
      orderIndex: 2,
    },
    {
      name: 'DALL-E 3',
      slug: 'dall-e',
      description: 'Integrado ao ChatGPT, o DALL-E 3 continua sendo a opção mais fácil para iniciantes, "entendendo" prompts conversacionais melhor que qualquer outro, embora tenha perdido a coroa de realismo.',
      shortDesc: 'Gerador de imagens fácil de usar integrado ao ChatGPT.',
      url: 'https://openai.com/dall-e-3',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
      categorySlug: 'imagens',
      pricingType: 'PAID' as PricingType,
      pricingDetails: 'Via ChatGPT Plus ($20/mês)',
      features: ['Converte conversa em prompt', 'Edição via chat', 'Segurança robusta', 'Simplicidade'],
      pros: ['Entende linguagem natural perfeitamente', 'Muito fácil de usar', 'Iteração via chat'],
      cons: ['Qualidade de "boneco de cera"', 'Textos falhos'],
      useCases: ['Ilustrações rápidas', 'Explicação visual de conceitos', 'Brainstorming'],
      isFeatured: false,
      orderIndex: 3,
    },
    {
      name: 'Canva (Magic Studio)',
      slug: 'canva',
      description: 'O Canva integrou os melhores modelos (incluindo tecnologia do Leonardo.ai) em sua suíte. Permite gerar imagens, vetores e vídeos diretamente nos slides, ideal para professores.',
      shortDesc: 'IA de design integrada para criar apresentações e posts.',
      url: 'https://canva.com',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg',
      categorySlug: 'imagens',
      pricingType: 'FREEMIUM' as PricingType,
      pricingDetails: 'Grátis limitado / Pro $13/mês',
      features: ['Magic Edit', 'Remoção de Fundo', 'Expansão Mágica', 'Geração de Vídeo'],
      pros: ['Fluxo de trabalho completo', 'Ferramentas de edição integradas', 'Fácil para docentes'],
      cons: ['Menos controle que ferramentas dedicadas', 'Geração pode ser genérica'],
      useCases: ['Slides de aula', 'Folhas de atividade', 'Comunicados visuais'],
      isFeatured: false,
      orderIndex: 4,
    },

    // ===== VÍDEO E ÁUDIO =====
    {
      name: 'Sora',
      slug: 'sora',
      description: 'O Sora da OpenAI simula o mundo físico em movimento. Gera vídeos de até 1 minuto com consistência de personagens e física complexa a partir de texto.',
      shortDesc: 'Simulador de mundo e gerador de vídeo ultrarrealista.',
      url: 'https://openai.com/sora',
      logoUrl: 'https://openai.com/favicon.ico',
      categorySlug: 'video-audio',
      pricingType: 'PAID' as PricingType,
      pricingDetails: 'Grátis limitado (Red Team) / Pro',
      features: ['Física realista', 'Consistência temporal', 'Até 1 minuto', 'Alta resolução'],
      pros: ['Realismo inigualável', 'Entendimento físico', 'Movimentos complexos'],
      cons: ['Acesso restrito/caro', 'Tempo de geração alto'],
      useCases: ['Visualização científica', 'Storytelling', 'Simulações históricas'],
      isFeatured: true,
      orderIndex: 1,
    },
    {
      name: 'Runway Gen-3',
      slug: 'runway',
      description: 'Runway Gen-3 Alpha trouxe controle preciso sobre movimentos e fotorrealismo para vídeos. Ferramentas como "Motion Brush" dão controle total ao criador.',
      shortDesc: 'Ferramenta profissional para geração e edição de vídeo com IA.',
      url: 'https://runway.ml',
      logoUrl: 'https://runway.ml/favicon.ico',
      categorySlug: 'video-audio',
      pricingType: 'FREEMIUM' as PricingType,
      pricingDetails: 'Créditos grátis / Pro $15/mês',
      features: ['Gen-3 Alpha', 'Motion Brush', 'Lip Sync', 'Video-to-Video'],
      pros: ['Controle criativo granular', 'Ferramentas de edição profissional', 'Comunidade ativa'],
      cons: ['Custo alto de créditos', 'Curva de aprendizado'],
      useCases: ['Produção de vídeo', 'Efeitos visuais', 'Animação de imagens estáticas'],
      isFeatured: true,
      orderIndex: 2,
    },
    {
      name: 'Suno AI',
      slug: 'suno',
      description: 'A Suno v4 cria músicas completas (letra, voz e instrumental) com qualidade de rádio. Permite criar qualquer estilo musical a partir de um texto simples.',
      shortDesc: 'Criação de músicas completas e realistas com IA.',
      url: 'https://suno.com',
      logoUrl: 'https://suno.com/favicon.ico',
      categorySlug: 'video-audio',
      pricingType: 'FREEMIUM' as PricingType,
      pricingDetails: '50 créditos diários grátis / Pro $10/mês',
      features: ['Músicas de 4 min', 'Letras automáticas', 'Vozes realistas', 'Extensão de faixas'],
      pros: ['Impressionantemente musical', 'Muito divertido', 'Ótimo plano grátis'],
      cons: ['Direitos autorais complexos', 'Às vezes vozes metálicas'],
      useCases: ['Músicas educativas', 'Projetos criativos', 'Jingles'],
      isFeatured: false,
      orderIndex: 3,
    },
    {
      name: 'ElevenLabs',
      slug: 'elevenlabs',
      description: 'Líder absoluta em síntese de voz (TTS). Seus novos modelos "Turbo" e recursos de dublagem automática e efeitos sonoros tornam-na indispensável para áudio.',
      shortDesc: 'Vozes sintéticas indistinguíveis de humanos.',
      url: 'https://elevenlabs.io',
      logoUrl: 'https://elevenlabs.io/favicon.ico',
      categorySlug: 'video-audio',
      pricingType: 'FREEMIUM' as PricingType,
      pricingDetails: '10k caracteres grátis / Starter $5/mês',
      features: ['Clonagem de Voz', 'Dublagem (Dubbing Studio)', 'Efeitos Sonoros', 'Speech-to-Speech'],
      pros: ['Melhor qualidade de voz', 'Dublagem automática de vídeos', 'Muitas línguas'],
      cons: ['Planos caros para uso intenso', 'Clonagem requer assinatura'],
      useCases: ['Narrar aulas/vídeos', 'Acessibilidade', 'Tradução de conteúdo'],
      isFeatured: false,
      orderIndex: 4,
    },

    // ===== EDUCAÇÃO =====
    {
      name: 'Teachy',
      slug: 'teachy',
      description: 'Plataforma brasileira que usa IA para otimizar o tempo do professor. Cria planos de aula, avaliações e materiais didáticos 100% alinhados à BNCC, agora com IA mais rápida.',
      shortDesc: 'IA brasileira completa para professores (BNCC).',
      url: 'https://teachy.com.br',
      logoUrl: 'https://teachy.com.br/favicon.ico',
      categorySlug: 'educacao',
      pricingType: 'FREEMIUM' as PricingType,
      pricingDetails: 'Grátis limitado / Pro R$29/mês',
      features: ['Planos BNCC', 'Banco de Questões', 'Correção de Redação', 'Youtube para Aula'],
      pros: ['Foco total no Brasil/BNCC', 'Interface amigável', 'Suporte local'],
      cons: ['Alguns recursos só no Pro', 'Focado apenas em K-12'],
      useCases: ['Planejamento semanal', 'Criar provas', 'Atividades diferenciadas'],
      isFeatured: true,
      orderIndex: 1,
    },
    {
      name: 'MagicSchool',
      slug: 'magicschool',
      description: 'Uma suíte completa com mais de 80 ferramentas para professores. Inclui assistente de IEP, gerador de feedback, chatbot educacional "Raina" e funcionalidades para alunos.',
      shortDesc: 'A "caixa de ferramentas" definitiva para educadores.',
      url: 'https://magicschool.ai',
      logoUrl: 'https://magicschool.ai/favicon.ico',
      categorySlug: 'educacao',
      pricingType: 'FREEMIUM' as PricingType,
      pricingDetails: 'Grátis robusto / Plus $12/mês',
      features: ['MagicStudent (para alunos)', '80+ Ferramentas', 'Exportação Google/Microsoft', 'Detector de IA (básico)'],
      pros: ['Muitas ferramentas específicas', 'Seguro para alunos', 'Parcerias oficiais'],
      cons: ['Interface densa', 'Foco nos EUA (currículo)'],
      useCases: ['Diferenciação de ensino', 'Comunicação com pais', 'Atividades interativas'],
      isFeatured: true,
      orderIndex: 2,
    },
    {
      name: 'Khanmigo',
      slug: 'khanmigo',
      description: 'O tutor socrático da Khan Academy. Não dá a resposta, mas guia o aluno pelo raciocínio. Agora gratuito para professores nos EUA e expandindo acesso.',
      shortDesc: 'Tutor de IA socrático da Khan Academy.',
      url: 'https://www.khanacademy.org/khan-labs',
      logoUrl: 'https://cdn.kastatic.org/images/khan-logo-dark-background-2.png',
      categorySlug: 'educacao',
      pricingType: 'FREEMIUM' as PricingType,
      pricingDetails: 'Grátis para professores (EUA/BR select) / Pago alunos',
      features: ['Tutoria Socrática', 'Planejamento de aula', 'Modo de escrita co-autorada', 'Integração Khan Academy'],
      pros: ['Pedagogicamente seguro', 'Fomenta pensamento crítico', 'Marca confiável'],
      cons: ['Acesso ainda limitado', 'Pode ser lento na interação'],
      useCases: ['Reforço escolar', 'Ajuda no dever de casa', 'Planejamento pedagógico'],
      isFeatured: false,
      orderIndex: 3,
    },
    {
      name: 'NotebookLM',
      slug: 'notebooklm',
      description: 'Ferramenta do Google que transforma seus documentos em podcasts e guias de estudo. O recurso "Audio Overview" viralizou por criar discussões de áudio realistas sobre qualquer conteúdo.',
      shortDesc: 'Transforma documentos em podcasts e guias de estudo.',
      url: 'https://notebooklm.google.com',
      logoUrl: 'https://notebooklm.google.com/favicon.ico',
      categorySlug: 'educacao',
      pricingType: 'FREEMIUM' as PricingType,
      pricingDetails: 'Grátis',
      features: ['Audio Overview (Podcast)', 'Citações Estritas', 'Resumos', 'Perguntas Sugeridas'],
      pros: ['Incrível para revisar matéria', 'Podcast automático viral', 'Baseado apenas nas suas fontes'],
      cons: ['Ainda experimental', 'Recursos limitados de edição de texto'],
      useCases: ['Estudar para provas', 'Criar podcasts de conteúdo', 'Revisão de literatura'],
      isFeatured: true, // Worth featuring due to hype
      orderIndex: 4,
    },

    // ===== PESQUISA =====
    {
      name: 'Perplexity',
      slug: 'perplexity',
      description: 'O substituto do Google Search. Combina modelos de ponta (GPT-4o, Claude 3.5, Sonar) com busca web em tempo real para entregar respostas diretas e citadas. O "Deep Research" aprofunda em tópicos complexos.',
      shortDesc: 'Motor de resposta que substitui o Google.',
      url: 'https://perplexity.ai',
      logoUrl: 'https://perplexity.ai/favicon.ico',
      categorySlug: 'pesquisa',
      pricingType: 'FREEMIUM' as PricingType,
      pricingDetails: 'Grátis / Pro $20/mês',
      features: ['Deep Research', 'Citação de Fontes', 'Modo Focado (Acadêmico/YouTube)', 'Pages'],
      pros: ['Respostas prontas e citadas', 'Menos anúncios', 'Acesso a múltiplos modelos'],
      cons: ['Pode alucinar fontes (raro)', 'Limites no modo Pro'],
      useCases: ['Pesquisa rápida', 'Verificar fatos', 'Entender tópicos complexos'],
      isFeatured: true,
      orderIndex: 1,
    },
    {
      name: 'Consensus',
      slug: 'consensus',
      description: 'O "Google Acadêmico" com esteroides. Busca em 200 milhões de papers e sintetiza conclusões científicas com referências rigorosas.',
      shortDesc: 'Busca científica com síntese de evidências.',
      url: 'https://consensus.app',
      logoUrl: 'https://consensus.app/favicon.ico',
      categorySlug: 'pesquisa',
      pricingType: 'FREEMIUM' as PricingType,
      pricingDetails: 'Grátis robusto / Premium $12/mês',
      features: ['Consensus Meter', 'Resumo de Papers', 'Copilot Científico', 'Filtros de Estudo'],
      pros: ['Apenas ciência real', 'Sintetiza contradições', 'Visualizações claras'],
      cons: ['Base majoritariamente em inglês', 'Não lê livros físicos'],
      useCases: ['TCC e Teses', 'Embasamento teórico', 'Verificar mitos'],
      isFeatured: false,
      orderIndex: 2,
    },
    {
      name: 'Elicit',
      slug: 'elicit',
      description: 'Um analista de pesquisa de IA. Encontra papers relevantes e extrai dados deles em uma tabela organizada. Perfeito para revisões sistemáticas.',
      shortDesc: 'Automatiza revisões de literatura científica.',
      url: 'https://elicit.com',
      logoUrl: 'https://elicit.com/favicon.ico',
      categorySlug: 'pesquisa',
      pricingType: 'FREEMIUM' as PricingType,
      pricingDetails: 'Grátis (créditos) / Plus $12/mês',
      features: ['Extração de dados em tabela', 'Busca semântica', 'Resumo de conceitos', 'Upload de PDFs'],
      pros: ['Economiza horas de leitura', 'Organiza o conhecimento', 'Ótimo para meta-análises'],
      cons: ['Créditos limitados no free', 'Complexo para leigos'],
      useCases: ['Revisão sistemática', 'Estado da arte', 'Comparar metodologias'],
      isFeatured: false,
      orderIndex: 3,
    },

    // ===== PRODUTIVIDADE =====
    {
      name: 'Notion AI',
      slug: 'notion-ai',
      description: 'O assistente de IA integrado ao seu espaço de trabalho. O recurso "Q&A" permite conversar com todo o seu banco de dados de notas e wikis.',
      shortDesc: 'IA conectada às suas notas e documentos no Notion.',
      url: 'https://notion.so',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png',
      categorySlug: 'produtividade',
      pricingType: 'PAID' as PricingType,
      pricingDetails: '$10/mês por usuário (add-on)',
      features: ['Q&A (Chat com Docs)', 'Resumo Automático', 'Tradução', 'Autofill de Banco de Dados'],
      pros: ['Contexto dos seus dados', 'Sem sair do fluxo', 'Privacidade empresarial'],
      cons: ['Pago à parte', 'Preso ao ecossistema Notion'],
      useCases: ['Encontrar informações em wikis', 'Resumir reuniões', 'Gerar tarefas de notas'],
      isFeatured: false,
      orderIndex: 1,
    },
    {
      name: 'Gamma',
      slug: 'gamma',
      description: 'A nova alternativa ao PowerPoint. Cria slides, documentos e sites bonitos e editáveis a partir de um prompt, mantendo o design alinhado automaticamente.',
      shortDesc: 'Criação de apresentações bonitas e rápidas com IA.',
      url: 'https://gamma.app',
      logoUrl: 'https://gamma.app/favicon.ico',
      categorySlug: 'produtividade',
      pricingType: 'FREEMIUM' as PricingType,
      pricingDetails: 'Grátis (créditos renováveis) / Pro $10/mês',
      features: ['Texto para Slide', 'Importar Docs/Notes', 'Sites interativos', 'Analytics'],
      pros: ['Design sempre bonito', 'Muito mais rápido que PPT', 'Interativo e web-based'],
      cons: ['Layouts um pouco rígidos', 'Exportação PDF perde interatividade'],
      useCases: ['Aulas expositivas', 'Pitch decks', 'Portfólios rápidos'],
      isFeatured: true,
      orderIndex: 2,
    },
    {
      name: 'Otter.ai',
      slug: 'otter-ai',
      description: 'O secretário de reuniões definitivo. Entra no Zoom/Meet/Teams, grava, transcreve e gera ata de reunião com itens de ação automaticamente.',
      shortDesc: 'Transcrição e atas automáticas de reuniões.',
      url: 'https://otter.ai',
      logoUrl: 'https://otter.ai/favicon.ico',
      categorySlug: 'produtividade',
      pricingType: 'FREEMIUM' as PricingType,
      pricingDetails: '300 min grátis/mês / Pro $17/mês',
      features: ['OtterPilot (Entra sozinho)', 'Chat com Reunião', 'Resumo de Slides', 'Identificação de Voz'],
      pros: ['Nunca mais faça atas', 'Busalhável', 'Identifica quem falou o quê'],
      cons: ['Suporte a PT-BR melhorou mas varia', 'Limite no free'],
      useCases: ['Registrar aulas', 'Reuniões de conselho', 'Entrevistas de pesquisa'],
      isFeatured: false,
      orderIndex: 3,
    },
  ];

  for (const tool of tools) {
    const categoryId = createdCategories[tool.categorySlug];
    if (!categoryId) {
      console.log(`  ⚠️  Categoria não encontrada: ${tool.categorySlug}`);
      continue;
    }
    
    await prisma.aiTool.create({
      data: {
        name: tool.name,
        slug: tool.slug,
        description: tool.description,
        shortDesc: tool.shortDesc,
        url: tool.url,
        logoUrl: tool.logoUrl,
        categoryId,
        pricingType: tool.pricingType,
        pricingDetails: tool.pricingDetails,
        features: tool.features,
        pros: tool.pros,
        cons: tool.cons,
        useCases: tool.useCases,
        isFeatured: tool.isFeatured,
        orderIndex: tool.orderIndex,
      },
    });
    console.log(`  🔧 Ferramenta: ${tool.name}`);
  }

  console.log(`\n🎉 Catálogo concluído! ${categories.length} categorias e ${tools.length} ferramentas inseridas.`);
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
