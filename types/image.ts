import { z } from "zod";
import { ImageCategorySchema } from "./image_category";

export const ImageSchema = z.object({
    id: z.number(),
    name: z.string(),
    imageCategory: ImageCategorySchema,
    url: z.string().url(),
    phase: z.string(), // 'BEFORE' or 'AFTER'
});

export type Image = z.infer<typeof ImageSchema>;
