import z from "zod";

export const AssistanceTypeSchema = z.object({
    id: z.number(),
    name: z.string(),
    isActive: z.boolean().optional(),
    extraFieldLabel: z.string().nullable().optional(),
    extraFieldPlaceholder: z.string().nullable().optional(),
    extraFieldRequired: z.boolean().optional(),
});
  
export type AssistanceType = z.infer<typeof AssistanceTypeSchema>;
