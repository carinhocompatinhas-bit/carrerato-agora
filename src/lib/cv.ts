export type Formato = "simples" | "jovem" | "tradicional" | "moderno" | "executivo";

export const FORMATOS: { id: Formato; nome: string; desc: string }[] = [
  { id: "simples", nome: "Simples / Operacional", desc: "Direto ao ponto, fácil de ler" },
  { id: "jovem", nome: "Primeiro Emprego", desc: "Destaca estudos e qualidades" },
  { id: "tradicional", nome: "Tradicional", desc: "Clássico para escritório" },
  { id: "moderno", nome: "Moderno (Lateral)", desc: "Coluna lateral colorida" },
  { id: "executivo", nome: "Executivo", desc: "Sóbrio e elegante" },
];

export type Ramo = "comercio" | "logistica" | "servicos" | "obras" | "escritorio" | "primeiro";

export const RAMOS: { id: Ramo; nome: string; emoji: string; objetivo: string; qualidades: string; carta: string }[] = [
  {
    id: "comercio", nome: "Comércio", emoji: "🛒",
    objetivo: "Atuar como vendedor(a), atendente ou operador(a) de caixa, oferecendo um atendimento simpático e ajudando a loja a vender mais.",
    qualidades: "Simpatia no atendimento\nBoa comunicação\nPontualidade\nOrganização\nFacilidade com dinheiro e troco",
    carta: "Tenho facilidade em atender bem as pessoas, sou comunicativo(a) e gosto de ajudar o cliente a encontrar o que precisa. Sou pontual, organizado(a) e tenho disponibilidade de horário, inclusive fins de semana.",
  },
  {
    id: "logistica", nome: "Logística", emoji: "📦",
    objetivo: "Trabalhar como auxiliar de logística, estoquista ou conferente, garantindo agilidade e organização na separação e entrega de mercadorias.",
    qualidades: "Agilidade\nAtenção aos detalhes\nDisposição física\nTrabalho em equipe\nResponsabilidade",
    carta: "Sou uma pessoa ágil, atenta e responsável. Tenho disposição para carga e descarga, separação e conferência de mercadorias, e trabalho bem em equipe. Tenho disponibilidade para turnos.",
  },
  {
    id: "servicos", nome: "Serviços Gerais", emoji: "🧹",
    objetivo: "Atuar em serviços gerais, limpeza ou portaria, mantendo o ambiente limpo, seguro e organizado.",
    qualidades: "Honestidade\nCapricho\nPontualidade\nDiscrição\nDisposição",
    carta: "Sou uma pessoa honesta, caprichosa e pontual. Tenho experiência em manter ambientes limpos e organizados e cumpro minhas tarefas com cuidado e responsabilidade.",
  },
  {
    id: "obras", nome: "Obras", emoji: "🧱",
    objetivo: "Trabalhar como ajudante, pedreiro ou servente de obras, contribuindo com dedicação e segurança no canteiro.",
    qualidades: "Força e disposição\nCuidado com segurança\nAprendo rápido\nPontualidade\nTrabalho em equipe",
    carta: "Tenho disposição para o trabalho pesado, respeito as normas de segurança e aprendo rápido com a equipe. Sou pontual e comprometido(a) com o serviço bem feito.",
  },
  {
    id: "escritorio", nome: "Escritório", emoji: "💼",
    objetivo: "Atuar como auxiliar administrativo ou recepcionista, apoiando a rotina do escritório com organização e bom atendimento.",
    qualidades: "Organização\nPacote Office básico\nBoa escrita\nAtendimento ao telefone\nProatividade",
    carta: "Sou organizado(a), tenho boa comunicação e conhecimento em informática básica (Word, Excel e e-mail). Gosto de manter a rotina em ordem e atender bem clientes e colegas.",
  },
  {
    id: "primeiro", nome: "Primeiro Emprego", emoji: "🎓",
    objetivo: "Conquistar minha primeira oportunidade profissional, podendo aprender, crescer e contribuir com vontade e dedicação.",
    qualidades: "Vontade de aprender\nResponsabilidade\nFacilidade com celular e computador\nPontualidade\nBom relacionamento",
    carta: "Estou em busca da minha primeira oportunidade de trabalho. Mesmo sem experiência, tenho muita vontade de aprender, sou responsável e pontual, e me dou bem com as pessoas.",
  },
];

export type Curriculo = {
  nome: string; cargo: string; telefone: string; email: string; cidade: string; idade: string;
  objetivo: string; qualidades: string; experiencia: string; formacao: string; cursos: string;
};

export const CV_VAZIO: Curriculo = {
  nome: "", cargo: "", telefone: "", email: "", cidade: "", idade: "",
  objetivo: "", qualidades: "", experiencia: "", formacao: "", cursos: "",
};

export const CV_EXEMPLO: Curriculo = {
  nome: "Maria da Silva", cargo: "Atendente", telefone: "(11) 98765-4321", email: "maria@email.com",
  cidade: "São Paulo - SP", idade: "34 anos",
  objetivo: RAMOS[0]!.objetivo, qualidades: RAMOS[0]!.qualidades,
  experiencia: "Mercado Bom Preço — Operadora de caixa (2019 - 2024)\nLoja Central — Vendedora (2016 - 2019)",
  formacao: "Ensino Médio Completo — E.E. Paulo Freire (2008)",
  cursos: "Atendimento ao Cliente — SENAC\nInformática Básica",
};

export type Carta = { ramo: Ramo; nome: string; empresa: string; vaga: string; telefone: string };

export function textoCarta(c: Carta) {
  const r = RAMOS.find((x) => x.id === c.ramo)!;
  return `Olá${c.empresa ? `, equipe ${c.empresa}` : ""}! Tudo bem?

Meu nome é ${c.nome || "[seu nome]"} e tenho interesse na vaga de ${c.vaga || "[vaga]"}.

${r.carta}

Envio meu currículo em anexo e fico à disposição para uma conversa ou entrevista quando for melhor para vocês.

Muito obrigado(a) pela atenção!
${c.nome || "[seu nome]"}${c.telefone ? `\nWhatsApp: ${c.telefone}` : ""}`;
}

export const lista = (s: string) => s.split("\n").map((l) => l.trim()).filter(Boolean);

export const PRECO = "R$ 14,90";
