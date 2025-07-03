import z from "zod";

export const AssistanceTypeSchema = z.object({
    id: z.number(),
    name: z.string(),
    priority: z.number(),
    unit: z.string(),
});
  
export type AssistanceType = z.infer<typeof AssistanceTypeSchema>;