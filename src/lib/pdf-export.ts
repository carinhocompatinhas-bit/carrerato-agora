// Gera o PDF dentro do próprio aparelho. Assim o arquivo sai limpo,
// sem o título do site, sem endereço e sem número de página no topo.

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
    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
      import("html2canvas-pro"),
      import("jspdf"),
    ]);

    if (document.fonts?.ready) await document.fonts.ready;

    const largura = alvo.offsetWidth;
    const escala = Math.min(4, Math.max(2, Math.round(1600 / largura)));

    const imagem = await html2canvas(alvo, {
      scale: escala,
      backgroundColor: "#ffffff",
      useCORS: true,
      logging: false,
    });

    const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
    const larguraPagina = pdf.internal.pageSize.getWidth();
    const alturaPagina = pdf.internal.pageSize.getHeight();
    const pixelsPorPagina = Math.floor((imagem.width * alturaPagina) / larguraPagina);

    let topo = 0;
    let restante = imagem.height;
    let pagina = 0;

    while (restante > 0) {
      const alturaFatia = Math.min(pixelsPorPagina, restante);
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

    pdf.save(nomeDoArquivo(titulo, nome));
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
