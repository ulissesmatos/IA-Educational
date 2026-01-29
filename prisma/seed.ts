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
      description: 'Assistentes de IA para conversas, escrita, resumos e análise de textos.',
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
    {
      name: 'Grátis e Local',
      slug: 'gratis-local',
      icon: '💻',
      description: 'IAs que podem ser baixadas e usadas gratuitamente no seu computador.',
      orderIndex: 7,
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
    // ===== CHAT E TEXTO (Organizadas por popularidade) =====
    {
      name: 'ChatGPT',
      slug: 'chatgpt',
      description: 'O ChatGPT é a IA mais popular do mundo, desenvolvida pela OpenAI. Funciona como um assistente virtual inteligente que pode responder perguntas, criar textos, ajudar com programação e muito mais. Na versão gratuita você tem acesso ao modelo GPT-4o mini, que já é bem poderoso.',
      shortDesc: 'A IA mais famosa do mundo para conversar e criar conteúdo.',
      url: 'https://chat.openai.com',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
      categorySlug: 'chat-texto',
      pricingType: 'FREEMIUM' as PricingType,
      pricingDetails: 'Grátis (GPT-4o mini) / Plus R$ 114/mês',
      features: ['Geração de textos', 'Criação de imagens (DALL-E)', 'Análise de documentos', 'Busca na internet', 'Voz avançada'],
      pros: ['Muito fácil de usar', 'Versão gratuita funcional', 'Grande variedade de funções', 'App para celular'],
      cons: ['Limites na versão grátis', 'Pode negar alguns pedidos', 'Às vezes inventa informações'],
      useCases: ['Criar atividades para aula', 'Escrever e-mails', 'Fazer resumos de textos', 'Tirar dúvidas sobre conteúdo'],
      isFeatured: true,
      orderIndex: 1,
    },
    {
      name: 'Google Gemini',
      slug: 'gemini',
      description: 'O Gemini é a resposta do Google ao ChatGPT. Sua maior vantagem é a integração com ferramentas do Google (Drive, Docs, Gmail) e uma janela de contexto enorme - pode analisar documentos e livros muito longos de uma vez. Ideal para quem já usa o Google Workspace.',
      shortDesc: 'IA do Google integrada com Drive, Docs e Gmail.',
      url: 'https://gemini.google.com',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg',
      categorySlug: 'chat-texto',
      pricingType: 'FREEMIUM' as PricingType,
      pricingDetails: 'Grátis (Flash) / Advanced R$ 97/mês',
      features: ['Integração com Google Drive e Docs', 'Analisa documentos muito longos', 'Resumo de vídeos do YouTube', 'Gems (assistentes personalizados)'],
      pros: ['Funciona bem com ferramentas Google', 'Analisa muitos documentos de uma vez', 'Versão grátis generosa'],
      cons: ['Às vezes confunde informações', 'Interface pode ser confusa no início'],
      useCases: ['Analisar vários PDFs de uma vez', 'Resumir vídeos educativos', 'Trabalhar com arquivos do Drive'],
      isFeatured: true,
      orderIndex: 2,
    },
    {
      name: 'Claude',
      slug: 'claude',
      description: 'O Claude, da empresa Anthropic, é conhecido por dar respostas mais naturais e detalhadas. É excelente para trabalhar com textos longos e programação. O recurso "Artifacts" permite criar documentos e aplicativos simples que você pode ver e editar ao lado da conversa.',
      shortDesc: 'IA com respostas naturais, ótima para textos e programação.',
      url: 'https://claude.ai',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Claude_AI_logo.svg',
      categorySlug: 'chat-texto',
      pricingType: 'FREEMIUM' as PricingType,
      pricingDetails: 'Grátis (Sonnet 4.5 limitado) / Pro R$ 114/mês',
      features: ['Artifacts (cria documentos e apps)', 'Projetos com memória', 'Lê documentos grandes', 'Excelente em programação'],
      pros: ['Respostas muito naturais', 'Ótimo para criar textos longos', 'Menos filtros que outras IAs'],
      cons: ['Não cria imagens', 'Limites diários na versão grátis', 'Precisa de conta para usar'],
      useCases: ['Escrever textos mais humanizados', 'Analisar documentos grandes', 'Criar materiais de aula detalhados'],
      isFeatured: true,
      orderIndex: 3,
    },
    {
      name: 'DeepSeek',
      slug: 'deepseek',
      description: 'DeepSeek é uma IA chinesa que surpreendeu o mundo em 2025 ao oferecer desempenho comparável ao ChatGPT, mas totalmente gratuita e de código aberto. Seu modelo R1 é especialmente bom em matemática, programação e raciocínio lógico. Pode ser usado online ou baixado no computador.',
      shortDesc: 'IA gratuita e poderosa, ótima para matemática e programação.',
      url: 'https://chat.deepseek.com',
      logoUrl: 'https://avatars.githubusercontent.com/u/146604683?s=200&v=4',
      categorySlug: 'chat-texto',
      pricingType: 'FREE' as PricingType,
      pricingDetails: 'Totalmente grátis',
      features: ['Modelo R1 (raciocínio avançado)', 'Código aberto', 'API muito barata', 'Pode usar offline'],
      pros: ['Completamente gratuito', 'Excelente em lógica e matemática', 'Pode baixar no computador'],
      cons: ['Servidores às vezes ficam lentos', 'Empresa chinesa (questões de privacidade)', 'Interface só em inglês'],
      useCases: ['Resolver problemas de matemática', 'Ajudar em programação', 'Usar sem gastar nada'],
      isFeatured: true,
      orderIndex: 4,
    },

    // ===== GERAÇÃO DE IMAGENS =====
    {
      name: 'Midjourney',
      slug: 'midjourney',
      description: 'Midjourney é considerada a melhor IA para criar imagens bonitas e artísticas. Muito usada por designers e artistas profissionais. A partir da versão 6, ficou ainda mais realista e ganhou um editor web que facilita muito o uso.',
      shortDesc: 'A melhor IA para criar imagens artísticas e realistas.',
      url: 'https://midjourney.com',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Midjourney_Emblem.png',
      categorySlug: 'imagens',
      pricingType: 'PAID' as PricingType,
      pricingDetails: 'A partir de $10/mês (cerca de R$ 58)',
      features: ['Editor web intuitivo', 'Estilos artísticos variados', 'Mantém personagens consistentes', 'Edição de partes da imagem'],
      pros: ['Qualidade artística superior', 'Imagens muito bonitas', 'Controle sobre o estilo'],
      cons: ['Não tem plano grátis', 'Pode ser complicado no início', 'Preço em dólar'],
      useCases: ['Criar ilustrações para slides', 'Material visual para aulas', 'Pôsteres e cartazes'],
      isFeatured: true,
      orderIndex: 1,
    },
    {
      name: 'Flux.1',
      slug: 'flux',
      description: 'Flux.1 é a IA mais recente e impressionante para criar imagens. Sua grande vantagem é conseguir escrever textos dentro das imagens de forma correta - algo que outras IAs têm dificuldade. Além disso, cria fotos muito realistas. É gratuita em várias plataformas.',
      shortDesc: 'IA que cria imagens realistas e escreve texto corretamente.',
      url: 'https://blackforestlabs.ai',
      logoUrl: 'https://replicate.delivery/pbxt/L7j4xJj4xJj4xJj4xJj4xJj4xJj4xJj4xJj4xJj4xJj4/flux-logo.png',
      categorySlug: 'imagens',
      pricingType: 'FREEMIUM' as PricingType,
      pricingDetails: 'Grátis (em sites parceiros) / Pro pago',
      features: ['Escreve texto nas imagens', 'Fotorrealismo extremo', 'Várias versões (rápida e detalhada)', 'Código aberto'],
      pros: ['Melhor para criar textos em imagens', 'Muito realista', 'Disponível gratuitamente'],
      cons: ['Precisa de computador potente para usar offline', 'Menos "artístico" que Midjourney'],
      useCases: ['Criar cartazes com texto', 'Posts para redes sociais', 'Material didático com escrita'],
      isFeatured: true,
      orderIndex: 2,
    },
    {
      name: 'DALL-E 3',
      slug: 'dall-e',
      description: 'DALL-E 3 está integrado ao ChatGPT e é a opção mais fácil para quem está começando. Você simplesmente descreve o que quer em linguagem natural e ele cria a imagem. Não precisa aprender comandos complicados.',
      shortDesc: 'Gerador de imagens simples integrado ao ChatGPT.',
      url: 'https://openai.com/dall-e-3',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
      categorySlug: 'imagens',
      pricingType: 'PAID' as PricingType,
      pricingDetails: 'Incluído no ChatGPT Plus (R$ 114/mês)',
      features: ['Integrado ao ChatGPT', 'Entende português naturalmente', 'Edição via conversa', 'Muito seguro'],
      pros: ['Muito fácil de usar', 'Não precisa aprender comandos', 'Pode pedir mudanças conversando'],
      cons: ['Imagens às vezes parecem artificiais', 'Textos nas imagens saem errados', 'Só no plano pago'],
      useCases: ['Ilustrações rápidas para slides', 'Explicar conceitos visualmente', 'Experimentar ideias'],
      isFeatured: false,
      orderIndex: 3,
    },
    {
      name: 'Canva (Magic Studio)',
      slug: 'canva',
      description: 'O Canva adicionou IA aos seus recursos de design. Perfeito para professores porque você cria apresentações, folhas de atividade e materiais visuais tudo no mesmo lugar. A IA ajuda a gerar e editar imagens direto no seu projeto.',
      shortDesc: 'IA de design integrada para criar apresentações e materiais.',
      url: 'https://canva.com',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg',
      categorySlug: 'imagens',
      pricingType: 'FREEMIUM' as PricingType,
      pricingDetails: 'Grátis (limitado) / Pro R$ 75/mês',
      features: ['Cria e edita imagens', 'Remove fundo automaticamente', 'Expande imagens', 'Modelos prontos'],
      pros: ['Tudo em um só lugar', 'Fácil de usar', 'Ideal para materiais de aula'],
      cons: ['Versão grátis é bem limitada', 'Imagens IA podem ser genéricas'],
      useCases: ['Slides para aula', 'Folhas de atividade', 'Comunicados visuais', 'Posts educativos'],
      isFeatured: false,
      orderIndex: 4,
    },

    // ===== VÍDEO E ÁUDIO =====
    {
      name: 'Suno AI',
      slug: 'suno',
      description: 'Suno cria músicas completas com letra, melodia e voz a partir de um texto simples. Você pode criar músicas educativas, jingles para a sala de aula ou trilhas sonoras. A qualidade é impressionante - parece música de rádio.',
      shortDesc: 'Cria músicas completas com letra e melodia.',
      url: 'https://suno.com',
      logoUrl: 'https://suno.com/favicon.ico',
      categorySlug: 'video-audio',
      pricingType: 'FREEMIUM' as PricingType,
      pricingDetails: '50 créditos diários grátis / Pro R$ 58/mês',
      features: ['Músicas de até 4 minutos', 'Cria letras automaticamente', 'Vozes realistas', 'Vários estilos musicais'],
      pros: ['Muito divertido de usar', 'Qualidade impressionante', 'Plano grátis generoso'],
      cons: ['Direitos autorais complexos', 'Algumas vozes soam metálicas'],
      useCases: ['Músicas educativas', 'Paródias didáticas', 'Jingles para sala', 'Projetos criativos'],
      isFeatured: true,
      orderIndex: 1,
    },
    {
      name: 'ElevenLabs',
      slug: 'elevenlabs',
      description: 'ElevenLabs é a melhor IA para criar vozes artificiais. As vozes são tão naturais que parecem humanas. Você pode narrar textos, dublar vídeos ou até clonar sua própria voz. Perfeito para criar conteúdo acessível.',
      shortDesc: 'Cria vozes artificiais muito realistas para narração.',
      url: 'https://elevenlabs.io',
      logoUrl: 'https://elevenlabs.io/favicon.ico',
      categorySlug: 'video-audio',
      pricingType: 'FREEMIUM' as PricingType,
      pricingDetails: '10 mil caracteres grátis/mês / Starter $5/mês',
      features: ['Clonagem de voz', 'Dublagem automática de vídeos', 'Efeitos sonoros', 'Várias línguas incluindo português'],
      pros: ['Vozes muito naturais', 'Dubla vídeos automaticamente', 'Suporta português'],
      cons: ['Planos caros para uso intenso', 'Clonagem só no pago'],
      useCases: ['Narrar videoaulas', 'Tornar conteúdo acessível', 'Dublar vídeos educativos'],
      isFeatured: true,
      orderIndex: 2,
    },
    {
      name: 'Runway Gen-3',
      slug: 'runway',
      description: 'Runway é uma ferramenta profissional para criar e editar vídeos com IA. Pode gerar vídeos a partir de texto ou imagens, editar vídeos existentes e adicionar efeitos especiais. Mais avançada, mas muito poderosa.',
      shortDesc: 'Ferramenta profissional para criar e editar vídeos com IA.',
      url: 'https://runway.ml',
      logoUrl: 'https://runway.ml/favicon.ico',
      categorySlug: 'video-audio',
      pricingType: 'FREEMIUM' as PricingType,
      pricingDetails: 'Créditos grátis / Pro $15/mês',
      features: ['Gera vídeos realistas', 'Controle de movimento', 'Sincronização labial', 'Edição profissional'],
      pros: ['Qualidade profissional', 'Muitas ferramentas de edição', 'Comunidade ativa'],
      cons: ['Créditos caros', 'Curva de aprendizado maior', 'Interface em inglês'],
      useCases: ['Criar vídeos explicativos', 'Animar imagens', 'Efeitos visuais'],
      isFeatured: false,
      orderIndex: 3,
    },

    // ===== EDUCAÇÃO =====
    {
      name: 'Teachy',
      slug: 'teachy',
      description: 'Teachy é uma plataforma brasileira feita especificamente para professores. Cria planos de aula, avaliações e materiais didáticos alinhados com a BNCC. É a opção mais adequada para o contexto educacional brasileiro.',
      shortDesc: 'Plataforma brasileira completa para professores (alinhada à BNCC).',
      url: 'https://teachy.com.br',
      logoUrl: 'https://teachy.com.br/favicon.ico',
      categorySlug: 'educacao',
      pricingType: 'FREEMIUM' as PricingType,
      pricingDetails: 'Grátis (limitado) / Pro R$ 29/mês',
      features: ['Planos de aula BNCC', 'Banco de questões', 'Correção de redação', 'Transforma vídeos em aulas'],
      pros: ['Feita para o Brasil', 'Alinhada com BNCC', 'Interface em português', 'Suporte local'],
      cons: ['Alguns recursos só no Pro', 'Focada em ensino básico'],
      useCases: ['Criar planos de aula', 'Fazer provas', 'Atividades diferenciadas', 'Correção de redações'],
      isFeatured: true,
      orderIndex: 1,
    },
    {
      name: 'MagicSchool',
      slug: 'magicschool',
      description: 'MagicSchool oferece mais de 80 ferramentas diferentes para professores. Desde gerar feedback individualizado até criar atividades adaptadas. Também tem versão para estudantes usarem de forma segura.',
      shortDesc: 'Mais de 80 ferramentas de IA para educadores.',
      url: 'https://magicschool.ai',
      logoUrl: 'https://magicschool.ai/favicon.ico',
      categorySlug: 'educacao',
      pricingType: 'FREEMIUM' as PricingType,
      pricingDetails: 'Grátis (robusto) / Plus $12/mês',
      features: ['80+ ferramentas específicas', 'Versão segura para alunos', 'Integração com Google/Microsoft', 'Detector de texto IA'],
      pros: ['Muitas opções de ferramentas', 'Versão grátis completa', 'Seguro para estudantes'],
      cons: ['Interface em inglês', 'Pode ser confuso com tantas opções'],
      useCases: ['Diferenciar ensino', 'Feedback personalizado', 'Comunicação com pais'],
      isFeatured: true,
      orderIndex: 2,
    },
    {
      name: 'NotebookLM',
      slug: 'notebooklm',
      description: 'NotebookLM do Google virou febre ao transformar documentos em podcasts automáticos. Você adiciona PDFs, textos ou vídeos e ele cria um "podcast" com dois apresentadores discutindo o conteúdo. Ótimo para estudar.',
      shortDesc: 'Transforma documentos em podcasts e guias de estudo.',
      url: 'https://notebooklm.google.com',
      logoUrl: 'https://notebooklm.google.com/favicon.ico',
      categorySlug: 'educacao',
      pricingType: 'FREE' as PricingType,
      pricingDetails: 'Totalmente grátis',
      features: ['Podcast automático', 'Resumos de documentos', 'Cita as fontes', 'Perguntas sugeridas'],
      pros: ['Completamente gratuito', 'Podcast automático é incrível', 'Só usa suas fontes (não inventa)'],
      cons: ['Ainda experimental', 'Podcasts só em inglês'],
      useCases: ['Estudar para provas', 'Revisar conteúdo', 'Transformar textos em áudio'],
      isFeatured: true,
      orderIndex: 3,
    },
    {
      name: 'Khanmigo',
      slug: 'khanmigo',
      description: 'Khanmigo é o tutor de IA da Khan Academy. Diferente de outras IAs que dão a resposta pronta, ele faz perguntas e guia o aluno para descobrir sozinho - método socrático. Promove aprendizado real.',
      shortDesc: 'Tutor de IA que ensina fazendo perguntas (método socrático).',
      url: 'https://www.khanacademy.org/khan-labs',
      logoUrl: 'https://cdn.kastatic.org/images/khan-logo-dark-background-2.png',
      categorySlug: 'educacao',
      pricingType: 'FREEMIUM' as PricingType,
      pricingDetails: 'Grátis para professores (em expansão)',
      features: ['Tutoria socrática', 'Não dá respostas prontas', 'Integrado à Khan Academy', 'Ajuda no planejamento'],
      pros: ['Pedagogicamente correto', 'Incentiva pensamento crítico', 'Marca confiável'],
      cons: ['Acesso ainda limitado', 'Pode ser lento nas respostas'],
      useCases: ['Reforço escolar', 'Ajuda em deveres', 'Ensinar a pensar'],
      isFeatured: false,
      orderIndex: 4,
    },

    // ===== PESQUISA =====
    {
      name: 'Perplexity',
      slug: 'perplexity',
      description: 'Perplexity é como um Google turbinado com IA. Em vez de links, você recebe respostas diretas e bem organizadas, sempre com as fontes citadas. O recurso "Deep Research" faz pesquisas profundas sobre qualquer tema.',
      shortDesc: 'Buscador inteligente que dá respostas diretas com fontes.',
      url: 'https://perplexity.ai',
      logoUrl: 'https://perplexity.ai/favicon.ico',
      categorySlug: 'pesquisa',
      pricingType: 'FREEMIUM' as PricingType,
      pricingDetails: 'Grátis / Pro $20/mês',
      features: ['Respostas com fontes', 'Pesquisa profunda', 'Busca acadêmica', 'Modo focado (YouTube, notícias)'],
      pros: ['Sempre cita as fontes', 'Mais rápido que pesquisar sozinho', 'Versão grátis muito boa'],
      cons: ['Pode errar fontes raramente', 'Limites na versão Pro'],
      useCases: ['Pesquisas rápidas', 'Verificar informações', 'Preparar aulas'],
      isFeatured: true,
      orderIndex: 1,
    },
    {
      name: 'Consensus',
      slug: 'consensus',
      description: 'Consensus busca em mais de 200 milhões de artigos científicos e apresenta um consenso das pesquisas. É como ter um "Google Acadêmico com IA". Perfeito para pesquisas sérias e embasamento teórico.',
      shortDesc: 'Busca científica que resume evidências de estudos.',
      url: 'https://consensus.app',
      logoUrl: 'https://consensus.app/favicon.ico',
      categorySlug: 'pesquisa',
      pricingType: 'FREEMIUM' as PricingType,
      pricingDetails: 'Grátis (robusto) / Premium $12/mês',
      features: ['Busca em artigos científicos', 'Consenso de estudos', 'Resumo de papers', 'Filtros avançados'],
      pros: ['Apenas ciência real', 'Mostra contradições', 'Visualizações claras'],
      cons: ['Maioria em inglês', 'Não busca livros físicos'],
      useCases: ['TCC e dissertações', 'Embasamento teórico', 'Verificar mitos científicos'],
      isFeatured: false,
      orderIndex: 2,
    },
    {
      name: 'Elicit',
      slug: 'elicit',
      description: 'Elicit automatiza revisões de literatura. Busca papers relevantes e extrai dados importantes em uma tabela organizada. Economiza horas de trabalho manual em pesquisas acadêmicas.',
      shortDesc: 'Automatiza revisões de literatura científica.',
      url: 'https://elicit.com',
      logoUrl: 'https://elicit.com/favicon.ico',
      categorySlug: 'pesquisa',
      pricingType: 'FREEMIUM' as PricingType,
      pricingDetails: 'Grátis (créditos) / Plus $12/mês',
      features: ['Extrai dados de papers', 'Busca semântica', 'Organiza em tabelas', 'Upload de PDFs'],
      pros: ['Economiza muito tempo', 'Organiza o conhecimento', 'Ótimo para meta-análises'],
      cons: ['Créditos limitados no free', 'Interface complexa para iniciantes'],
      useCases: ['Revisão sistemática', 'Estado da arte', 'Comparar metodologias'],
      isFeatured: false,
      orderIndex: 3,
    },

    // ===== PRODUTIVIDADE =====
    {
      name: 'Gamma',
      slug: 'gamma',
      description: 'Gamma cria apresentações bonitas automaticamente. Você escreve o que quer apresentar e ele monta os slides com design profissional. Muito mais rápido que fazer no PowerPoint.',
      shortDesc: 'Cria apresentações bonitas automaticamente.',
      url: 'https://gamma.app',
      logoUrl: 'https://gamma.app/favicon.ico',
      categorySlug: 'produtividade',
      pricingType: 'FREEMIUM' as PricingType,
      pricingDetails: 'Grátis (créditos renováveis) / Pro $10/mês',
      features: ['Texto vira slide automaticamente', 'Design sempre bonito', 'Sites interativos', 'Importa documentos'],
      pros: ['Muito mais rápido que PPT', 'Design sempre profissional', 'Interativo e online'],
      cons: ['Layouts um pouco rígidos', 'PDF perde interatividade'],
      useCases: ['Slides para aula', 'Apresentações rápidas', 'Portfólios'],
      isFeatured: true,
      orderIndex: 1,
    },
    {
      name: 'Otter.ai',
      slug: 'otter-ai',
      description: 'Otter.ai é seu secretário automático. Entra nas reuniões do Zoom/Meet, grava, transcreve e cria a ata automaticamente. Você nunca mais precisa fazer anotações durante reuniões.',
      shortDesc: 'Transcreve reuniões e cria atas automaticamente.',
      url: 'https://otter.ai',
      logoUrl: 'https://otter.ai/favicon.ico',
      categorySlug: 'produtividade',
      pricingType: 'FREEMIUM' as PricingType,
      pricingDetails: '300 min grátis/mês / Pro $17/mês',
      features: ['Entra sozinho em reuniões', 'Transcrição em tempo real', 'Identifica quem falou', 'Cria resumo automático'],
      pros: ['Nunca mais fazer atas', 'Busca no que foi dito', 'Identifica participantes'],
      cons: ['Português ainda em melhoria', 'Limite no plano grátis'],
      useCases: ['Reuniões pedagógicas', 'Registrar aulas', 'Entrevistas'],
      isFeatured: false,
      orderIndex: 2,
    },
    {
      name: 'Notion AI',
      slug: 'notion-ai',
      description: 'Se você usa Notion para organizar suas notas e materiais, o Notion AI permite conversar com todo seu conteúdo. É como ter um assistente que conhece tudo que você já escreveu.',
      shortDesc: 'IA integrada às suas notas no Notion.',
      url: 'https://notion.so',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png',
      categorySlug: 'produtividade',
      pricingType: 'PAID' as PricingType,
      pricingDetails: '$10/mês por usuário (adicional)',
      features: ['Conversa com suas notas', 'Resumo automático', 'Tradução', 'Preenche banco de dados'],
      pros: ['Conhece seus dados', 'Não precisa sair do Notion', 'Seguro para empresas'],
      cons: ['Pago separadamente', 'Só funciona no Notion'],
      useCases: ['Encontrar informações antigas', 'Resumir reuniões', 'Organizar tarefas'],
      isFeatured: false,
      orderIndex: 3,
    },

    // ===== GRÁTIS E LOCAL (Opções open-source) =====
    {
      name: 'Ollama',
      slug: 'ollama',
      description: 'Ollama permite baixar e rodar modelos de IA no seu próprio computador, totalmente offline e gratuito. Funciona via linha de comando (terminal) mas é simples de usar. Pode rodar LLaMA, Gemma, Mistral, DeepSeek e outros modelos.',
      shortDesc: 'Rode modelos de IA grátis no seu computador (offline).',
      url: 'https://ollama.com',
      logoUrl: 'https://ollama.com/favicon.ico',
      categorySlug: 'gratis-local',
      pricingType: 'FREE' as PricingType,
      pricingDetails: 'Totalmente grátis e open-source',
      features: ['100% offline', 'Modelos gratuitos', 'Privacidade total', 'API local'],
      pros: ['Totalmente gratuito', 'Seus dados não saem do computador', 'Muitos modelos disponíveis'],
      cons: ['Precisa de terminal (linha de comando)', 'Requer computador razoável', 'Interface técnica'],
      useCases: ['Usar IA sem internet', 'Privacidade total', 'Aprender sobre IA'],
      isFeatured: true,
      orderIndex: 1,
    },
    {
      name: 'LM Studio',
      slug: 'lm-studio',
      description: 'LM Studio é como o Ollama mas com interface visual (não precisa de terminal). Baixe modelos de IA e rode no seu computador com alguns cliques. Perfeito para quem quer usar IA local sem complicação.',
      shortDesc: 'IA local com interface fácil (não precisa de terminal).',
      url: 'https://lmstudio.ai',
      logoUrl: 'https://lmstudio.ai/favicon.ico',
      categorySlug: 'gratis-local',
      pricingType: 'FREE' as PricingType,
      pricingDetails: 'Totalmente grátis',
      features: ['Interface visual', 'Biblioteca de modelos', 'Suporta CPU e GPU', 'Chat local'],
      pros: ['Muito fácil de usar', 'Não precisa saber programar', 'Gratuito e privado'],
      cons: ['Modelos grandes precisam de muito espaço', 'Computador fraco pode ser lento'],
      useCases: ['IA sem internet', 'Testar modelos diferentes', 'Manter privacidade'],
      isFeatured: true,
      orderIndex: 2,
    },
    {
      name: 'GPT4All',
      slug: 'gpt4all',
      description: 'GPT4All é outra opção para rodar IAs localmente com interface gráfica simples. Focado em facilidade de uso e privacidade. Inclui vários modelos prontos para baixar com um clique.',
      shortDesc: 'IA local simples com vários modelos incluídos.',
      url: 'https://gpt4all.io',
      logoUrl: 'https://gpt4all.io/favicon.ico',
      categorySlug: 'gratis-local',
      pricingType: 'FREE' as PricingType,
      pricingDetails: 'Totalmente grátis e open-source',
      features: ['Interface simples', 'Modelos pré-instalados', 'Multiplataforma', 'Documentos locais'],
      pros: ['Muito fácil de começar', 'Gratuito e privado', 'Leve'],
      cons: ['Modelos menores que na nuvem', 'Pode ser lento em PCs fracos'],
      useCases: ['IA offline', 'Privacidade total', 'Aprendizado'],
      isFeatured: false,
      orderIndex: 3,
    },
  ];

  // Criar as ferramentas
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

  console.log('\n✅ Seed concluído com sucesso!');

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
