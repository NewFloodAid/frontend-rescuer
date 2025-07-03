import { z } from 'zod';

export const ProvinceSchema = z.object({
  id: z.number().int().positive(),
  code: z.number().int().nullable(),
  nameInThai: z.string(),
  nameInEnglish: z.string(),
});

export type Province = z.infer<typeof ProvinceSchema>;