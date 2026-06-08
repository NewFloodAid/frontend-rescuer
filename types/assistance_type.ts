import z from "zod";

export const AssistanceTypeSchema = z.object({
    id: z.number(),
    name: z.string(),
    isActive: z.boolean().optional(),
    extraFieldLabel: z.string().nullable().optional(),
    extraFieldPlaceholder: z.string().nullable().optional(),
    extraFieldRequired: z.boolean().optional(),
    district: z.object({
        id: z.number(),
        nameInThai: z.string().optional(),
        nameInEnglish: z.string().optional(),
        provinceNameInThai: z.string().optional(),
    }).nullable().optional(),
});
  
export type AssistanceType = z.infer<typeof AssistanceTypeSchema>;
