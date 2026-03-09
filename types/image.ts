import { z } from "zod";

export const ImageSchema = z.object({
    id: z.number(),
    name: z.string(),
    url: z.string().url(),
    phase: z.string(), // 'BEFORE' or 'AFTER'
});

export type Image = z.infer<typeof ImageSchema>;
