import type {
  Activity,
  Category,
  Challenge,
  GameEvent,
  MainKey,
  Phase,
  Reel,
  SleepOption,
  SubKey,
} from './types'

export const DAY_START = 7 * 60
export const DAY_END = 24 * 60
export const SLEEP_FROM = 19 * 60
export const REELS_PER_SPEEDUP = 4
export const MAX_AGE = 100

export const PHASES: Phase[] = [
  {
    id: 0,
    name: 'Bebê',
    ageLabel: '1 a 3 anos',
    minAge: 1,
    yearsPerSleep: 1,
    description:
      'Seus pais já te entregam o tablet para você ficar quiet{o|a}. Brinque, descanse e descubra o mundo.',
  },
  {
    id: 1,
    name: '1ª Infância',
    ageLabel: '3 a 6 anos',
    minAge: 3,
    yearsPerSleep: 1,
    description: 'Hora de correr, aprender as primeiras letras e fazer amigos na escolinha.',
  },
  {
    id: 2,
    name: '2ª Infância',
    ageLabel: '6 a 10 anos',
    minAge: 6,
    yearsPerSleep: 1,
    description: 'Começam as provas e os campeonatos. O celular fica cada vez mais interessante.',
  },
  {
    id: 3,
    name: 'Pré-adolescência',
    ageLabel: '10 a 13 anos',
    minAge: 10,
    yearsPerSleep: 1,
    description: 'Você pode criar conteúdo na web. Seguidores agora fazem parte da sua vida.',
  },
  {
    id: 4,
    name: 'Adolescência · Fundamental',
    ageLabel: '13 a 15 anos',
    minAge: 13,
    yearsPerSleep: 1,
    description: 'Apresentações, comparações e a pressão de estar sempre online.',
  },
  {
    id: 5,
    name: 'Adolescência · Médio',
    ageLabel: '15 a 18 anos',
    minAge: 15,
    yearsPerSleep: 1,
    description: 'Vestibular, primeiros trabalhos e decisões que moldam quem você será.',
  },
  {
    id: 6,
    name: 'Vida Adulta',
    ageLabel: '18 a 60 anos',
    minAge: 18,
    yearsPerSleep: 4,
    description:
      'Entrevistas de emprego, responsabilidades e e-mails fora de hora. Cada noite de sono passa 4 anos.',
  },
  {
    id: 7,
    name: '3ª Idade',
    ageLabel: '60 anos em diante',
    minAge: 60,
    yearsPerSleep: 2,
    description:
      'O corpo pede mais cuidado. Cada noite de sono passa 2 anos. Até onde você consegue chegar?',
  },
  {
    id: 8,
    name: 'Morte',
    ageLabel: 'Resumo',
    minAge: 999,
    yearsPerSleep: 0,
    description: 'O resumo da sua jornada.',
  },
]

export function phaseForAge(age: number): number {
  let phase = 0
  for (const p of PHASES.slice(0, 8)) {
    if (age >= p.minAge) phase = p.id
  }
  return phase
}

export const MAIN_LABELS: Record<MainKey, string> = {
  saude: 'Saúde',
  disposicao: 'Disposição',
  felicidade: 'Felicidade',
  dependencia: 'Dependência',
}

export const SUB_LABELS: Record<SubKey, string> = {
  foco: 'Foco',
  sanidade: 'Sanidade',
  forca: 'Força',
  inteligencia: 'Inteligência',
}

const scale = (base: number, step: number) => (phase: number) => base + step * phase

export const ACTIVITIES: Activity[] = [
  {
    id: 'exercicio',
    name: 'Exercício físico',
    description: 'Aumenta Saúde e Força, mas cansa um pouco.',
    minutes: 90,
    minPhase: 1,
    requirements: (p) => ({ forca: scale(8, 3)(p), foco: scale(8, 3)(p) }),
    effects: {
      main: { saude: 9, disposicao: -7, felicidade: 3 },
      sub: { forca: 4, foco: 1 },
    },
  },
  {
    id: 'estudar',
    name: 'Estudar',
    description: 'Aumenta Inteligência e Foco. Cansa um pouco e não é tão divertido.',
    minutes: 120,
    minPhase: 1,
    requirements: (p) => ({ inteligencia: scale(8, 3)(p), foco: scale(10, 3)(p) }),
    effects: {
      main: { disposicao: -3, felicidade: -2 },
      sub: { inteligencia: 5, foco: 6 },
    },
  },
  {
    id: 'socializar',
    name: 'Socializar',
    description: 'Aumenta Felicidade e Sanidade, diminui a Dependência.',
    minutes: 120,
    minPhase: 0,
    // Sem custo durante a fase Bebê (até os 3 anos).
    requirements: (p) => (p === 0 ? {} : { sanidade: scale(6, 3)(p) }),
    effects: {
      main: { felicidade: 11, dependencia: -7, disposicao: -4 },
      sub: { sanidade: 4 },
    },
  },
  {
    id: 'criar',
    name: 'Criar conteúdo na Web',
    description: 'Ganha seguidores. Quanto mais Foco, melhor o conteúdo.',
    minutes: 120,
    minPhase: 3,
    requirements: (p) => ({ foco: scale(15, 3)(p) }),
    effects: {
      main: { felicidade: 4, dependencia: 4, disposicao: -5 },
      sub: { foco: 1 },
    },
  },
  {
    id: 'descansar',
    name: 'Descansar',
    description: 'Um cochilo ou um tempo de silêncio. Recupera Disposição.',
    minutes: 60,
    minPhase: 0,
    requirements: () => ({}),
    effects: {
      main: { disposicao: 8, felicidade: 1 },
    },
  },
]

export const CHALLENGES: Challenge[] = [
  {
    id: 'prova',
    name: 'Prova da escola',
    description: 'Exige Inteligência e Foco.',
    phases: [2, 3, 4, 5],
    requires: ['inteligencia', 'foco'],
  },
  {
    id: 'apresentacao',
    name: 'Apresentação escolar',
    description: 'Exige Sanidade e Foco para falar em público.',
    phases: [3, 4, 5],
    requires: ['sanidade', 'foco'],
  },
  {
    id: 'campeonato',
    name: 'Campeonato de esportes',
    description: 'Exige Força e Foco.',
    phases: [2, 3, 4, 5, 6],
    requires: ['forca', 'foco'],
  },
  {
    id: 'entrevista',
    name: 'Entrevista de emprego',
    description: 'Exige Inteligência e Sanidade.',
    phases: [5, 6],
    requires: ['inteligencia', 'sanidade'],
  },
]

export const challengeThreshold = (phase: number) => 18 + 6 * phase

export interface CategoryInfo {
  label: string
  description: string
  effects: { main: Partial<Record<MainKey, number>>; sub: Partial<Record<SubKey, number>> }
  baseWeight: number
}

export const CATEGORIES: Record<Category, CategoryInfo> = {
  meme: {
    label: 'Memes',
    description: '+Felicidade, −Foco',
    effects: { main: { felicidade: 3, dependencia: 1.5 }, sub: { foco: -1 } },
    baseWeight: 1.2,
  },
  brainrot: {
    label: 'Brainrot',
    description: '++Felicidade, −−Foco, −Inteligência',
    effects: {
      main: { felicidade: 4, dependencia: 2.5, disposicao: -0.5 },
      sub: { foco: -2, inteligencia: -1 },
    },
    baseWeight: 1.3,
  },
  educativo: {
    label: 'Educativo',
    description: '+Inteligência, +Foco, pouca Felicidade, cansa',
    effects: {
      main: { felicidade: 0.5, dependencia: 0.5, disposicao: -1 },
      sub: { inteligencia: 2, foco: 0.5 },
    },
    baseWeight: 0.7,
  },
  amigos: {
    label: 'Amigos',
    description: '+Felicidade, +Sanidade',
    effects: { main: { felicidade: 2, dependencia: 1 }, sub: { sanidade: 1.5 } },
    baseWeight: 1,
  },
  lifestyle: {
    label: 'Vida perfeita',
    description: 'Comparação: −Felicidade, −Sanidade',
    effects: { main: { felicidade: -1, dependencia: 2 }, sub: { sanidade: -1.5 } },
    baseWeight: 1,
  },
  fitness: {
    label: 'Fitness',
    description: '+Força (inspiração), cansa',
    effects: {
      main: { felicidade: 1, dependencia: 1, disposicao: -0.5 },
      sub: { forca: 1.5 },
    },
    baseWeight: 0.8,
  },
  noticias: {
    label: 'Notícias',
    description: '+Inteligência, −Felicidade, −Sanidade',
    effects: {
      main: { felicidade: -2, dependencia: 1 },
      sub: { sanidade: -1.5, inteligencia: 0.5 },
    },
    baseWeight: 0.7,
  },
}

export const CATEGORY_ORDER: Category[] = [
  'meme',
  'brainrot',
  'educativo',
  'amigos',
  'lifestyle',
  'fitness',
  'noticias',
]

export const REELS: Reel[] = [
  { id: 'm1', category: 'meme', creator: '@memesdobr', caption: 'Quando a professora fala "é só uma pesquisinha" e são 40 páginas', likes: '1,2M' },
  { id: 'm2', category: 'meme', creator: '@gatoscaoticos', caption: 'Meu gato às 3 da manhã decidindo que é hora da corrida olímpica', likes: '890 mil' },
  { id: 'm3', category: 'meme', creator: '@tiozaodozap', caption: 'Bom dia! Já tomou seu café? (com 14 figurinhas de flor)', likes: '430 mil' },
  { id: 'm4', category: 'meme', creator: '@segunda.feira', caption: 'Eu prometendo que hoje vou dormir cedo vs. eu às 2h vendo isso aqui', likes: '2,4M' },
  { id: 'm5', category: 'meme', creator: '@vidadeestagiario', caption: 'O "rapidinho" do chefe que durou a tarde inteira', likes: '610 mil' },
  { id: 'b1', category: 'brainrot', creator: '@skibidi.lore', caption: 'TOP 10 momentos mais sigma do vaso sanitário cantor (parte 47)', likes: '5,1M' },
  { id: 'b2', category: 'brainrot', creator: '@satisfatorio.hd', caption: 'Sabonete sendo cortado + gameplay de corrida + narração de IA', likes: '3,3M' },
  { id: 'b3', category: 'brainrot', creator: '@npc.aura', caption: 'Ganhando +1000 de aura só piscando os olhos', likes: '2,8M' },
  { id: 'b4', category: 'brainrot', creator: '@corte.aleatorio', caption: 'Vídeo de 8 segundos que você vai assistir 6 vezes sem perceber', likes: '7,0M' },
  { id: 'b5', category: 'brainrot', creator: '@mewing.daily', caption: 'Rotina de mewing para mandíbula de herói (dia 312)', likes: '1,9M' },
  { id: 'e1', category: 'educativo', creator: '@ciencia.rapida', caption: 'Por que o céu é azul? A dispersão de Rayleigh em 60 segundos', likes: '320 mil' },
  { id: 'e2', category: 'educativo', creator: '@historiaemfoco', caption: 'Como a imprensa de Gutenberg mudou o mundo — e o que ela tem a ver com o seu feed', likes: '210 mil' },
  { id: 'e3', category: 'educativo', creator: '@mat.descomplicada', caption: 'O truque para fazer porcentagem de cabeça que a escola não te contou', likes: '540 mil' },
  { id: 'e4', category: 'educativo', creator: '@neuro.pop', caption: 'Dopamina: por que é tão difícil parar de rolar o feed?', likes: '780 mil' },
  { id: 'e5', category: 'educativo', creator: '@idiomas.ja', caption: '5 expressões em inglês que nativos usam todo dia', likes: '150 mil' },
  { id: 'a1', category: 'amigos', creator: '@seu.melhor.amigo', caption: 'Saudade daquela tarde no parque! Bora repetir no fim de semana?', likes: '48' },
  { id: 'a2', category: 'amigos', creator: '@prima.ju', caption: 'Formatura chegando! Obrigada a todo mundo que me apoiou', likes: '132' },
  { id: 'a3', category: 'amigos', creator: '@colega.da.turma', caption: 'Alguém tem a matéria de ontem? Perdi a aula', likes: '12' },
  { id: 'a4', category: 'amigos', creator: '@familia.unida', caption: 'Almoço de domingo na casa da vó. Faltou você!', likes: '27' },
  { id: 'l1', category: 'lifestyle', creator: '@vida.de.luxo', caption: 'Minha rotina das 5h: academia, smoothie de 80 reais e viagem para Bali', likes: '2,1M' },
  { id: 'l2', category: 'lifestyle', creator: '@corpo.perfeito', caption: 'Antes e depois em 30 dias (com filtro, mas não conta pra ninguém)', likes: '1,4M' },
  { id: 'l3', category: 'lifestyle', creator: '@milionario.aos.19', caption: 'Como fiquei rico com 19 anos (compre meu curso)', likes: '960 mil' },
  { id: 'l4', category: 'lifestyle', creator: '@casal.goals', caption: 'Mais um aniversário de namoro em Paris. Vocês também fazem isso, né?', likes: '1,8M' },
  { id: 'f1', category: 'fitness', creator: '@treino.em.casa', caption: 'Treino de 10 minutos sem equipamento para começar hoje', likes: '670 mil' },
  { id: 'f2', category: 'fitness', creator: '@corrida.de.rua', caption: 'Do sofá aos 5 km: o plano que funcionou para mim', likes: '310 mil' },
  { id: 'f3', category: 'fitness', creator: '@alongue.se', caption: 'Alongamento para quem passa o dia inteiro no celular', likes: '420 mil' },
  { id: 'n1', category: 'noticias', creator: '@urgente.agora', caption: 'URGENTE: especialistas alertam sobre crise (você não vai acreditar)', likes: '890 mil' },
  { id: 'n2', category: 'noticias', creator: '@jornal.digital', caption: 'Onda de calor bate recorde em várias capitais', likes: '240 mil' },
  { id: 'n3', category: 'noticias', creator: '@fato.ou.fake', caption: 'Checamos: aquela corrente do grupo da família é falsa', likes: '180 mil' },
]

export const EVENTS: GameEvent[] = [
  {
    id: 'tablet-bebe',
    title: 'O tablet dos pais',
    text: 'Seus pais estão cansados e te oferecem o tablet com desenhos para você ficar quietinh{o|a}.',
    phases: [0, 1],
    choices: [
      { label: 'Pegar o tablet', effects: { main: { felicidade: 6, dependencia: 8 } }, log: 'Você ficou hipnotizad{o|a} pelos desenhos no tablet.' },
      { label: 'Chorar até brincarem com você', effects: { main: { felicidade: 4, dependencia: -3, disposicao: -4 } }, log: 'Seus pais brincaram de esconde-esconde com você.' },
    ],
  },
  {
    id: 'curso-ingles',
    title: 'Curso de inglês',
    text: 'Sua mãe quer que você faça um curso de inglês. Vai ocupar parte do seu dia.',
    phases: [2, 3, 4, 5],
    choices: [
      { label: 'Fazer o curso', effects: { minutes: 90, main: { felicidade: -4, disposicao: -4 }, sub: { inteligencia: 7 } }, log: 'Você começou o curso de inglês. Hello, world!' },
      { label: 'Rejeitar', effects: { main: { felicidade: 3 }, sub: { sanidade: -2 } }, log: 'Você recusou o curso. Sua mãe ficou chateada.' },
    ],
  },
  {
    id: 'celular-novo',
    title: 'Primeiro celular',
    text: 'Seus pais querem te dar um celular só seu. O que você pede?',
    phases: [2, 3],
    choices: [
      { label: 'Aceitar o celular', effects: { main: { felicidade: 10, dependencia: 10 } }, log: 'Você ganhou seu primeiro celular. Notificações não param.' },
      { label: 'Pedir uma bicicleta', effects: { main: { felicidade: 6, saude: 4 }, sub: { forca: 4 } }, log: 'Você ganhou uma bicicleta e saiu pedalando pelo bairro.' },
    ],
  },
  {
    id: 'bola-rua',
    title: 'Convite para jogar bola',
    text: 'Seus amigos estão te chamando para jogar bola na rua. Mas aquele vídeo novo acabou de sair...',
    phases: [1, 2, 3, 4, 5],
    choices: [
      { label: 'Ir jogar', effects: { minutes: 90, main: { felicidade: 8, dependencia: -4, disposicao: -5 }, sub: { forca: 3 } }, log: 'Você jogou bola com os amigos e voltou suj{o|a} e feliz.' },
      { label: 'Ficar no celular', effects: { main: { dependencia: 5, felicidade: -2 }, sub: { sanidade: -2 } }, log: 'Você ficou no celular. Seus amigos postaram fotos do jogo.' },
    ],
  },
  {
    id: 'desafio-viral',
    title: 'Desafio viral perigoso',
    text: 'Um desafio arriscado está viralizando. Todo mundo da sua turma está postando.',
    phases: [3, 4, 5],
    choices: [
      { label: 'Participar e postar', effects: { followers: 120, main: { saude: -15, felicidade: 5, dependencia: 4 } }, log: 'Você se machucou no desafio, mas ganhou seguidores.' },
      { label: 'Não participar', effects: { sub: { sanidade: 3, inteligencia: 1 } }, log: 'Você preferiu não arriscar. Boa decisão.' },
    ],
  },
  {
    id: 'cyberbullying',
    title: 'Comentário maldoso',
    text: 'Alguém deixou um comentário cruel na sua última postagem. Outras pessoas estão curtindo.',
    phases: [3, 4, 5, 6],
    choices: [
      { label: 'Responder na mesma moeda', effects: { followers: 30, main: { felicidade: -6, dependencia: 3 }, sub: { sanidade: -5 } }, log: 'A briga nos comentários te deixou abalad{o|a}.' },
      { label: 'Bloquear e denunciar', effects: { sub: { sanidade: 2 } }, log: 'Você bloqueou e denunciou. Sua paz em primeiro lugar.' },
      { label: 'Conversar com alguém de confiança', effects: { minutes: 60, main: { felicidade: 3, dependencia: -2 }, sub: { sanidade: 5 } }, log: 'Conversar com alguém de confiança te ajudou muito.' },
    ],
  },
  {
    id: 'notificacoes',
    title: 'Notificações demais',
    text: 'Seu celular vibra a cada minuto. Você percebe que pega nele sem nem pensar.',
    phases: [3, 4, 5, 6, 7],
    choices: [
      { label: 'Desativar notificações', effects: { main: { dependencia: -7 }, sub: { foco: 3 } }, log: 'Você desativou as notificações. Que silêncio bom.' },
      { label: 'Deixar como está', effects: { main: { dependencia: 4, felicidade: 2 }, sub: { foco: -2 } }, log: 'Bzz. Bzz. Bzz. Você conferiu o celular de novo.' },
    ],
  },
  {
    id: 'jantar-familia',
    title: 'Jantar sem celular',
    text: 'Sua família propõe um jantar sem celulares na mesa.',
    phases: [1, 2, 3, 4, 5, 6, 7],
    choices: [
      { label: 'Topar', effects: { minutes: 60, main: { felicidade: 6, dependencia: -5 }, sub: { sanidade: 2 } }, log: 'O jantar foi cheio de risadas e histórias.' },
      { label: 'Levar o celular escondido', effects: { main: { felicidade: -3, dependencia: 3 } }, log: 'Você foi peg{o|a} no celular embaixo da mesa. Clima chato.' },
    ],
  },
  {
    id: 'publi',
    title: 'Proposta de publicidade',
    text: 'Uma marca quer pagar para você divulgar um produto que você nem conhece.',
    phases: [4, 5, 6],
    minFollowers: 300,
    choices: [
      { label: 'Aceitar a publi', effects: { followers: 200, main: { felicidade: 4, dependencia: 5 }, sub: { sanidade: -2 } }, log: 'A publi rendeu, mas alguns seguidores reclamaram.' },
      { label: 'Recusar', effects: { sub: { sanidade: 2, inteligencia: 1 } }, log: 'Você manteve a coerência com seu público.' },
    ],
  },
  {
    id: 'fake-news',
    title: 'Notícia bombástica',
    text: 'Chegou no grupo uma notícia chocante. Parece verdade... ou não?',
    phases: [4, 5, 6, 7],
    choices: [
      { label: 'Compartilhar na hora', effects: { followers: 40, main: { felicidade: -2 }, sub: { sanidade: -3, inteligencia: -2 } }, log: 'Era fake news. Você teve que pedir desculpas no grupo.' },
      { label: 'Checar a fonte', effects: { minutes: 30, sub: { inteligencia: 3 } }, log: 'Você checou: era falso. Avisou o grupo.' },
    ],
  },
  {
    id: 'ajudar-avo',
    title: 'Ajuda com o celular',
    text: 'Sua avó pede ajuda para fazer uma chamada de vídeo com a família.',
    phases: [2, 3, 4, 5, 6],
    choices: [
      { label: 'Ajudar com paciência', effects: { minutes: 45, main: { felicidade: 5 }, sub: { sanidade: 3 } }, log: 'Sua avó ficou radiante ao ver todo mundo na tela.' },
      { label: 'Dizer que está ocupad{o|a}', effects: { main: { felicidade: -2 } }, log: 'Você disse que estava ocupad{o|a}. Ficou um aperto no peito.' },
    ],
  },
  {
    id: 'detox',
    title: 'Desafio do detox digital',
    text: 'Um amigo propõe um fim de semana inteiro sem redes sociais.',
    phases: [4, 5, 6, 7],
    choices: [
      { label: 'Aceitar o detox', effects: { main: { dependencia: -12, felicidade: -4 }, sub: { sanidade: 5, foco: 4 } }, log: 'Foi difícil no começo, mas sua cabeça ficou leve.' },
      { label: 'Recusar', effects: { main: { dependencia: 2 } }, log: 'Você achou que não daria conta de ficar offline.' },
    ],
  },
  {
    id: 'email-noite',
    title: 'E-mail fora de hora',
    text: 'Seu chefe mandou mensagem às 22h pedindo "só uma coisinha".',
    phases: [6],
    choices: [
      { label: 'Responder na hora', effects: { minutes: 60, main: { disposicao: -6, felicidade: -2 }, sub: { inteligencia: 2 } }, log: 'Você resolveu a "coisinha". Mais uma hora de trabalho.' },
      { label: 'Desconectar e responder amanhã', effects: { main: { felicidade: 3 }, sub: { sanidade: 3 } }, log: 'Você respeitou seu tempo de descanso.' },
    ],
  },
  {
    id: 'netos',
    title: 'Os netos e a rede social',
    text: 'Seus netos querem te ensinar a usar a rede social do momento.',
    phases: [7],
    choices: [
      { label: 'Aprender a usar', effects: { main: { felicidade: 6, dependencia: 4 } }, log: 'Você descobriu os vídeos de receita. E eles não acabam nunca.' },
      { label: 'Preferir uma ligação', effects: { main: { felicidade: 4 }, sub: { sanidade: 3 } }, log: 'Vocês conversaram por uma hora ao telefone.' },
    ],
  },
  {
    id: 'check-up',
    title: 'Check-up médico',
    text: 'O médico recomenda caminhadas diárias e menos tempo de tela à noite.',
    phases: [6, 7],
    choices: [
      { label: 'Seguir a recomendação', effects: { minutes: 60, main: { saude: 8, dependencia: -3 } }, log: 'As caminhadas fizeram bem ao seu coração.' },
      { label: 'Ignorar', effects: { main: { saude: -5 } }, log: 'Você ignorou o médico. O corpo sentiu.' },
    ],
  },
  {
    id: 'jogo-online',
    title: 'Maratona de jogo online',
    text: 'Seus amigos te chamam para jogar online até de madrugada. "Só mais uma partida, mano!"',
    phases: [2, 3, 4, 5],
    genders: ['homem'],
    choices: [
      { label: 'Jogar a noite toda', effects: { minutes: 120, main: { felicidade: 7, dependencia: 6, disposicao: -10 }, sub: { foco: -2 } }, log: 'Você jogou até tarde com os amigos. Os olhos ardem.' },
      { label: 'Chamar para jogar bola', effects: { minutes: 90, main: { felicidade: 6, dependencia: -4, disposicao: -4 }, sub: { forca: 3, sanidade: 2 } }, log: 'Vocês trocaram o videogame por uma pelada na quadra.' },
    ],
  },
  {
    id: 'coach-alfa',
    title: 'O coach da internet',
    text: 'Um "coach" promete te transformar em um "homem de alto valor" com um curso de R$ 997 e regras rígidas.',
    phases: [4, 5, 6],
    genders: ['homem'],
    choices: [
      { label: 'Comprar o curso', effects: { main: { felicidade: -3, dependencia: 5 }, sub: { sanidade: -5, inteligencia: -2 } }, log: 'O curso era só mais conteúdo para te prender na tela.' },
      { label: 'Desconfiar e ignorar', effects: { sub: { sanidade: 3, inteligencia: 2 } }, log: 'Você percebeu o golpe e seguiu sua vida.' },
      { label: 'Conversar com seu pai', effects: { minutes: 45, main: { felicidade: 4, dependencia: -2 }, sub: { sanidade: 4 } }, log: 'Seu pai contou que ser homem é cuidar de quem você ama.' },
    ],
  },
  {
    id: 'filtro-beleza',
    title: 'O filtro perfeito',
    text: 'Suas amigas estão postando selfies com um filtro que muda o rosto inteiro. Você se sente pressionada a fazer o mesmo.',
    phases: [3, 4, 5, 6],
    genders: ['mulher'],
    choices: [
      { label: 'Postar com filtro', effects: { followers: 40, main: { felicidade: 3, dependencia: 4 }, sub: { sanidade: -5 } }, log: 'A foto bombou, mas você não se reconheceu no espelho.' },
      { label: 'Postar sem filtro', effects: { followers: 10, main: { felicidade: 4 }, sub: { sanidade: 5 } }, log: 'Você postou do seu jeito e recebeu carinho de verdade.' },
    ],
  },
  {
    id: 'time-volei',
    title: 'Time de vôlei',
    text: 'As meninas da escola estão montando um time de vôlei e te chamaram para o primeiro treino.',
    phases: [2, 3, 4, 5],
    genders: ['mulher'],
    choices: [
      { label: 'Entrar no time', effects: { minutes: 90, main: { felicidade: 7, dependencia: -4, disposicao: -5 }, sub: { forca: 4, sanidade: 2 } }, log: 'Você entrou no time e fez novas amigas.' },
      { label: 'Ficar vendo vídeos', effects: { main: { dependencia: 4, felicidade: -1 }, sub: { sanidade: -2 } }, log: 'Você ficou em casa vendo os stories do treino.' },
    ],
  },
  ...badLuckEvents(),
]

function badLuckEvents(): GameEvent[] {
  return [
    {
      id: 'tombo',
      bad: true,
      title: 'Tombo feio',
      text: 'Você tropeçou e caiu de mal jeito. Está doendo bastante.',
      phases: [0, 1, 2, 7],
      choices: [
        { label: 'Pedir colo / ajuda', effects: { minutes: 60, main: { saude: -6, felicidade: -3 } }, log: 'Você se machucou, mas teve quem cuidasse de você.' },
        { label: 'Fingir que não doeu', effects: { main: { saude: -11 }, sub: { sanidade: -2 } }, log: 'Você engoliu o choro. O machucado piorou.' },
      ],
    },
    {
      id: 'gripe',
      bad: true,
      title: 'Gripe forte',
      text: 'Febre, nariz entupido e o corpo todo doendo. Hoje não vai ser um dia fácil.',
      phases: [1, 2, 3, 4, 5, 6, 7],
      choices: [
        { label: 'Ficar de repouso', effects: { minutes: 180, main: { saude: -5, disposicao: -8, felicidade: -4 } }, log: 'Você passou horas de cama, se recuperando.' },
        { label: 'Seguir o dia mesmo assim', effects: { main: { saude: -13, disposicao: -6 }, sub: { foco: -3 } }, log: 'Você forçou o corpo doente. A gripe piorou.' },
      ],
    },
    {
      id: 'briga-casa',
      bad: true,
      title: 'Briga em casa',
      text: 'O clima em casa esquentou. Todo mundo está gritando.',
      phases: [2, 3, 4, 5, 6],
      choices: [
        { label: 'Discutir de volta', effects: { main: { felicidade: -9 }, sub: { sanidade: -6 } }, log: 'A discussão foi longe demais. Ninguém saiu bem.' },
        { label: 'Se trancar com o celular', effects: { main: { felicidade: -3, dependencia: 8 }, sub: { sanidade: -2 } }, log: 'Você fugiu para o feed até a poeira baixar.' },
      ],
    },
    {
      id: 'boletim',
      bad: true,
      title: 'Boletim vermelho',
      text: 'As notas chegaram. Tem vermelho onde não deveria ter.',
      phases: [2, 3, 4, 5],
      choices: [
        { label: 'Encarar a bronca', effects: { main: { felicidade: -8 }, sub: { sanidade: -3, inteligencia: 1 } }, log: 'A bronca doeu, mas você prometeu estudar mais.' },
        { label: 'Esconder o boletim', effects: { main: { felicidade: -3 }, sub: { sanidade: -7, foco: -2 } }, log: 'Esconder o boletim te deixou com a cabeça a mil.' },
      ],
    },
    {
      id: 'insonia',
      bad: true,
      title: 'Noite em claro',
      text: 'Você não pregou o olho na noite passada. A cabeça não desliga.',
      phases: [3, 4, 5, 6, 7],
      choices: [
        { label: 'Rolar o feed até dar sono', effects: { main: { disposicao: -12, dependencia: 6 }, sub: { foco: -2 } }, log: 'O feed só te deixou mais acordad{o|a}.' },
        { label: 'Encarar o cansaço', effects: { main: { disposicao: -9, felicidade: -5 }, sub: { sanidade: -2 } }, log: 'Você arrastou o dia inteiro de tanto sono.' },
      ],
    },
    {
      id: 'celular-quebrou',
      bad: true,
      title: 'Celular quebrou',
      text: 'A tela estilhaçou no chão. Sem celular, de repente.',
      phases: [3, 4, 5, 6, 7],
      choices: [
        { label: 'Comprar outro parcelado', effects: { main: { felicidade: -6, dependencia: 3 }, sub: { sanidade: -3 } }, log: 'Celular novo, boleto novo. A preocupação ficou.' },
        { label: 'Ficar sem por um tempo', effects: { main: { felicidade: -10, dependencia: -6, disposicao: -3 } }, log: 'A abstinência bateu forte, mas você sobreviveu.' },
      ],
    },
    {
      id: 'print-vazado',
      bad: true,
      title: 'Print vazado',
      text: 'Uma conversa sua vazou e está circulando nos grupos. Todo mundo está comentando.',
      phases: [4, 5, 6],
      choices: [
        { label: 'Explicar publicamente', effects: { followers: -40, main: { felicidade: -6 }, sub: { sanidade: -5 } }, log: 'Sua explicação virou meme. Perdeu seguidores.' },
        { label: 'Sumir das redes', effects: { followers: -90, main: { felicidade: -8, dependencia: -4 } }, log: 'Você sumiu por uns dias. Muita gente deixou de seguir.' },
      ],
    },
    {
      id: 'crise-ansiedade',
      bad: true,
      title: 'Crise de ansiedade',
      text: 'O coração dispara, as mãos suam. Parece que tudo está acontecendo ao mesmo tempo.',
      phases: [4, 5, 6, 7],
      choices: [
        { label: 'Parar e pedir ajuda', effects: { minutes: 90, main: { felicidade: -4, disposicao: -5 }, sub: { sanidade: -2 } }, log: 'Você parou tudo e pediu ajuda. Levou tempo para passar.' },
        { label: 'Fingir que está tudo bem', effects: { main: { felicidade: -6 }, sub: { sanidade: -8, foco: -3 } }, log: 'Você segurou tudo sozinh{o|a}. A crise deixou marcas.' },
      ],
    },
    {
      id: 'aposta',
      bad: true,
      title: 'Anúncio de aposta',
      text: 'Seu influenciador favorito divulga um app de apostas com "bônus garantido".',
      phases: [5, 6],
      choices: [
        { label: 'Fazer só uma aposta', effects: { main: { felicidade: -7, dependencia: 10 }, sub: { sanidade: -5 } }, log: 'Você perdeu e quis tentar de novo. E de novo.' },
        { label: 'Desinstalar na hora', effects: { main: { felicidade: -3 }, sub: { foco: -1 } }, log: 'Você resistiu, mas o anúncio não sai da cabeça.' },
      ],
    },
    {
      id: 'golpe',
      bad: true,
      title: 'Golpe na internet',
      text: 'Aquele link do "prêmio" era golpe. Seus dados e seu dinheiro foram embora.',
      phases: [5, 6, 7],
      choices: [
        { label: 'Correr atrás do prejuízo', effects: { minutes: 120, main: { disposicao: -9, felicidade: -6 } }, log: 'Horas no telefone com o banco. Recuperou uma parte.' },
        { label: 'Deixar pra lá', effects: { main: { felicidade: -11 }, sub: { sanidade: -4 } }, log: 'Você engoliu o prejuízo. A raiva ficou.' },
      ],
    },
    {
      id: 'demissao',
      bad: true,
      title: 'Corte na empresa',
      text: 'A empresa anunciou cortes e seu nome estava na lista.',
      phases: [6],
      choices: [
        { label: 'Procurar outro emprego', effects: { minutes: 180, main: { disposicao: -10, felicidade: -8 }, sub: { sanidade: -3 } }, log: 'Você mandou dezenas de currículos. O silêncio pesa.' },
        { label: 'Se afundar nos vídeos', effects: { main: { felicidade: -4, dependencia: 10 }, sub: { foco: -4 } }, log: 'Você passou o dia rolando o feed para não pensar.' },
      ],
    },
    {
      id: 'burnout',
      bad: true,
      title: 'Esgotamento',
      text: 'Trabalho, notificações, cobranças. Seu corpo e sua mente pedem socorro.',
      phases: [6, 7],
      choices: [
        { label: 'Tirar o dia de folga', effects: { minutes: 240, main: { saude: -3, felicidade: -3 } }, log: 'Você parou, mas a culpa de parar não te deixou descansar.' },
        { label: 'Continuar no automático', effects: { main: { saude: -10, disposicao: -14 }, sub: { sanidade: -5 } }, log: 'Você seguiu no automático até não sentir mais nada.' },
      ],
    },
    {
      id: 'dor-costas',
      bad: true,
      title: 'Dor nas costas',
      text: 'Anos curvad{o|a} sobre a tela cobraram a conta. Suas costas travaram.',
      phases: [6, 7],
      choices: [
        { label: 'Ir ao fisioterapeuta', effects: { minutes: 120, main: { saude: -3, disposicao: -6 } }, log: 'A sessão doeu, mas aliviou um pouco.' },
        { label: 'Ignorar a dor', effects: { main: { saude: -9 }, sub: { forca: -4 } }, log: 'A dor virou companhia constante.' },
      ],
    },
  ]
}

export const SLEEP_OPTIONS: SleepOption[] = [
  {
    id: 'cancao',
    name: 'Ouvir canção de ninar',
    description: '+Felicidade e +Disposição',
    phases: [0, 1],
    conflictsWith: ['tablet'],
    effects: { main: { felicidade: 4, disposicao: 4 } },
  },
  {
    id: 'tablet',
    name: 'Dormir com o tablet',
    description: '+Felicidade, −Disposição, +Dependência',
    phases: [0, 1],
    conflictsWith: ['cancao'],
    effects: { main: { felicidade: 6, dependencia: 5 } },
    disposicaoGainModifier: -12,
  },
  {
    id: 'feed',
    name: 'Rolar o feed na cama',
    description: '++Felicidade, −−Disposição, +Dependência',
    phases: [2, 3, 4, 5, 6, 7],
    conflictsWith: ['celular-fora'],
    effects: { main: { felicidade: 9, dependencia: 6 } },
    disposicaoGainModifier: -18,
  },
  {
    id: 'livro',
    name: 'Ler um livro',
    description: '+Inteligência e +Disposição',
    phases: [2, 3, 4, 5, 6, 7],
    effects: { main: { felicidade: 2 }, sub: { inteligencia: 3 } },
    disposicaoGainModifier: 5,
  },
  {
    id: 'meditar',
    name: 'Meditar / respirar',
    description: '+Sanidade, −Dependência',
    phases: [3, 4, 5, 6, 7],
    effects: { main: { felicidade: 2, dependencia: -3 }, sub: { sanidade: 3 } },
  },
  {
    id: 'celular-fora',
    name: 'Deixar o celular fora do quarto',
    description: '−Dependência, +Disposição, um pouco menos Felicidade',
    phases: [2, 3, 4, 5, 6, 7],
    conflictsWith: ['feed'],
    effects: { main: { dependencia: -5, felicidade: -3 } },
    disposicaoGainModifier: 8,
  },
]

export const HEALTHY_TIPS = [
  'Defina horários para usar as redes e respeite-os.',
  'Desative notificações que não são essenciais.',
  'Siga perfis que te ensinam algo ou que te fazem bem.',
  'O feed aprende com você: escolha conscientemente o que assiste.',
  'Comparar sua vida com a "vida perfeita" dos outros é injusto com você.',
  'Encontros presenciais reduzem a dependência digital.',
  'Deixe o celular longe da cama para dormir melhor.',
]
