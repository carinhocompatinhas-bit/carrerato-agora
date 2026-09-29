import { createOpenAI } from "@ai-sdk/openai";
import { NoObjectGeneratedError, Output, streamText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayRunIdFetch } from "./ai-run-id.server.ts";

const suggestionSchema = z.object({
  objetivo: z.string(),
  qualidades: z.array(z.string()),
  melhorias: z.array(z.string()),
});

export type JobSuggestions = z.infer<typeof suggestionSchema>;

function safeGatewayMessage(error: unknown) {
  const candidate = error as { statusCode?: number; status?: number; message?: string; responseBody?: string };
  const status = candidate.statusCode ?? candidate.status;
  let upstream = candidate.message ?? "";
  if (candidate.responseBody) {
    try {
      const parsed = JSON.parse(candidate.responseBody) as { message?: string; error?: { message?: string } };
      upstream = parsed.message ?? parsed.error?.message ?? upstream;
    } catch {
      // Keep the safe SDK message when the upstream body is not JSON.
    }
  }
  if (status === 401) return "A inteligência do app ainda não está configurada.";
  if (status === 402) return upstream || "Os créditos de inteligência do app acabaram.";
  if (status === 403) return upstream || "A inteligência do app está indisponível neste momento.";
  if (status === 429) return "Muitas análises foram pedidas agora. Aguarde um pouco e tente novamente.";
  if (status && status >= 500) return "A análise está temporariamente indisponível. Tente novamente mais tarde.";
  return upstream || "Não foi possível analisar esta vaga agora.";
}

export async function generateJobSuggestions(input: {
  descricaoVaga: string;
  cargo: string;
  objetivo: string;
  qualidades: string;
  experiencia: string;
  formacao: string;
  cursos: string;
}) {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("A inteligência do app ainda não está configurada.");

  const runIdFetch = createLovableAiGatewayRunIdFetch();
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: {
      "Lovable-API-Key": apiKey,
      "X-Lovable-AIG-SDK": "vercel-ai-sdk",
    },
    fetch: runIdFetch.fetch,
  });

  try {
    const result = streamText({
      model: provider.responses("openai/gpt-6-astra"),
      output: Output.object({ schema: suggestionSchema }),
      system: [
        "Você é um orientador de currículos para candidatos brasileiros.",
        "Compare a vaga somente com fatos já informados no currículo.",
        "Nunca invente experiência, formação, curso, ferramenta, resultado ou habilidade.",
        "Escreva em português do Brasil, com linguagem simples, direta e profissional.",
        "O objetivo deve ter no máximo 2 frases. Retorne de 3 a 6 qualidades relevantes e exatamente 3 melhorias práticas.",
        "Nas melhorias, explique lacunas com honestidade e não mande mentir ou copiar palavras sem comprovação.",
      ].join(" "),
      prompt: `DESCRIÇÃO DA VAGA\n${input.descricaoVaga}\n\nCURRÍCULO ATUAL\nCargo desejado: ${input.cargo || "não informado"}\nObjetivo: ${input.objetivo || "não informado"}\nQualidades: ${input.qualidades || "não informadas"}\nExperiência: ${input.experiencia || "não informada"}\nFormação: ${input.formacao || "não informada"}\nCursos: ${input.cursos || "não informados"}`,
      providerOptions: {
        openai: {
          forceReasoning: true,
          reasoningEffort: "medium",
          reasoningSummary: "auto",
          store: false,
          include: ["reasoning.encrypted_content"],
        },
      },
    });

    const output = await result.output;
    return {
      objetivo: output.objetivo.trim(),
      qualidades: output.qualidades.map((item) => item.trim()).filter(Boolean).slice(0, 6),
      melhorias: output.melhorias.map((item) => item.trim()).filter(Boolean).slice(0, 3),
    } satisfies JobSuggestions;
  } catch (error) {
    if (NoObjectGeneratedError.isInstance(error)) {
      throw new Error("A análise veio incompleta. Tente novamente.");
    }
    throw new Error(safeGatewayMessage(error));
  }
}