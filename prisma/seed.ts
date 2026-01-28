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
      description: 'O ChatGPT da OpenAI é um dos chatbots de IA mais populares do mundo. Capaz de responder perguntas, escrever textos, programar, analisar imagens e muito mais. A versão GPT-4 oferece raciocínio avançado e capacidade de processar imagens.',
      shortDesc: 'Chatbot versátil da OpenAI para conversas, escrita e análise.',
      url: 'https://chat.openai.com',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
      categorySlug: 'chat-texto',
      pricingType: 'FREEMIUM' as PricingType,
      pricingDetails: 'Grátis (GPT-3.5) / Plus $20/mês (GPT-4)',
      features: ['Conversação natural', 'Escrita criativa', 'Análise de código', 'Visão (GPT-4)', 'Plugins'],
      pros: ['Muito versátil', 'Fácil de usar', 'Boa qualidade de respostas'],
      cons: ['Limite de mensagens no plano grátis', 'Pode inventar informações'],
      useCases: ['Tirar dúvidas de alunos', 'Criar exercícios', 'Revisar textos', 'Brainstorm de ideias'],
      isFeatured: true,
      orderIndex: 1,
    },
    {
      name: 'Claude',
      slug: 'claude',
      description: 'Claude é o assistente de IA da Anthropic, conhecido por respostas longas e detalhadas, forte raciocínio lógico e foco em segurança. Excelente para análise de documentos longos e conversas complexas.',
      shortDesc: 'Assistente da Anthropic com foco em segurança e textos longos.',
      url: 'https://claude.ai',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Claude_AI_logo.svg',
      categorySlug: 'chat-texto',
      pricingType: 'FREEMIUM' as PricingType,
      pricingDetails: 'Grátis limitado / Pro $20/mês',
      features: ['Contexto de 200K tokens', 'Upload de arquivos', 'Análise de PDFs', 'Raciocínio ético'],
      pros: ['Respostas muito detalhadas', 'Ótimo para textos longos', 'Mais "cauteloso"'],
      cons: ['Menos criativo que GPT-4', 'Às vezes muito prolixo'],
      useCases: ['Analisar artigos científicos', 'Resumir documentos', 'Criar planos de aula detalhados'],
      isFeatured: true,
      orderIndex: 2,
    },
    {
      name: 'Google Gemini',
      slug: 'gemini',
      description: 'Gemini é a IA multimodal do Google, integrada ao ecossistema Google (Gmail, Docs, Drive). Pode processar texto, imagem, áudio e vídeo. Substituto do antigo Bard.',
      shortDesc: 'IA multimodal do Google integrada ao Workspace.',
      url: 'https://gemini.google.com',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg',
      categorySlug: 'chat-texto',
      pricingType: 'FREEMIUM' as PricingType,
      pricingDetails: 'Grátis / Advanced $20/mês com Google One',
      features: ['Multimodal', 'Integração Google Workspace', 'Busca na web', 'Extensões'],
      pros: ['Integrado ao Google', 'Bom para pesquisa', 'Gratuito generoso'],
      cons: ['Menos preciso que GPT-4', 'Limitações regionais'],
      useCases: ['Pesquisar na web', 'Analisar planilhas', 'Criar apresentações'],
      isFeatured: true,
      orderIndex: 3,
    },
    {
      name: 'Microsoft Copilot',
      slug: 'copilot',
      description: 'Copilot é a IA da Microsoft baseada em GPT-4, integrada ao Bing, Edge, Windows e Microsoft 365. Oferece busca na web em tempo real e criação de imagens.',
      shortDesc: 'IA da Microsoft com GPT-4 e busca na web integrada.',
      url: 'https://copilot.microsoft.com',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Microsoft_365_Copilot_Icon.svg',
      categorySlug: 'chat-texto',
      pricingType: 'FREEMIUM' as PricingType,
      pricingDetails: 'Grátis / Pro $20/mês',
      features: ['GPT-4 grátis', 'Busca Bing', 'Geração de imagens', 'Integração Microsoft 365'],
      pros: ['GPT-4 gratuito', 'Busca atualizada', 'Cria imagens'],
      cons: ['Interface menos polida', 'Respostas às vezes truncadas'],
      useCases: ['Pesquisa com fontes', 'Criar imagens para aulas', 'Resumir páginas web'],
      isFeatured: false,
      orderIndex: 4,
    },

    // ===== GERAÇÃO DE IMAGENS =====
    {
      name: 'DALL-E 3',
      slug: 'dall-e',
      description: 'DALL-E 3 da OpenAI é um dos geradores de imagem mais avançados, integrado ao ChatGPT Plus. Cria imagens realistas e artísticas a partir de descrições em texto natural.',
      shortDesc: 'Gerador de imagens da OpenAI integrado ao ChatGPT.',
      url: 'https://openai.com/dall-e-3',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
      categorySlug: 'imagens',
      pricingType: 'PAID' as PricingType,
      pricingDetails: 'Incluso no ChatGPT Plus ($20/mês) ou via API',
      features: ['Texto em imagens', 'Alta fidelidade', 'Estilos variados', 'Integração ChatGPT'],
      pros: ['Excelente qualidade', 'Entende prompts complexos', 'Texto legível'],
      cons: ['Apenas pago', 'Limite de gerações'],
      useCases: ['Ilustrações para aulas', 'Capas de trabalhos', 'Material visual didático'],
      isFeatured: true,
      orderIndex: 1,
    },
    {
      name: 'Midjourney',
      slug: 'midjourney',
      description: 'Midjourney é conhecido por criar imagens artísticas de altíssima qualidade. Funciona via Discord e é o favorito de artistas e designers para criações visuais impactantes.',
      shortDesc: 'Gerador de arte visual de alta qualidade via Discord.',
      url: 'https://midjourney.com',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Midjourney_Emblem.png',
      categorySlug: 'imagens',
      pricingType: 'PAID' as PricingType,
      pricingDetails: 'A partir de $10/mês',
      features: ['Qualidade artística superior', 'Estilos únicos', 'Comunidade ativa', 'Variações'],
      pros: ['Melhor qualidade artística', 'Estilos consistentes', 'Ótimo para arte'],
      cons: ['Só via Discord', 'Curva de aprendizado', 'Apenas pago'],
      useCases: ['Arte para projetos', 'Ilustrações conceituais', 'Design criativo'],
      isFeatured: true,
      orderIndex: 2,
    },
    {
      name: 'Leonardo.ai',
      slug: 'leonardo-ai',
      description: 'Leonardo.ai oferece geração de imagens com foco em games e design. Permite treinar modelos próprios e tem interface web amigável com plano gratuito generoso.',
      shortDesc: 'Plataforma de geração de imagens com modelos customizáveis.',
      url: 'https://leonardo.ai',
      logoUrl: 'https://leonardo.ai/favicon.ico',
      categorySlug: 'imagens',
      pricingType: 'FREEMIUM' as PricingType,
      pricingDetails: '150 tokens grátis/dia / Pro a partir de $12/mês',
      features: ['Modelos customizáveis', 'Estilos para games', 'Canvas de edição', 'API disponível'],
      pros: ['Bom plano grátis', 'Interface intuitiva', 'Modelos variados'],
      cons: ['Tokens limitados', 'Qualidade varia por modelo'],
      useCases: ['Criar personagens', 'Ilustrações para histórias', 'Assets visuais'],
      isFeatured: false,
      orderIndex: 3,
    },
    {
      name: 'Canva Magic Studio',
      slug: 'canva',
      description: 'O Canva integrou IA generativa em sua plataforma de design. Permite criar imagens, remover fundos, expandir fotos e gerar textos diretamente no editor.',
      shortDesc: 'IA integrada à plataforma de design Canva.',
      url: 'https://canva.com',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg',
      categorySlug: 'imagens',
      pricingType: 'FREEMIUM' as PricingType,
      pricingDetails: 'Grátis limitado / Pro $13/mês',
      features: ['Geração de imagens', 'Remoção de fundo', 'Magic Write', 'Templates prontos'],
      pros: ['Fácil de usar', 'Tudo em um lugar', 'Ótimo para educação'],
      cons: ['IA básica comparada', 'Recursos premium pagos'],
      useCases: ['Apresentações', 'Posts para redes sociais', 'Material didático visual'],
      isFeatured: false,
      orderIndex: 4,
    },

    // ===== VÍDEO E ÁUDIO =====
    {
      name: 'Runway',
      slug: 'runway',
      description: 'Runway é líder em geração de vídeo por IA. O Gen-2 cria vídeos a partir de texto ou imagem. Também oferece ferramentas de edição avançadas.',
      shortDesc: 'Plataforma de geração e edição de vídeo com IA.',
      url: 'https://runway.ml',
      logoUrl: 'https://runway.ml/favicon.ico',
      categorySlug: 'video-audio',
      pricingType: 'FREEMIUM' as PricingType,
      pricingDetails: '125 créditos grátis / Pro a partir de $15/mês',
      features: ['Texto para vídeo', 'Imagem para vídeo', 'Remoção de fundo', 'Motion tracking'],
      pros: ['Qualidade impressionante', 'Múltiplas ferramentas', 'Interface profissional'],
      cons: ['Créditos acabam rápido', 'Vídeos curtos'],
      useCases: ['Vídeos explicativos curtos', 'Animações para aulas', 'Efeitos visuais'],
      isFeatured: true,
      orderIndex: 1,
    },
    {
      name: 'ElevenLabs',
      slug: 'elevenlabs',
      description: 'ElevenLabs oferece síntese de voz ultra-realista em múltiplos idiomas, incluindo português. Permite clonar vozes e criar narrações profissionais.',
      shortDesc: 'Geração de voz realista e clonagem de voz.',
      url: 'https://elevenlabs.io',
      logoUrl: 'https://elevenlabs.io/favicon.ico',
      categorySlug: 'video-audio',
      pricingType: 'FREEMIUM' as PricingType,
      pricingDetails: '10K caracteres grátis/mês / Pro a partir de $5/mês',
      features: ['Vozes realistas', 'Clonagem de voz', 'Múltiplos idiomas', 'API disponível'],
      pros: ['Qualidade de voz excelente', 'Português brasileiro', 'Fácil de usar'],
      cons: ['Limite no plano grátis', 'Clonagem é paga'],
      useCases: ['Narração de conteúdo', 'Audiobooks', 'Acessibilidade'],
      isFeatured: true,
      orderIndex: 2,
    },
    {
      name: 'HeyGen',
      slug: 'heygen',
      description: 'HeyGen cria vídeos com avatares humanos realistas que falam qualquer texto. Ideal para apresentações, tutoriais e conteúdo educacional escalável.',
      shortDesc: 'Avatares de vídeo realistas para apresentações.',
      url: 'https://heygen.com',
      logoUrl: 'https://heygen.com/favicon.ico',
      categorySlug: 'video-audio',
      pricingType: 'FREEMIUM' as PricingType,
      pricingDetails: '1 crédito grátis / Pro a partir de $29/mês',
      features: ['Avatares realistas', 'Múltiplos idiomas', 'Templates prontos', 'Tradução de vídeos'],
      pros: ['Avatares convincentes', 'Rápido de criar', 'Profissional'],
      cons: ['Caro para uso frequente', 'Avatares limitados no grátis'],
      useCases: ['Vídeo-aulas', 'Tutoriais', 'Comunicados'],
      isFeatured: false,
      orderIndex: 3,
    },

    // ===== EDUCAÇÃO =====
    {
      name: 'Teachy',
      slug: 'teachy',
      description: 'Teachy é uma plataforma brasileira de IA para professores. Gera planos de aula, atividades, avaliações e materiais didáticos alinhados à BNCC.',
      shortDesc: 'IA brasileira para criação de planos de aula e atividades.',
      url: 'https://teachy.com.br',
      logoUrl: 'https://teachy.com.br/favicon.ico',
      categorySlug: 'educacao',
      pricingType: 'FREEMIUM' as PricingType,
      pricingDetails: 'Grátis limitado / Pro a partir de R$29/mês',
      features: ['Planos de aula BNCC', 'Atividades prontas', 'Avaliações', 'Banco de questões'],
      pros: ['Feito para Brasil', 'Alinhado à BNCC', 'Fácil de usar'],
      cons: ['Recursos premium pagos', 'Conteúdo pode precisar ajustes'],
      useCases: ['Criar planos de aula', 'Gerar exercícios', 'Preparar avaliações'],
      isFeatured: true,
      orderIndex: 1,
    },
    {
      name: 'MagicSchool',
      slug: 'magicschool',
      description: 'MagicSchool oferece mais de 60 ferramentas de IA para educadores: gerador de rubrics, diferenciação de conteúdo, feedback automático e mais.',
      shortDesc: 'Suite de ferramentas de IA para educadores.',
      url: 'https://magicschool.ai',
      logoUrl: 'https://magicschool.ai/favicon.ico',
      categorySlug: 'educacao',
      pricingType: 'FREEMIUM' as PricingType,
      pricingDetails: 'Grátis para professores / School plans disponíveis',
      features: ['60+ ferramentas', 'Gerador de rubrics', 'Diferenciação', 'IEP assistance'],
      pros: ['Muitas ferramentas', 'Grátis para professores', 'Específico para educação'],
      cons: ['Em inglês', 'Algumas ferramentas básicas'],
      useCases: ['Diferenciar conteúdo', 'Criar rubricas', 'Gerar feedback'],
      isFeatured: true,
      orderIndex: 2,
    },
    {
      name: 'Eduaide.ai',
      slug: 'eduaide',
      description: 'Eduaide é um assistente de IA para professores com foco em geração de conteúdo educacional: questões, explicações, planos de aula e feedback.',
      shortDesc: 'Assistente de IA para criação de conteúdo educacional.',
      url: 'https://eduaide.ai',
      logoUrl: 'https://eduaide.ai/favicon.ico',
      categorySlug: 'educacao',
      pricingType: 'FREEMIUM' as PricingType,
      pricingDetails: 'Grátis limitado / Pro $8/mês',
      features: ['Gerador de questões', 'Explicações', 'Planos de aula', 'Múltiplos formatos'],
      pros: ['Interface limpa', 'Bom custo-benefício', 'Exportação fácil'],
      cons: ['Principalmente em inglês', 'Menos conhecido'],
      useCases: ['Criar questões variadas', 'Explicar conceitos', 'Preparar materiais'],
      isFeatured: false,
      orderIndex: 3,
    },
    {
      name: 'Quillbot',
      slug: 'quillbot',
      description: 'Quillbot é especializado em parafrasear, resumir e melhorar textos. Útil para professores e alunos trabalharem escrita acadêmica.',
      shortDesc: 'Ferramenta de paráfrase e melhoria de textos.',
      url: 'https://quillbot.com',
      logoUrl: 'https://quillbot.com/favicon.ico',
      categorySlug: 'educacao',
      pricingType: 'FREEMIUM' as PricingType,
      pricingDetails: 'Grátis limitado / Premium $10/mês',
      features: ['Paráfrase', 'Resumo', 'Verificador gramatical', 'Citações'],
      pros: ['Excelente para escrita', 'Múltiplos modos', 'Extensão Chrome'],
      cons: ['Limite de palavras grátis', 'Melhor em inglês'],
      useCases: ['Melhorar redações', 'Resumir textos', 'Evitar plágio'],
      isFeatured: false,
      orderIndex: 4,
    },

    // ===== PESQUISA =====
    {
      name: 'Perplexity',
      slug: 'perplexity',
      description: 'Perplexity é um motor de busca com IA que responde perguntas citando fontes. Combina a busca do Google com a conversação do ChatGPT.',
      shortDesc: 'Motor de busca com IA que cita fontes.',
      url: 'https://perplexity.ai',
      logoUrl: 'https://perplexity.ai/favicon.ico',
      categorySlug: 'pesquisa',
      pricingType: 'FREEMIUM' as PricingType,
      pricingDetails: 'Grátis generoso / Pro $20/mês',
      features: ['Citação de fontes', 'Busca em tempo real', 'Follow-up questions', 'Copilot mode'],
      pros: ['Fontes verificáveis', 'Atualizado', 'Interface limpa'],
      cons: ['Pro caro', 'Às vezes superficial'],
      useCases: ['Pesquisa acadêmica', 'Verificar fatos', 'Encontrar fontes'],
      isFeatured: true,
      orderIndex: 1,
    },
    {
      name: 'Consensus',
      slug: 'consensus',
      description: 'Consensus é uma IA de pesquisa que busca exclusivamente em papers científicos. Ideal para encontrar evidências acadêmicas rapidamente.',
      shortDesc: 'Busca em papers científicos com IA.',
      url: 'https://consensus.app',
      logoUrl: 'https://consensus.app/favicon.ico',
      categorySlug: 'pesquisa',
      pricingType: 'FREEMIUM' as PricingType,
      pricingDetails: 'Grátis limitado / Premium $10/mês',
      features: ['Busca em papers', 'Resumo de evidências', 'Citações', 'Medidor de consenso'],
      pros: ['Fonte acadêmica confiável', 'Resumos úteis', 'Gratuito básico'],
      cons: ['Só papers em inglês', 'Base limitada'],
      useCases: ['Pesquisa científica', 'Trabalhos acadêmicos', 'Evidências para argumentos'],
      isFeatured: false,
      orderIndex: 2,
    },
    {
      name: 'Elicit',
      slug: 'elicit',
      description: 'Elicit é um assistente de pesquisa que ajuda a encontrar, resumir e extrair dados de papers acadêmicos usando IA.',
      shortDesc: 'Assistente de pesquisa acadêmica com IA.',
      url: 'https://elicit.com',
      logoUrl: 'https://elicit.com/favicon.ico',
      categorySlug: 'pesquisa',
      pricingType: 'FREEMIUM' as PricingType,
      pricingDetails: 'Grátis limitado / Plus $12/mês',
      features: ['Busca semântica', 'Extração de dados', 'Resumos automáticos', 'Organização'],
      pros: ['Excelente para revisão literária', 'Extrai dados estruturados'],
      cons: ['Curva de aprendizado', 'Papers em inglês'],
      useCases: ['Revisão de literatura', 'Meta-análises', 'Pesquisa de TCC'],
      isFeatured: false,
      orderIndex: 3,
    },

    // ===== PRODUTIVIDADE =====
    {
      name: 'Notion AI',
      slug: 'notion-ai',
      description: 'Notion AI integra assistente de IA diretamente no Notion. Ajuda a escrever, resumir, traduzir e organizar notas e documentos.',
      shortDesc: 'IA integrada ao Notion para escrita e organização.',
      url: 'https://notion.so/product/ai',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png',
      categorySlug: 'produtividade',
      pricingType: 'PAID' as PricingType,
      pricingDetails: '$10/mês adicional ao plano Notion',
      features: ['Escrita assistida', 'Resumos', 'Tradução', 'Geração de ideias'],
      pros: ['Integrado ao workflow', 'Contexto do workspace', 'Fácil de usar'],
      cons: ['Custo adicional', 'Requer Notion'],
      useCases: ['Organizar notas de aula', 'Criar documentação', 'Planejar projetos'],
      isFeatured: false,
      orderIndex: 1,
    },
    {
      name: 'Gamma',
      slug: 'gamma',
      description: 'Gamma cria apresentações, documentos e páginas web automaticamente a partir de prompts. Ideal para criar slides rapidamente.',
      shortDesc: 'Gerador de apresentações e documentos com IA.',
      url: 'https://gamma.app',
      logoUrl: 'https://gamma.app/favicon.ico',
      categorySlug: 'produtividade',
      pricingType: 'FREEMIUM' as PricingType,
      pricingDetails: '400 créditos grátis / Pro $10/mês',
      features: ['Apresentações automáticas', 'Documentos', 'Páginas web', 'Templates'],
      pros: ['Muito rápido', 'Design bonito', 'Fácil de editar'],
      cons: ['Créditos acabam', 'Menos controle de design'],
      useCases: ['Criar slides de aula', 'Apresentações rápidas', 'Documentos visuais'],
      isFeatured: true,
      orderIndex: 2,
    },
    {
      name: 'Otter.ai',
      slug: 'otter-ai',
      description: 'Otter.ai transcreve reuniões e aulas em tempo real, gerando notas automáticas com identificação de falantes e resumos.',
      shortDesc: 'Transcrição de reuniões e aulas em tempo real.',
      url: 'https://otter.ai',
      logoUrl: 'https://otter.ai/favicon.ico',
      categorySlug: 'produtividade',
      pricingType: 'FREEMIUM' as PricingType,
      pricingDetails: '300 min grátis/mês / Pro $17/mês',
      features: ['Transcrição em tempo real', 'Identificação de falantes', 'Resumos', 'Integração Zoom'],
      pros: ['Transcrição precisa', 'Resumos automáticos', 'Busca em transcrições'],
      cons: ['Melhor em inglês', 'Limite no plano grátis'],
      useCases: ['Transcrever aulas', 'Notas de reuniões', 'Acessibilidade'],
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
