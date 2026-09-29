import { useEffect, useState } from "react";
import { Check, Lightbulb, LoaderCircle, Sparkles } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { suggestResumeForJob } from "@/lib/job-suggestions.functions";
import type { Curriculo } from "@/lib/cv";

type Suggestions = {
  objetivo: string;
  qualidades: string[];
  melhorias: string[];
};

export function JobTailoring({ cv, onChange }: { cv: Curriculo; onChange: (cv: Curriculo) => void }) {
  const [descricao, setDescricao] = useState("");
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestions | null>(null);

  useEffect(() => {
    setDescricao(localStorage.getItem("cf-vaga") ?? "");
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem("cf-vaga", descricao);
  }, [descricao, ready]);

  const analyze = async () => {
    if (descricao.trim().length < 40) {
      setError("Cole uma descrição de vaga um pouco mais completa.");
      return;
    }
    setLoading(true);
    setError("");
    setSuggestions(null);
    try {
      const result = await suggestResumeForJob({
        data: {
          descricaoVaga: descricao,
          cargo: cv.cargo,
          objetivo: cv.objetivo,
          qualidades: cv.qualidades,
          experiencia: cv.experiencia,
          formacao: cv.formacao,
          cursos: cv.cursos,
        },
      });
      setSuggestions(result);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Não foi possível analisar esta vaga agora.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-3">
      <div>
        <h2 className="step !mb-1">4. Ajustar para uma vaga</h2>
        <p className="text-[0.85em] text-muted-foreground">Cole o anúncio. A inteligência compara a vaga com o que você já informou, sem inventar experiência.</p>
      </div>
      <label className="block">
        <span className="font-semibold">Descrição da vaga</span>
        <textarea
          rows={6}
          maxLength={8000}
          className="mt-1 w-full rounded-xl border-2 border-input bg-background px-3 py-3 text-[1em] focus:border-primary focus:outline-none"
          value={descricao}
          placeholder="Cole aqui as atividades e os requisitos da vaga..."
          onChange={(event) => setDescricao(event.target.value)}
        />
      </label>
      <p className="text-[0.75em] text-muted-foreground">Só os dados profissionais são analisados. Sua foto e seus contatos não são enviados.</p>
      <Button type="button" className="min-h-14 w-full text-[0.95em] font-bold" onClick={analyze} disabled={loading}>
        {loading ? <LoaderCircle className="animate-spin" /> : <Sparkles />}
        {loading ? "Analisando a vaga..." : "Sugerir ajustes com IA"}
      </Button>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Não foi possível analisar</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {suggestions && (
        <div className="space-y-3 border-l-4 border-primary pl-3">
          <h3 className="font-display text-[1em] font-bold">Sugestões para esta vaga</h3>
          <div className="space-y-2">
            <p className="font-semibold">Objetivo sugerido</p>
            <p className="text-[0.85em] leading-relaxed">{suggestions.objetivo}</p>
            <Button type="button" variant="outline" className="min-h-11" onClick={() => onChange({ ...cv, objetivo: suggestions.objetivo })}>
              <Check /> Usar este objetivo
            </Button>
          </div>
          <div className="space-y-2 border-t pt-3">
            <p className="font-semibold">Qualidades mais relevantes</p>
            <ul className="space-y-1 text-[0.85em]">
              {suggestions.qualidades.map((item) => <li key={item}>• {item}</li>)}
            </ul>
            <Button type="button" variant="outline" className="min-h-11" onClick={() => onChange({ ...cv, qualidades: suggestions.qualidades.join("\n") })}>
              <Check /> Usar estas qualidades
            </Button>
          </div>
          <div className="space-y-2 border-t pt-3">
            <p className="flex items-center gap-2 font-semibold"><Lightbulb className="size-5 text-primary" /> O que pode melhorar</p>
            <ul className="space-y-2 text-[0.85em] leading-relaxed">
              {suggestions.melhorias.map((item) => <li key={item}>• {item}</li>)}
            </ul>
          </div>
          <Button type="button" className="min-h-12 w-full" onClick={() => onChange({ ...cv, objetivo: suggestions.objetivo, qualidades: suggestions.qualidades.join("\n") })}>
            <Check /> Aplicar objetivo e qualidades
          </Button>
        </div>
      )}
    </section>
  );
}