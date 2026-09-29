import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ResumePreview } from "@/components/ResumePreview";
import { PixCheckout } from "@/components/PixCheckout";
import {
  CV_EXEMPLO, FORMATOS, RAMOS, PRECO, lista, textoCarta,
  type Carta, type Curriculo, type Formato,
} from "@/lib/cv";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Currículo Fácil — Monte seu currículo pelo celular" },
      { name: "description", content: "Crie currículo e carta de apresentação em minutos, pelo celular. 5 modelos, preenchimento com 1 clique e envio pelo WhatsApp." },
      { property: "og:title", content: "Currículo Fácil — Monte seu currículo pelo celular" },
      { property: "og:description", content: "Currículo e carta de apresentação prontos em minutos. Pague uma vez via Pix e use para sempre." },
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
    const s = localStorage.getItem(key);
    if (s) try { setV(JSON.parse(s)); } catch {}
    setOk(true);
  }, [key]);
  useEffect(() => { if (ok) localStorage.setItem(key, JSON.stringify(v)); }, [key, v, ok]);
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
  const [pago, setPago] = usePersist<boolean>("cf-pago", false);
  const [letra, setLetra] = usePersist<number>("cf-letra", 0);
  const [checkout, setCheckout] = useState(false);
  const [previa, setPrevia] = useState(false);

  const up = (k: keyof Curriculo) => (v: string) => setCv({ ...cv, [k]: v });
  const txtCarta = textoCarta(carta);

  const exigir = (fn: () => void) => () => (pago ? fn() : setCheckout(true));
  const baixar = exigir(() => { setPrevia(true); setTimeout(() => window.print(), 300); });
  const whats = exigir(() => {
    const msg = aba === "carta"
      ? txtCarta
      : `Olá! Meu nome é ${cv.nome}. Tenho interesse em trabalhar com vocês como ${cv.cargo || "colaborador(a)"}.\n\n${cv.objetivo}\n\nQualidades: ${lista(cv.qualidades).join(", ")}.\n\nContato: ${cv.telefone}\nPosso enviar meu currículo em PDF. Obrigado(a)!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  });

  return (
    <div style={{ fontSize: `${[17, 20, 23][letra]}px` }} className="min-h-screen pb-32">
      <header className="no-print sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-4 py-3">
          <div className="min-w-0">
            <p className="truncate font-display text-[1.25em] font-bold leading-none">Currículo <span className="text-primary">Fácil</span></p>
            <p className="text-[0.7em] text-muted-foreground">{pago ? "✓ Versão completa" : "Teste grátis"}</p>
          </div>
          <button onClick={() => setLetra((letra + 1) % 3)} className="shrink-0 rounded-full border-2 border-foreground px-3 py-2 text-[0.8em] font-bold">
            A+ Aumentar Letra
          </button>
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
                <h2 className="step">2. Preencha com 1 clique</h2>
                <p className="mb-2 text-[0.85em] text-muted-foreground">Toque no seu ramo e o Objetivo e as Qualidades são preenchidos para você.</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {RAMOS.map((r) => (
                    <button key={r.id} onClick={() => setCv({ ...cv, objetivo: r.objetivo, qualidades: r.qualidades })}
                      className="rounded-xl bg-secondary px-3 py-3 font-semibold text-secondary-foreground active:scale-95">
                      {r.emoji} {r.nome}
                    </button>
                  ))}
                </div>
              </section>

              <section className="space-y-3">
                <h2 className="step">3. Seus dados</h2>
                <Campo label="Nome completo" value={cv.nome} onChange={up("nome")} />
                <Campo label="Vaga desejada" value={cv.cargo} onChange={up("cargo")} ph="Ex: Atendente" />
                <Campo label="Telefone / WhatsApp" value={cv.telefone} onChange={up("telefone")} />
                <Campo label="E-mail (opcional)" value={cv.email} onChange={up("email")} />
                <div className="grid grid-cols-2 gap-3">
                  <Campo label="Cidade" value={cv.cidade} onChange={up("cidade")} />
                  <Campo label="Idade" value={cv.idade} onChange={up("idade")} />
                </div>
                <Campo area label="Objetivo" value={cv.objetivo} onChange={up("objetivo")} />
                <Campo area label="Qualidades (uma por linha)" value={cv.qualidades} onChange={up("qualidades")} />
                <Campo area label="Experiência (uma por linha)" value={cv.experiencia} onChange={up("experiencia")} ph="Empresa — Cargo (ano - ano)" />
                <Campo area label="Estudos" value={cv.formacao} onChange={up("formacao")} ph="Ensino Médio Completo" />
                <Campo area label="Cursos (opcional)" value={cv.cursos} onChange={up("cursos")} />
              </section>
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
          <div className="relative overflow-hidden rounded-lg shadow-xl">
            {aba === "cv"
              ? <ResumePreview cv={cv} formato={formato} />
              : <div className="cv-page whitespace-pre-line p-8 text-[13px] leading-relaxed text-cv-ink">{txtCarta}</div>}
            {!pago && (
              <div className="no-print pointer-events-none absolute inset-0 flex items-center justify-center">
                <span className="-rotate-12 rounded bg-foreground/70 px-4 py-2 font-display text-lg font-bold text-background">PRÉVIA · TESTE GRÁTIS</span>
              </div>
            )}
          </div>
        </div>
      </main>

      <nav className="no-print fixed inset-x-0 bottom-0 z-40 border-t bg-background p-3">
        <div className="mx-auto grid max-w-5xl grid-cols-3 gap-2">
          <button onClick={() => setPrevia(!previa)} className="btn-big bg-muted lg:hidden">{previa ? "✏️ Editar" : "👁 Ver"}</button>
          <button onClick={baixar} className="btn-big bg-foreground text-background lg:col-span-2">⬇ PDF</button>
          <button onClick={whats} className="btn-big bg-primary text-primary-foreground lg:col-span-1">WhatsApp</button>
        </div>
        {!pago && (
          <button onClick={() => setCheckout(true)} className="mx-auto mt-2 block text-[0.8em] font-semibold text-primary underline">
            Liberar tudo por {PRECO} — pagamento único
          </button>
        )}
      </nav>

      {checkout && <PixCheckout onClose={() => setCheckout(false)} onPaid={() => setPago(true)} />}
    </div>
  );
}
