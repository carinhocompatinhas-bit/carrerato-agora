// Gera o PDF dentro do próprio aparelho. Assim o arquivo sai limpo,
// sem o título do site, sem endereço e sem número de página no topo.

/**
 * Procura uma linha em branco para cortar a página, evitando partir
 * uma frase ou um quadro ao meio quando o currículo tem mais de uma página.
 */
function linhaDeCorte(imagem: HTMLCanvasElement, ideal: number, minimo: number) {
  const contexto = imagem.getContext("2d");
  if (!contexto) return ideal;
  for (let y = ideal; y >= minimo; y--) {
    const linha = contexto.getImageData(0, y, imagem.width, 1).data;
    let emBranco = true;
    for (let p = 0; p < linha.length; p += 4) {
      const r = linha[p] ?? 255;
      const g = linha[p + 1] ?? 255;
      const b = linha[p + 2] ?? 255;
      if (r < 250 || g < 250 || b < 250) {
        emBranco = false;
        break;
      }
    }
    if (emBranco) return y;
  }
  return ideal;
}

function nomeDoArquivo(titulo: string, nome: string) {
  const base = `${titulo} - ${nome}`.trim().replace(/ - $/, "");
  const limpo = base
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9 _-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return `${limpo || titulo}.pdf`;
}

/**
 * Converte o elemento visível da prévia em um PDF A4 e inicia o download.
 * Lança erro se o elemento não estiver visível — quem chama decide o plano B.
 */
export async function baixarPdfDaPrevia(
  alvo: HTMLElement,
  titulo: string,
  nome: string,
): Promise<void> {
  if (!alvo.offsetWidth || !alvo.offsetHeight) {
    throw new Error("A prévia não está visível.");
  }

  // O zoom da tela muda o tamanho real do elemento; capturamos sempre em 1.
  const comZoom = alvo.closest("[style]") as HTMLElement | null;
  const zoomAnterior = comZoom?.style.zoom ?? "";
  if (comZoom && zoomAnterior) comZoom.style.zoom = "1";

  try {
    console.log("STEP1 imports-begin");
    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
      import("html2canvas-pro"),
      import("jspdf"),
    ]);

    console.log("STEP2 imports-done");
    if (document.fonts?.ready) await document.fonts.ready;
    console.log("STEP2b fonts-ready");

    const largura = alvo.offsetWidth;
    const escala = Math.min(4, Math.max(2, Math.round(1600 / largura)));

    console.log("STEP3 capture-begin");
    const imagem = await html2canvas(alvo, {
      scale: escala,
      backgroundColor: "#ffffff",
      useCORS: true,
      logging: false,
    });

    console.log("STEP4 capture-done");
    const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
    const larguraPagina = pdf.internal.pageSize.getWidth();
    const alturaPagina = pdf.internal.pageSize.getHeight();
    const pixelsPorPagina = Math.floor((imagem.width * alturaPagina) / larguraPagina);

    let topo = 0;
    let restante = imagem.height;
    let pagina = 0;

    while (restante > 0) {
      let alturaFatia = Math.min(pixelsPorPagina, restante);
      if (restante > alturaFatia) {
        const corte = linhaDeCorte(
          imagem,
          topo + alturaFatia - 1,
          topo + Math.floor(alturaFatia * 0.65),
        );
        if (corte > topo) alturaFatia = corte - topo;
      }
      const fatia = document.createElement("canvas");
      fatia.width = imagem.width;
      fatia.height = alturaFatia;
      const contexto = fatia.getContext("2d");
      if (!contexto) throw new Error("Não foi possível gerar o PDF.");
      contexto.fillStyle = "#ffffff";
      contexto.fillRect(0, 0, fatia.width, fatia.height);
      contexto.drawImage(
        imagem,
        0,
        topo,
        imagem.width,
        alturaFatia,
        0,
        0,
        imagem.width,
        alturaFatia,
      );

      if (pagina > 0) pdf.addPage();
      pdf.addImage(
        fatia.toDataURL("image/jpeg", 0.92),
        "JPEG",
        0,
        0,
        larguraPagina,
        (alturaFatia * larguraPagina) / imagem.width,
      );

      topo += alturaFatia;
      restante -= alturaFatia;
      pagina += 1;
    }

    console.log("STEP5 save-begin");
    pdf.save(nomeDoArquivo(titulo, nome));
    console.log("STEP6 save-done");
  } finally {
    if (comZoom && zoomAnterior) comZoom.style.zoom = zoomAnterior;
  }
}

/**
 * Plano B: imprime pela tela do navegador, mas com um título neutro
 * (o nome da pessoa) para o nome do site não aparecer no papel.
 */
export function imprimirPagina(nome: string) {
  const tituloAnterior = document.title;
  document.title = nome.trim() || "Currículo";
  const restaurar = () => {
    document.title = tituloAnterior;
    window.removeEventListener("afterprint", restaurar);
  };
  window.addEventListener("afterprint", restaurar);
  window.print();
  window.setTimeout(restaurar, 1500);
}
