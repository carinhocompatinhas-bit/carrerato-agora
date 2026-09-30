import { Sparkles } from "lucide-react";
import { lista, sugestoesDe, type CampoSugestao, type Profissao } from "@/lib/cv";

export function SugestoesBaloes({ campo, valor, ramo, onAdd }: {
  campo: CampoSugestao;
  valor: string;
  ramo: Profissao | undefined;
  onAdd: (texto: string) => void;
}) {
  const chips = sugestoesDe(campo, ramo);
  const temCargo = campo === "cargo";
  const jaTem = (texto: string) =>
    temCargo
      ? valor.trim().toLowerCase() === texto.toLowerCase()
      : campo === "objetivo"
        ? valor.toLowerCase().includes(texto.toLowerCase())
        : lista(valor).some((linha) => linha.toLowerCase() === texto.toLowerCase());
  const visiveis = chips.filter((texto) => !jaTem(texto));
  if (visiveis.length === 0) return null;

  return (
    <div className="mt-1.5">
      <p className="mb-1 flex items-center gap-1.5 text-[0.75em] font-semibold text-muted-foreground">
        <Sparkles className="size-4 shrink-0 text-primary" aria-hidden="true" />
        {temCargo ? "Toque para escolher a vaga:" : "Toque para adicionar:"}
      </p>
      <div className="flex flex-wrap gap-2">
        {visiveis.map((texto) => (
          <button
            key={texto}
            type="button"
            onClick={() => onAdd(texto)}
            aria-label={`${temCargo ? "Escolher" : "Adicionar"}: ${texto}`}
            className="rounded-full border-2 border-input bg-secondary/60 px-3 py-1.5 text-left text-[0.8em] font-medium leading-snug text-secondary-foreground active:scale-95"
          >
            {texto}
          </button>
        ))}
      </div>
    </div>
  );
}
