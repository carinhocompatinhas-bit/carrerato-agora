import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { generateJobSuggestions } from "./job-suggestions.server";

const inputSchema = z.object({
  descricaoVaga: z.string(),
  cargo: z.string(),
  objetivo: z.string(),
  qualidades: z.string(),
  experiencia: z.string(),
  formacao: z.string(),
  cursos: z.string(),
});

export const suggestResumeForJob = createServerFn({ method: "POST" })
  .inputValidator((data) => {
    const parsed = inputSchema.parse(data);
    if (parsed.descricaoVaga.trim().length < 40) {
      throw new Error("Cole uma descrição de vaga um pouco mais completa.");
    }
    return { ...parsed, descricaoVaga: parsed.descricaoVaga.slice(0, 8000) };
  })
  .handler(async ({ data }) => generateJobSuggestions(data));