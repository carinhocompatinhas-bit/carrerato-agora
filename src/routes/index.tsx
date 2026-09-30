import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Camera, Trash2 } from "lucide-react";
import { JobTailoring } from "@/components/JobTailoring";
import { PhotoCropper } from "@/components/PhotoCropper";
import { ResumePreview } from "@/components/ResumePreview";
import { SugestoesBaloes } from "@/components/SugestoesBaloes";
import { Button } from "@/components/ui/button";
import {
  CV_EXEMPLO, FORMATOS, RAMOS, lista, textoCarta,
  type Carta, type Curriculo, type Formato, type CampoSugestao, type Profissao,
} from "@/lib/cv";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Currículo Fácil — Monte seu currículo pelo celular" },
      { name: "description", content: "Crie currículo e carta de apresentação em minutos, pelo celular. 5 modelos, preenchimento com 1 clique e envio pelo WhatsApp." },
      { property: "og:title", content: "Currículo Fácil — Monte seu currículo pelo celular" },
      { property: "og:description", content: "Currículo e carta de apresentação prontos em minutos, grátis. Envie em PDF ou pelo WhatsApp." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: App,
});

function usePersist<T>(key: string, init: T) {
  const [v, setV] = useState<T>(init);
  const [ok, setOk] = useState(false);
  useEffect(() => {
    try {
      const s = localStorage.getItem(key);
      if (s) {
        const salvo = JSON.parse(s) as unknown;
        // aceita só valores do mesmo tipo do padrão, para dados antigos não quebrarem o app
        if (init && typeof init === "object" && salvo && typeof salvo === "object" && !Array.isArray(salvo)) {
          const base = init as Record<string, unknown>;
          const out: Record<string, unknown> = { ...base };
          for (const [k, val] of Object.entries(salvo as Record<string, unknown>)) {
            if (!(k in base) || base[k] === undefined || typeof val === typeof base[k]) out[k] = val;
          }
          for (const k of Object.keys(out)) if (out[k] === null) out[k] = base[k] ?? "";
          setV(out as T);
        } else if (typeof salvo === typeof init) {
          if (typeof init === "number") {
            const n = salvo as number;
            setV((Number.isInteger(n) && n >= 0 && n <= 3 ? n : init) as T);
          } else setV(salvo as T);
        }
      }
    } catch {}
    setOk(true);
  }, [key]);
  useEffect(() => {
    if (!ok) return;
    try { localStorage.setItem(key, JSON.stringify(v)); } catch {}
  }, [key, v, ok]);
  return [v, setV] as const;
}

function Campo({ label, value, onChange, area, ph }: { label: string; value: string; onChange: (v: string) => void; area?: boolean; ph?: string }) {
  const cls = "mt-1 w-full rounded-xl border-2 border-input bg-background px-3 py-3 text-[1em] focus:border-primary focus:outline-none";
  return (
    <label className="block">
      <span className="font-semibold">{label}</span>
      {area
        ? <textarea rows={4} className={cls} value={value} placeholder={ph} onChange={(e) => onChange(e.target.value)} />
        : <input className={cls} value={value} placeholder={ph} onChange={(e) => onChange(e.target.value)} />}
    </label>
  );
}

function App() {
  const [aba, setAba] = useState<"cv" | "carta">("cv");
  const [cv, setCv] = usePersist<Curriculo>("cf-cv", CV_EXEMPLO);
  const [formato, setFormato] = usePersist<Formato>("cf-formato", "simples");
  const [carta, setCarta] = usePersist<Carta>("cf-carta", { ramo: "comercio", nome: "", empresa: "", vaga: "", telefone: "" });
  const [letra, setLetra] = usePersist<number>("cf-letra", 1);
  const [previa, setPrevia] = useState(false);
  const [erroFoto, setErroFoto] = useState("");
  const [fotoParaAjustar, setFotoParaAjustar] = useState("");
  const fotoInput = useRef<HTMLInputElement>(null);

  const up = (k: keyof Curriculo) => (v: string) => setCv({ ...cv, [k]: v });
  const txtCarta = textoCarta(carta);

  const ramoAtual: Profissao | undefined = RAMOS.find((r) => r.cargo === cv.cargo)?.id;

  const adicionarSugestao = (campo: CampoSugestao, texto: string) => {
    if (campo === "cargo") {
      setCv({ ...cv, cargo: texto });
      return;
    }
    const atual = (cv[campo] ?? "").trim();
    const novo = campo === "objetivo"
      ? atual ? `${atual}${/[.!?]$/.test(atual) ? "" : "."} ${texto}` : texto
      : atual ? `${atual}\n${texto}` : texto;
    setCv({ ...cv, [campo]: novo });
  };

  const baloes = (campo: CampoSugestao) => (
    <SugestoesBaloes campo={campo} valor={cv[campo] ?? ""} ramo={ramoAtual} onAdd={(texto) => adicionarSugestao(campo, texto)} />
  );

  const escolherProfissao = (id: (typeof RAMOS)[number]["id"]) => {
    const profissao = RAMOS.find((item) => item.id === id);
    if (!profissao) return;
    setCv({ ...cv, cargo: profissao.cargo, objetivo: profissao.objetivo, qualidades: profissao.qualidades });
    setFormato(profissao.formato);
  };

  const anexarFoto = (event: ChangeEvent<HTMLInputElement>) => {
    const arquivo = event.target.files?.[0];
    event.target.value = "";
    if (!arquivo) return;
    if (!arquivo.type.startsWith("image/")) {
      setErroFoto("Escolha uma imagem do celular.");
      return;
    }
    if (arquivo.size > 10 * 1024 * 1024) {
      setErroFoto("A foto deve ter no máximo 10 MB.");
      return;
    }
    const leitor = new FileReader();
    leitor.onload = () => {
      if (typeof leitor.result !== "string") return;
      setFotoParaAjustar(leitor.result);
      setErroFoto("");
    };
    leitor.onerror = () => setErroFoto("Não foi possível abrir esta foto.");
    leitor.readAsDataURL(arquivo);
  };

  const baixar = () => { setPrevia(true); setTimeout(() => window.print(), 300); };
  const whats = () => {
    const msg = aba === "carta"
      ? txtCarta
      : `Olá! Meu nome é ${cv.nome}. Tenho interesse em trabalhar com vocês como ${cv.cargo || "colaborador(a)"}.\n\n${cv.objetivo}\n\nQualidades: ${lista(cv.qualidades).join(", ")}.\n\nContato: ${cv.telefone}\nPosso enviar meu currículo em PDF. Obrigado(a)!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div style={{ fontSize: `${[15, 17, 20, 23][letra]}px` }} className="min-h-screen pb-32">
      <header className="no-print sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-4 py-3">
          <div className="min-w-0">
            <p className="truncate font-display text-[1.25em] font-bold leading-none">Currículo <span className="text-primary">Fácil</span></p>
            <p className="text-[0.7em] text-muted-foreground"><span className="text-primary">💾 Salvo automaticamente</span></p>
          </div>
          <div className="flex shrink-0 items-center gap-1" aria-label="Tamanho da letra">
            <button onClick={() => setLetra(Math.max(0, letra - 1))} disabled={letra === 0} aria-label="Diminuir letra" className="rounded-full border-2 border-foreground px-3 py-2 text-[0.8em] font-bold disabled:opacity-30">A−</button>
            <button onClick={() => setLetra(Math.min(3, letra + 1))} disabled={letra === 3} aria-label="Aumentar letra" className="rounded-full border-2 border-foreground bg-foreground px-3 py-2 text-[0.8em] font-bold text-background disabled:opacity-30">A+</button>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-2 px-4 pb-3">
          {(["cv", "carta"] as const).map((t) => (
            <button key={t} onClick={() => setAba(t)}
              className={`rounded-xl py-3 font-bold ${aba === t ? "bg-foreground text-background" : "bg-muted"}`}>
              {t === "cv" ? "📄 Currículo" : "✉️ Carta"}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto grid max-w-5xl gap-6 px-4 py-5 lg:grid-cols-2">
        <div className={`no-print space-y-5 ${previa ? "hidden lg:block" : ""}`}>
          {aba === "cv" ? (
            <>
              <section>
                <h2 className="step">1. Escolha o modelo</h2>
                <div className="grid grid-cols-2 gap-2">
                  {FORMATOS.map((f) => (
                    <button key={f.id} onClick={() => setFormato(f.id)}
                      className={`rounded-xl border-2 p-3 text-left ${formato === f.id ? "border-primary bg-accent" : "border-border"}`}>
                      <b className="block leading-tight">{f.nome}</b>
                      <span className="text-[0.75em] text-muted-foreground">{f.desc}</span>
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="step">2. Escolha sua profissão</h2>
                <p className="mb-2 text-[0.85em] text-muted-foreground">Um toque preenche a vaga, o objetivo, as qualidades e escolhe um modelo adequado. Você pode editar tudo depois.</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {RAMOS.map((r) => (
                    <Button key={r.id} variant="secondary" onClick={() => escolherProfissao(r.id)}
                      className="h-auto min-h-14 justify-start whitespace-normal px-3 py-3 text-left text-[0.85em] font-semibold active:scale-95">
                      <span aria-hidden="true">{r.emoji}</span><span>{r.nome}</span>
                    </Button>
                  ))}
                </div>
              </section>

              <section className="space-y-3">
                <h2 className="step">3. Seus dados</h2>
                <div className="rounded-lg border-2 border-dashed border-input p-3">
                  <p className="font-semibold">Foto (opcional)</p>
                  <p className="mb-3 text-[0.78em] text-muted-foreground">Escolha uma foto de rosto, bem iluminada e com fundo simples.</p>
                  <div className="flex items-center gap-3">
                    {cv.foto ? (
                      <img src={cv.foto} alt="Sua foto no currículo" className="aspect-square w-20 shrink-0 rounded-full border-2 border-border object-cover" />
                    ) : (
                      <div className="flex aspect-square w-20 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground" aria-hidden="true">
                        <Camera className="size-8" />
                      </div>
                    )}
                    <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row">
                      <Button type="button" variant="outline" className="h-11 whitespace-normal" onClick={() => fotoInput.current?.click()}>
                        <Camera /> {cv.foto ? "Trocar foto" : "Anexar foto"}
                      </Button>
                      {cv.foto && (
                        <Button type="button" variant="ghost" className="h-11 text-destructive" onClick={() => setCv({ ...cv, foto: "" })}>
                          <Trash2 /> Remover
                        </Button>
                      )}
                    </div>
                  </div>
                  <input ref={fotoInput} type="file" accept="image/*" capture="user" className="sr-only" onChange={anexarFoto} aria-label="Escolher foto para o currículo" />
                  {erroFoto && <p role="alert" className="mt-2 text-[0.78em] font-semibold text-destructive">{erroFoto}</p>}
                </div>
                <Campo label="Nome completo" value={cv.nome} onChange={up("nome")} />
                <Campo label="Vaga desejada" value={cv.cargo} onChange={up("cargo")} ph="Ex: Atendente" />
                <Campo label="Telefone / WhatsApp" value={cv.telefone} onChange={up("telefone")} />
                <Campo label="E-mail (opcional)" value={cv.email} onChange={up("email")} />
                <div className="grid grid-cols-2 gap-3">
                  <Campo label="Bairro" value={cv.bairro ?? ""} onChange={up("bairro")} ph="Ex: Vila Mariana" />
                  <Campo label="Cidade" value={cv.cidade} onChange={up("cidade")} ph="Ex: São Paulo - SP" />
                  <Campo label="Idade" value={cv.idade} onChange={up("idade")} />
                </div>
                <Campo area label="Objetivo" value={cv.objetivo} onChange={up("objetivo")} />
                <Campo area label="Qualidades (uma por linha)" value={cv.qualidades} onChange={up("qualidades")} />
                <Campo area label="Experiência (uma por linha)" value={cv.experiencia} onChange={up("experiencia")} ph="Empresa — Cargo (ano - ano)" />
                <Campo area label="Estudos" value={cv.formacao} onChange={up("formacao")} ph="Ensino Médio Completo" />
                <Campo area label="Cursos (opcional)" value={cv.cursos} onChange={up("cursos")} />
              </section>

              <JobTailoring cv={cv} onChange={setCv} />
            </>
          ) : (
            <section className="space-y-3">
              <h2 className="step">Carta de apresentação rápida</h2>
              <p className="text-[0.85em] text-muted-foreground">Escolha o ramo. A carta fica pronta, curta e direta.</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {RAMOS.map((r) => (
                  <button key={r.id} onClick={() => setCarta({ ...carta, ramo: r.id })}
                    className={`rounded-xl border-2 px-3 py-3 font-semibold ${carta.ramo === r.id ? "border-primary bg-accent" : "border-border"}`}>
                    {r.emoji} {r.nome}
                  </button>
                ))}
              </div>
              <Campo label="Seu nome" value={carta.nome} onChange={(v) => setCarta({ ...carta, nome: v })} />
              <Campo label="Vaga" value={carta.vaga} onChange={(v) => setCarta({ ...carta, vaga: v })} />
              <Campo label="Empresa (opcional)" value={carta.empresa} onChange={(v) => setCarta({ ...carta, empresa: v })} />
              <Campo label="Seu WhatsApp" value={carta.telefone} onChange={(v) => setCarta({ ...carta, telefone: v })} />
            </section>
          )}
        </div>

        <div className={`${previa ? "" : "hidden lg:block"} print-area`}>
          <div className="no-print mb-3 flex items-center justify-between">
            <h2 className="step !mb-0">Prévia</h2>
            <button onClick={() => setPrevia(false)} className="font-semibold text-primary underline lg:hidden">← Voltar e editar</button>
          </div>
          <div className="relative overflow-hidden rounded-lg shadow-xl" style={{ zoom: [0.9, 1, 1.15, 1.3][letra] }}>
            {aba === "cv"
              ? <ResumePreview cv={cv} formato={formato} />
              : <div className="cv-page whitespace-pre-line p-8 text-[13px] leading-relaxed text-cv-ink">{txtCarta}</div>}
          </div>
        </div>
      </main>

      <nav className="no-print fixed inset-x-0 bottom-0 z-40 border-t bg-background p-3">
        <div className="mx-auto grid max-w-5xl grid-cols-3 gap-2">
          <button onClick={() => setPrevia(!previa)} className="btn-big bg-muted lg:hidden">{previa ? "✏️ Editar" : "👁 Ver"}</button>
          <button onClick={baixar} className="btn-big bg-foreground text-background lg:col-span-2">⬇ PDF</button>
          <button onClick={whats} className="btn-big bg-primary text-primary-foreground lg:col-span-1">WhatsApp</button>
        </div>
      </nav>

      {fotoParaAjustar && (
        <PhotoCropper
          source={fotoParaAjustar}
          onCancel={() => setFotoParaAjustar("")}
          onSave={(foto) => {
            setCv((current) => ({ ...current, foto }));
            setFotoParaAjustar("");
          }}
        />
      )}
    </div>
  );
}
