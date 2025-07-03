
import { z } from "zod";
export const ImageCategorySchema = z.object({
    id: z.number(),
    name: z.string(),
    fileLimit: z.number(),
  });
  
export type ImageCategory = z.infer<typeof ImageCategorySchema>; 