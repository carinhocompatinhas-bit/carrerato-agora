import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Registra no servidor erros que travam a tela no aparelho da pessoa (sem dados pessoais).
export const logClientError = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        message: z.string().max(1000),
        stack: z.string().max(4000).optional(),
        ua: z.string().max(400).optional(),
        path: z.string().max(200).optional(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    console.log("[client-error]", JSON.stringify(data));
    return { ok: true };
  });
