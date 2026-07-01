export interface QuestionSeedData {
  prompt: string;
  correctOption: number; // 0 = Verdadeiro, 1 = Falso
  explanation: string;
}

export const SEED_QUESTIONS: QuestionSeedData[] = [
  // INTERNET / INTRANET / EXTRANET
  {
    prompt: 'A Intranet utiliza tecnologias de rede exclusivas, diferentes dos protocolos usados na Internet pública.',
    correctOption: 1,
    explanation: 'ERRADO. A Intranet usa os mesmos protocolos da Internet (como TCP/IP e HTTP). A diferença está no acesso restrito, não na tecnologia. Essa é uma pegadinha clássica do CEBRASPE.',
  },
  {
    prompt: 'A Extranet é uma extensão da Intranet que permite acesso controlado a usuários externos, como parceiros comerciais e fornecedores.',
    correctOption: 0,
    explanation: 'CERTO. A Extranet amplia o alcance da Intranet para usuários externos autorizados (parceiros, fornecedores, clientes), mantendo controle de acesso e autenticação.',
  },
  {
    prompt: 'A Internet é administrada por um único órgão central que controla todo o tráfego de dados mundial.',
    correctOption: 1,
    explanation: 'ERRADO. A Internet não possui um único dono ou controlador central. É uma rede descentralizada. Há organismos como ICANN e IETF que coordenam padrões e endereços, mas nenhum controla o tráfego.',
  },
  {
    prompt: 'O acesso remoto à Intranet corporativa geralmente requer o uso de VPN (Virtual Private Network) para garantir a segurança na transmissão dos dados.',
    correctOption: 0,
    explanation: 'CERTO. Como a Intranet é uma rede privada, o acesso externo (fora do ambiente físico da organização) é feito via VPN, que cria um canal criptografado sobre a Internet pública.',
  },
  // PROTOCOLOS DE COMUNICAÇÃO
  {
    prompt: 'O protocolo SMTP (Simple Mail Transfer Protocol) é responsável pelo recebimento de e-mails no servidor do destinatário.',
    correctOption: 1,
    explanation: 'ERRADO. O SMTP é responsável pelo ENVIO de e-mails. Para recebimento, utilizam-se o POP3 ou o IMAP. Memorize: SMTP = Send (enviar).',
  },
  {
    prompt: 'Diferentemente do POP3, o protocolo IMAP mantém os e-mails armazenados no servidor, permitindo a sincronização em múltiplos dispositivos.',
    correctOption: 0,
    explanation: 'CERTO. O IMAP sincroniza as mensagens com o servidor, mantendo-as disponíveis em qualquer dispositivo. Já o POP3, por padrão, baixa e apaga do servidor, vinculando os e-mails a um único dispositivo.',
  },
  {
    prompt: 'O protocolo HTTPS é uma versão segura do HTTP que utiliza criptografia (SSL/TLS) para proteger a transmissão de dados entre cliente e servidor.',
    correctOption: 0,
    explanation: 'CERTO. O HTTPS adiciona uma camada de segurança ao HTTP por meio do protocolo SSL/TLS, garantindo confidencialidade, integridade e autenticidade na comunicação web.',
  },
  {
    prompt: 'O FTP (File Transfer Protocol) é utilizado exclusivamente para o download de arquivos de um servidor, não sendo possível realizar upload por meio desse protocolo.',
    correctOption: 1,
    explanation: 'ERRADO. O FTP suporta tanto download (receber arquivos do servidor) quanto upload (enviar arquivos ao servidor). Sua função é a transferência de arquivos em ambas as direções.',
  },
  // CLASSIFICAÇÃO DAS REDES — ABRANGÊNCIA GEOGRÁFICA
  {
    prompt: 'Uma rede LAN (Local Area Network) pode interligar computadores localizados em diferentes países, desde que utilize cabos de fibra óptica de alta velocidade.',
    correctOption: 1,
    explanation: 'ERRADO. Uma LAN é definida pela sua abrangência geográfica limitada (um prédio, um andar, um campus). A tecnologia usada não altera a classificação. Redes entre países são WAN.',
  },
  {
    prompt: 'A tecnologia Bluetooth é tipicamente utilizada para criar redes do tipo PAN (Personal Area Network), com alcance de poucos metros.',
    correctOption: 0,
    explanation: 'CERTO. Redes PAN têm alcance pessoal (geralmente até 10 metros). O Bluetooth é o exemplo clássico: fone de ouvido, mouse, teclado sem fio — todos criam uma PAN ao redor do usuário.',
  },
  {
    prompt: 'A maior WAN (Wide Area Network) existente é a própria Internet, que conecta redes ao redor de todo o mundo.',
    correctOption: 0,
    explanation: 'CERTO. A Internet é, por definição, a maior WAN do mundo — uma rede de redes que interliga países e continentes usando infraestrutura de telecomunicações global.',
  },
  {
    prompt: 'Uma MAN (Metropolitan Area Network) é projetada para cobrir a área de um único edifício ou sala, sendo mais abrangente que uma LAN.',
    correctOption: 1,
    explanation: 'ERRADO. Uma MAN cobre uma cidade ou região metropolitana (daí o nome "Metropolitan"). Ela é maior que uma LAN (prédio/campus), mas menor que uma WAN (países/continentes).',
  },
  // EQUIPAMENTOS DE CONEXÃO
  {
    prompt: 'O Hub é um equipamento inteligente que encaminha os dados diretamente ao dispositivo de destino, otimizando o tráfego da rede e evitando colisões.',
    correctOption: 1,
    explanation: 'ERRADO. O Hub é um equipamento "burro": replica os dados para TODAS as portas (broadcast), causando colisões. Quem encaminha os dados ao destino correto (unicast) é o SWITCH.',
  },
  {
    prompt: 'O Switch (comutador) opera na camada de enlace do modelo OSI e utiliza endereços MAC para encaminhar quadros ao dispositivo de destino correto.',
    correctOption: 0,
    explanation: 'CERTO. O Switch trabalha na Camada 2 (Enlace) do modelo OSI, usando a tabela de endereços MAC para entregar os dados exatamente ao destinatário, sem transmitir para toda a rede.',
  },
  {
    prompt: 'Um roteador (router) tem a função de interligar redes distintas e determinar o melhor caminho para o encaminhamento dos pacotes de dados.',
    correctOption: 0,
    explanation: 'CERTO. O roteador opera na Camada 3 (Rede) do modelo OSI, usando endereços IP e tabelas de roteamento para interligar redes diferentes (ex: a rede interna de casa com a Internet da operadora).',
  },
  {
    prompt: 'O Switch e o Hub funcionam de forma idêntica no encaminhamento de dados, diferenciando-se apenas na velocidade de transmissão.',
    correctOption: 1,
    explanation: 'ERRADO. A diferença é fundamental: o Hub envia para TODOS (broadcast) sem inteligência, enquanto o Switch entrega SOMENTE ao destinatário correto (unicast), usando endereços MAC. São equipamentos com lógicas completamente distintas.',
  },
  // TOPOLOGIAS DE REDE
  {
    prompt: 'Na topologia estrela, se o cabo de rede de uma única estação de trabalho for danificado, toda a rede ficará inoperante.',
    correctOption: 1,
    explanation: 'ERRADO. Na topologia estrela, cada dispositivo tem seu próprio cabo ligado ao nó central (switch). Se um cabo quebrar, apenas aquela estação perde conectividade. A rede continua funcionando para os demais. (Atenção: se o nó CENTRAL falhar, aí sim toda a rede cai.)',
  },
  {
    prompt: 'Na topologia em anel (ring), os dados trafegam em uma única direção, passando sequencialmente por cada nó da rede até chegar ao destino.',
    correctOption: 0,
    explanation: 'CERTO. Na topologia anel, os dados percorrem um caminho circular em sentido único, passando por cada dispositivo da rede em sequência até alcançar o destinatário.',
  },
  {
    prompt: 'A topologia estrela é a mais utilizada nas redes locais modernas por oferecer fácil gerenciamento, isolamento de falhas e suporte à substituição de dispositivos sem interrupção da rede.',
    correctOption: 0,
    explanation: 'CERTO. A topologia estrela domina as LANs modernas por suas vantagens práticas: fácil identificação e isolamento de falhas, adição/remoção de dispositivos sem impacto nos demais e gerenciamento centralizado via switch.',
  },
  {
    prompt: 'Em uma topologia em anel simples (não redundante), a falha em um único nó não afeta o funcionamento dos demais dispositivos da rede.',
    correctOption: 1,
    explanation: 'ERRADO. Em um anel simples (sem redundância), a falha de um nó interrompe o caminho de comunicação, podendo comprometer toda a rede. Topologias em anel duplo (como FDDI) foram criadas justamente para contornar esse problema.',
  },
];
