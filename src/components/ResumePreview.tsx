import { lista, type Curriculo, type Formato } from "@/lib/cv";

function Sec({ t, children, cls = "" }: { t: string; children: React.ReactNode; cls?: string }) {
  return (
    <section className="mb-4">
      <h3 className={`mb-1 text-[11px] font-bold uppercase tracking-widest ${cls}`}>{t}</h3>
      {children}
    </section>
  );
}

function Ul({ s }: { s: string }) {
  return (
    <ul className="space-y-0.5 text-[12px] leading-snug">
      {lista(s).map((l, i) => <li key={i}>• {l}</li>)}
    </ul>
  );
}

export function ResumePreview({ cv, formato }: { cv: Curriculo; formato: Formato }) {
  const contato = [cv.telefone, cv.email, cv.cidade, cv.idade].filter(Boolean);
  const nome = cv.nome || "Seu Nome";

  const corpo = (h: string) => (
    <>
      {cv.objetivo && <Sec t="Objetivo" cls={h}><p className="text-[12px] leading-snug">{cv.objetivo}</p></Sec>}
      {formato === "jovem" && cv.formacao && <Sec t="Formação" cls={h}><Ul s={cv.formacao} /></Sec>}
      {cv.experiencia && <Sec t={formato === "jovem" ? "Experiências" : "Experiência Profissional"} cls={h}><Ul s={cv.experiencia} /></Sec>}
      {formato !== "jovem" && cv.formacao && <Sec t="Formação" cls={h}><Ul s={cv.formacao} /></Sec>}
      {cv.cursos && <Sec t="Cursos" cls={h}><Ul s={cv.cursos} /></Sec>}
    </>
  );

  if (formato === "moderno") {
    return (
      <div className="cv-page grid grid-cols-[35%_1fr] text-cv-ink">
        <aside className="bg-primary p-5 text-primary-foreground">
          <h1 className="font-display text-xl font-bold leading-tight">{nome}</h1>
          <p className="mb-4 text-[12px] opacity-90">{cv.cargo}</p>
          <Sec t="Contato"><ul className="space-y-1 text-[11px] break-words">{contato.map((c) => <li key={c}>{c}</li>)}</ul></Sec>
          {cv.qualidades && <Sec t="Qualidades"><Ul s={cv.qualidades} /></Sec>}
        </aside>
        <div className="p-5">{corpo("text-primary")}</div>
      </div>
    );
  }

  const estilos: Record<string, { head: string; h: string; wrap: string }> = {
    simples: { head: "border-b-2 border-cv-ink pb-2 mb-4", h: "text-cv-ink", wrap: "" },
    jovem: { head: "rounded-lg bg-accent p-4 mb-4", h: "text-primary", wrap: "" },
    tradicional: { head: "text-center border-b border-cv-ink/40 pb-3 mb-4", h: "text-cv-ink border-b border-cv-ink/20 pb-0.5", wrap: "font-serif" },
    executivo: { head: "bg-cv-ink text-primary-foreground -mx-6 -mt-6 p-6 mb-5", h: "text-cv-ink tracking-[0.2em]", wrap: "" },
  };
  const e = estilos[formato] ?? estilos.simples!;

  return (
    <div className={`cv-page p-6 text-cv-ink ${e.wrap}`}>
      <header className={e.head}>
        <h1 className="font-display text-2xl font-bold leading-tight">{nome}</h1>
        {cv.cargo && <p className="text-[13px] font-semibold opacity-80">{cv.cargo}</p>}
        <p className="mt-1 text-[11px] opacity-80">{contato.join("  •  ")}</p>
      </header>
      {corpo(e.h)}
      {cv.qualidades && (
        <Sec t="Qualidades" cls={e.h}>
          <div className="flex flex-wrap gap-1.5 text-[11px]">
            {lista(cv.qualidades).map((q) => <span key={q} className="rounded border border-cv-ink/20 px-2 py-0.5">{q}</span>)}
          </div>
        </Sec>
      )}
    </div>
  );
}
