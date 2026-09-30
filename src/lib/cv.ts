export type Formato = "simples" | "jovem" | "tradicional" | "moderno" | "executivo";

export const FORMATOS: { id: Formato; nome: string; desc: string }[] = [
  { id: "simples", nome: "Simples / Operacional", desc: "Direto ao ponto, fácil de ler" },
  { id: "jovem", nome: "Primeiro Emprego", desc: "Destaca estudos e qualidades" },
  { id: "tradicional", nome: "Tradicional", desc: "Clássico para escritório" },
  { id: "moderno", nome: "Moderno (Lateral)", desc: "Coluna lateral colorida" },
  { id: "executivo", nome: "Executivo", desc: "Sóbrio e elegante" },
];

export type Ramo = "comercio" | "logistica" | "servicos" | "obras" | "escritorio" | "primeiro";

export type Profissao = Ramo | "saude" | "educacao" | "tecnologia";

export const RAMOS: { id: Profissao; nome: string; emoji: string; cargo: string; formato: Formato; objetivo: string; qualidades: string; carta: string }[] = [
  {
    id: "comercio", nome: "Comércio", emoji: "🛒", cargo: "Atendente / Vendedor(a)", formato: "simples",
    objetivo: "Atuar como vendedor(a), atendente ou operador(a) de caixa, oferecendo um atendimento simpático e ajudando a loja a vender mais.",
    qualidades: "Simpatia no atendimento\nBoa comunicação\nPontualidade\nOrganização\nFacilidade com dinheiro e troco",
    carta: "Tenho facilidade em atender bem as pessoas, sou comunicativo(a) e gosto de ajudar o cliente a encontrar o que precisa. Sou pontual, organizado(a) e tenho disponibilidade de horário, inclusive fins de semana.",
  },
  {
    id: "logistica", nome: "Logística", emoji: "📦", cargo: "Auxiliar de Logística", formato: "simples",
    objetivo: "Trabalhar como auxiliar de logística, estoquista ou conferente, garantindo agilidade e organização na separação e entrega de mercadorias.",
    qualidades: "Agilidade\nAtenção aos detalhes\nDisposição física\nTrabalho em equipe\nResponsabilidade",
    carta: "Sou uma pessoa ágil, atenta e responsável. Tenho disposição para carga e descarga, separação e conferência de mercadorias, e trabalho bem em equipe. Tenho disponibilidade para turnos.",
  },
  {
    id: "servicos", nome: "Serviços Gerais", emoji: "🧹", cargo: "Auxiliar de Serviços Gerais", formato: "simples",
    objetivo: "Atuar em serviços gerais, limpeza ou portaria, mantendo o ambiente limpo, seguro e organizado.",
    qualidades: "Honestidade\nCapricho\nPontualidade\nDiscrição\nDisposição",
    carta: "Sou uma pessoa honesta, caprichosa e pontual. Tenho experiência em manter ambientes limpos e organizados e cumpro minhas tarefas com cuidado e responsabilidade.",
  },
  {
    id: "obras", nome: "Construção", emoji: "🧱", cargo: "Ajudante de Obras", formato: "simples",
    objetivo: "Trabalhar como ajudante, pedreiro ou servente de obras, contribuindo com dedicação e segurança no canteiro.",
    qualidades: "Força e disposição\nCuidado com segurança\nAprendo rápido\nPontualidade\nTrabalho em equipe",
    carta: "Tenho disposição para o trabalho pesado, respeito as normas de segurança e aprendo rápido com a equipe. Sou pontual e comprometido(a) com o serviço bem feito.",
  },
  {
    id: "escritorio", nome: "Escritório", emoji: "💼", cargo: "Auxiliar Administrativo", formato: "tradicional",
    objetivo: "Atuar como auxiliar administrativo ou recepcionista, apoiando a rotina do escritório com organização e bom atendimento.",
    qualidades: "Organização\nPacote Office básico\nBoa escrita\nAtendimento ao telefone\nProatividade",
    carta: "Sou organizado(a), tenho boa comunicação e conhecimento em informática básica (Word, Excel e e-mail). Gosto de manter a rotina em ordem e atender bem clientes e colegas.",
  },
  {
    id: "saude", nome: "Saúde", emoji: "🩺", cargo: "Auxiliar de Saúde", formato: "tradicional",
    objetivo: "Atuar na área da saúde, apoiando pacientes e a equipe com atenção, cuidado e respeito aos procedimentos da instituição.",
    qualidades: "Empatia e acolhimento\nAtenção aos detalhes\nOrganização\nDiscrição\nTrabalho em equipe",
    carta: "Tenho interesse em contribuir na área da saúde com atenção, empatia e responsabilidade. Sou organizado(a), discreto(a) e valorizo o cuidado humanizado com pacientes e familiares.",
  },
  {
    id: "educacao", nome: "Educação", emoji: "📚", cargo: "Auxiliar de Educação", formato: "moderno",
    objetivo: "Trabalhar na área da educação, colaborando com o aprendizado, a organização das atividades e o acolhimento dos alunos.",
    qualidades: "Paciência\nBoa comunicação\nCriatividade\nOrganização\nFacilidade para ensinar",
    carta: "Gosto de ajudar pessoas a aprender e tenho paciência, boa comunicação e organização. Quero colaborar com um ambiente acolhedor e com atividades que favoreçam o desenvolvimento dos alunos.",
  },
  {
    id: "tecnologia", nome: "Tecnologia", emoji: "💻", cargo: "Suporte de Tecnologia", formato: "moderno",
    objetivo: "Atuar na área de tecnologia ou suporte, ajudando a resolver problemas e aprender novas ferramentas para melhorar o trabalho da equipe.",
    qualidades: "Raciocínio lógico\nFacilidade com tecnologia\nVontade de aprender\nResolução de problemas\nTrabalho em equipe",
    carta: "Tenho facilidade com tecnologia, gosto de resolver problemas e aprendo novas ferramentas com rapidez. Sou responsável, colaborativo(a) e procuro explicar soluções de forma simples.",
  },
  {
    id: "primeiro", nome: "Primeiro Emprego", emoji: "🎓", cargo: "Jovem Aprendiz", formato: "jovem",
    objetivo: "Conquistar minha primeira oportunidade profissional, podendo aprender, crescer e contribuir com vontade e dedicação.",
    qualidades: "Vontade de aprender\nResponsabilidade\nFacilidade com celular e computador\nPontualidade\nBom relacionamento",
    carta: "Estou em busca da minha primeira oportunidade de trabalho. Mesmo sem experiência, tenho muita vontade de aprender, sou responsável e pontual, e me dou bem com as pessoas.",
  },
];

export type Curriculo = {
  nome: string; cargo: string; telefone: string; email: string; bairro: string; cidade: string; idade: string;
  objetivo: string; qualidades: string; experiencia: string; formacao: string; cursos: string; foto: string;
};

export const CV_VAZIO: Curriculo = {
  nome: "", cargo: "", telefone: "", email: "", bairro: "", cidade: "", idade: "",
  objetivo: "", qualidades: "", experiencia: "", formacao: "", cursos: "", foto: "",
};

export const CV_EXEMPLO: Curriculo = {
  nome: "Maria da Silva", cargo: "Atendente", telefone: "(11) 98765-4321", email: "maria@email.com",
  bairro: "Vila Mariana", cidade: "São Paulo - SP", idade: "34 anos",
  objetivo: RAMOS[0]!.objetivo, qualidades: RAMOS[0]!.qualidades,
  experiencia: "Mercado Bom Preço — Operadora de caixa (2019 - 2024)\nLoja Central — Vendedora (2016 - 2019)",
  formacao: "Ensino Médio Completo — E.E. Paulo Freire (2008)",
  cursos: "Atendimento ao Cliente — SENAC\nInformática Básica", foto: "",
};

export type Carta = { ramo: Profissao; nome: string; empresa: string; vaga: string; telefone: string };

export function textoCarta(c: Carta) {
  const r = RAMOS.find((x) => x.id === c.ramo) ?? RAMOS[0];
  if (!r) return "";
  return `Olá${c.empresa ? `, equipe ${c.empresa}` : ""}! Tudo bem?

Meu nome é ${c.nome || "[seu nome]"} e tenho interesse na vaga de ${c.vaga || "[vaga]"}.

${r.carta}

Envio meu currículo em anexo e fico à disposição para uma conversa ou entrevista quando for melhor para vocês.

Muito obrigado(a) pela atenção!
${c.nome || "[seu nome]"}${c.telefone ? `\nWhatsApp: ${c.telefone}` : ""}`;
}

export const lista = (s: string) => s.split("\n").map((l) => l.trim()).filter(Boolean);

// ============= Balões de sugestão de preenchimento =============

export type CampoSugestao = "cargo" | "objetivo" | "qualidades" | "experiencia" | "formacao" | "cursos";

const SUGESTOES_POR_RAMO: Partial<Record<Profissao, Partial<Record<CampoSugestao, string[]>>>> = {
  comercio: {
    objetivo: ["Gosto de atender bem as pessoas e ajudar a loja a vender mais."],
    qualidades: ["Simpatia no atendimento", "Facilidade com dinheiro e troco", "Disponibilidade de horário"],
    experiencia: ["Loja — Atendente (ano - ano)", "Mercado — Operador(a) de caixa (ano - ano)", "Padaria — Atendente (ano - ano)"],
  },
  logistica: {
    objetivo: ["Tenho disposição para trabalho físico e para turnos variados."],
    qualidades: ["Agilidade", "Atenção aos detalhes", "Disposição física"],
    experiencia: ["Distribuidora — Auxiliar de Logística (ano - ano)", "Depósito — Estoquista (ano - ano)"],
  },
  servicos: {
    objetivo: ["Cuido do ambiente com capricho, discrição e responsabilidade."],
    qualidades: ["Capricho", "Discrição", "Disposição"],
    experiencia: ["Condomínio/Escritório — Auxiliar de Limpeza (ano - ano)", "Casa de família — Diarista (dias combinados)"],
  },
  obras: {
    objetivo: ["Tenho disposição para o trabalho pesado e respeito as normas de segurança."],
    qualidades: ["Força e disposição", "Cuidado com segurança", "Aprendo rápido"],
    experiencia: ["Construtora — Ajudante de Obras (ano - ano)", "Reforma residencial — Servente (ano - ano)"],
  },
  escritorio: {
    objetivo: ["Tenho facilidade com computador e com rotinas administrativas."],
    qualidades: ["Pacote Office básico", "Boa escrita", "Proatividade", "Atendimento ao telefone"],
    experiencia: ["Empresa — Auxiliar Administrativo (ano - ano)", "Escritório — Recepcionista (ano - ano)"],
  },
  saude: {
    objetivo: ["Gosto de cuidar das pessoas com atenção, paciência e respeito."],
    qualidades: ["Empatia e acolhimento", "Discrição", "Atenção aos detalhes"],
    experiencia: ["Clínica/Laboratório — Auxiliar de Saúde (ano - ano)", "Hospital — Apoio administrativo (ano - ano)"],
  },
  educacao: {
    objetivo: ["Gosto de ajudar no aprendizado de crianças e jovens."],
    qualidades: ["Paciência", "Criatividade", "Facilidade para ensinar"],
    experiencia: ["Escola — Auxiliar de Educação (ano - ano)", "Curso/Reforço — Monitor(a) (ano - ano)"],
  },
  tecnologia: {
    objetivo: ["Tenho facilidade com tecnologia e gosto de resolver problemas."],
    qualidades: ["Raciocínio lógico", "Facilidade com tecnologia", "Resolução de problemas"],
    experiencia: ["Empresa — Suporte Técnico (ano - ano)", "Autônomo — Manutenção de computadores (ano - ano)"],
  },
  primeiro: {
    objetivo: ["Sou responsável e pontual, e quero mostrar meu melhor no primeiro emprego."],
    qualidades: ["Vontade de aprender", "Facilidade com celular e computador", "Bom relacionamento"],
    experiencia: ["Bazar/Feira — Vendedor(a) nos fins de semana", "Projeto da escola — Monitor(a) ou voluntário(a)"],
  },
};

const SUGESTOES_GERAIS: Record<CampoSugestao, string[]> = {
  cargo: RAMOS.map((r) => r.cargo),
  objetivo: [
    "Tenho disponibilidade de horário, inclusive fins de semana.",
    "Posso começar a trabalhar imediatamente.",
    "Procuro minha primeira oportunidade de trabalho.",
    "Quero crescer junto com a empresa e aprender cada dia mais.",
  ],
  qualidades: ["Pontualidade", "Responsabilidade", "Trabalho em equipe", "Boa comunicação", "Vontade de aprender", "Organização", "Honestidade", "Agilidade"],
  experiencia: ["Bicos e trabalhos informais (ano - ano)"],
  formacao: ["Ensino Fundamental Completo", "Ensino Médio Completo", "Ensino Médio — cursando", "Curso técnico completo"],
  cursos: ["Informática Básica", "Atendimento ao Cliente", "Segurança no Trabalho", "Excel Básico", "Vendas", "Primeiros Socorros"],
};

export function sugestoesDe(campo: CampoSugestao, ramo: Profissao | undefined): string[] {
  const especificas = (ramo && SUGESTOES_POR_RAMO[ramo]?.[campo]) ?? [];
  const vistas = new Set<string>();
  const saida: string[] = [];
  for (const sugestao of [...especificas, ...SUGESTOES_GERAIS[campo]]) {
    const chave = sugestao.toLowerCase();
    if (!vistas.has(chave)) {
      vistas.add(chave);
      saida.push(sugestao);
    }
  }
  return saida.slice(0, 9);
}
