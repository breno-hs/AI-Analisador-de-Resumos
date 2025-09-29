// lib/pdf2img.ts

import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import pdfjsWorker from "pdfjs-dist/legacy/build/pdf.worker.min.mjs?url";

export interface PdfConversionResult {
  imageUrl: string;
  file: File | null;
  error?: string;
}

// Configura o worker corretamente
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export async function convertPdfToImage(
  file: File
): Promise<PdfConversionResult> {
  console.log("[pdf2img] Iniciando conversão do arquivo:", file.name);

  try {
    const arrayBuffer = await file.arrayBuffer();
    console.log(
      "[pdf2img] ArrayBuffer do PDF obtido. Tamanho:",
      arrayBuffer.byteLength
    );

    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    console.log(
      "[pdf2img] Documento PDF carregado. Número de páginas:",
      pdf.numPages
    );

    const page = await pdf.getPage(1);
    console.log("[pdf2img] Página 1 obtida");

    const viewport = page.getViewport({ scale: 4 });
    console.log(
      "[pdf2img] Viewport criado. Dimensões:",
      viewport.width,
      "x",
      viewport.height
    );

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      console.error("[pdf2img] Falha ao obter contexto 2D do canvas");
      return { imageUrl: "", file: null, error: "Canvas context nulo" };
    }

    canvas.width = viewport.width;
    canvas.height = viewport.height;
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";

    console.log("[pdf2img] Renderizando página no canvas...");
    await page.render({ canvasContext: context, viewport, canvas: canvas })
      .promise;
    console.log("[pdf2img] Renderização concluída");

    return new Promise((resolve) => {
      console.log("[pdf2img] Convertendo canvas para Blob...");
      canvas.toBlob(
        (blob) => {
          if (blob) {
            console.log(
              "[pdf2img] Blob criado com sucesso. Tamanho:",
              blob.size
            );
            const originalName = file.name.replace(/\.pdf$/i, "");
            const imageFile = new File([blob], `${originalName}.png`, {
              type: "image/png",
            });
            console.log(
              "[pdf2img] File criado:",
              imageFile.name,
              "tamanho:",
              imageFile.size
            );

            resolve({
              imageUrl: URL.createObjectURL(blob),
              file: imageFile,
            });
          } else {
            console.error("[pdf2img] Falha ao criar Blob a partir do canvas");
            resolve({
              imageUrl: "",
              file: null,
              error: "Failed to create image blob",
            });
          }
        },
        "image/png",
        1.0
      );
    });
  } catch (err) {
    console.error("[pdf2img] Erro na conversão:", err);
    return {
      imageUrl: "",
      file: null,
      error: `Failed to convert PDF: ${err}`,
    };
  }
}
