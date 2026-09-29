import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { PRECO } from "@/lib/cv";

// Código Pix de demonstração — substituir pelo código real gerado pelo recebedor.
const PIX_CODE =
  "00020126580014BR.GOV.BCB.PIX0136chave-pix-exemplo-substituir52040000530398654051490 5802BR5913CURRICULO PRO6009SAO PAULO62070503***6304ABCD".replace(" ", "");

export function PixCheckout({ onClose, onPaid }: { onClose: () => void; onPaid: () => void }) {
  const [etapa, setEtapa] = useState<"oferta" | "pix" | "ok">("oferta");
  const [seg, setSeg] = useState(15 * 60);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    if (etapa !== "pix") return;
    const t = setInterval(() => setSeg((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [etapa]);

  const mm = String(Math.floor(seg / 60)).padStart(2, "0");
  const ss = String(seg % 60).padStart(2, "0");

  return (
    <div className="no-print fixed inset-0 z-50 flex items-end justify-center bg-foreground/60 sm:items-center" onClick={onClose}>
      <div className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-card p-6 sm:rounded-3xl" onClick={(e) => e.stopPropagation()}>
        {etapa === "oferta" && (
          <>
            <p className="text-sm font-bold uppercase tracking-wider text-primary">Oferta única</p>
            <h2 className="mt-1 font-display text-2xl font-bold leading-tight">
              Desbloqueie o App no seu celular por {PRECO}
            </h2>
            <ul className="mt-4 space-y-2 text-base">
              <li>✅ Pagamento único via Pix</li>
              <li>✅ Sem mensalidade</li>
              <li>✅ Crie quantos currículos e cartas quiser</li>
              <li>✅ Baixe em PDF e envie pelo WhatsApp</li>
            </ul>
            <button onClick={() => setEtapa("pix")} className="btn-big mt-6 w-full bg-primary text-primary-foreground">
              Pagar {PRECO} com Pix
            </button>
            <button onClick={onClose} className="mt-3 w-full py-2 text-muted-foreground underline">Agora não</button>
          </>
        )}

        {etapa === "pix" && (
          <>
            <h2 className="font-display text-2xl font-bold">Pague com Pix</h2>
            <p className="mt-1 text-muted-foreground">Valor: <b className="text-foreground">{PRECO}</b></p>
            <div className="mt-3 rounded-xl bg-accent p-3 text-center font-bold">
              ⏱ Código válido por {mm}:{ss}
            </div>
            <div className="mx-auto mt-4 w-fit rounded-xl bg-background p-3">
              <QRCodeSVG value={PIX_CODE} size={180} />
            </div>
            <p className="mt-4 text-sm font-semibold">Pix Copia e Cola:</p>
            <div className="mt-1 break-all rounded-lg border bg-muted p-2 text-xs">{PIX_CODE}</div>
            <button
              onClick={() => { navigator.clipboard.writeText(PIX_CODE); setCopiado(true); }}
              className="btn-big mt-3 w-full border-2 border-primary text-primary"
            >
              {copiado ? "Código copiado ✓" : "Copiar código Pix"}
            </button>
            <ol className="mt-4 list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
              <li>Abra o app do seu banco</li>
              <li>Escolha Pix → Copia e Cola (ou ler QR Code)</li>
              <li>Cole o código e confirme o pagamento</li>
            </ol>
            <button onClick={() => { setEtapa("ok"); onPaid(); }} disabled={seg === 0}
              className="btn-big mt-5 w-full bg-primary text-primary-foreground disabled:opacity-50">
              Já paguei — confirmar
            </button>
          </>
        )}

        {etapa === "ok" && (
          <div className="text-center">
            <div className="text-6xl">🎉</div>
            <h2 className="mt-2 font-display text-2xl font-bold">App desbloqueado!</h2>
            <p className="mt-2 text-muted-foreground">Agora você pode criar, baixar e enviar quantos currículos e cartas quiser.</p>
            <button onClick={onClose} className="btn-big mt-6 w-full bg-primary text-primary-foreground">Continuar</button>
          </div>
        )}
      </div>
    </div>
  );
}
