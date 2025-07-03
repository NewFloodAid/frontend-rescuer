import { z } from 'zod';
import { ProvinceSchema } from './province';

export const DistrictSchema = z.object({
  id: z.number().int().positive(),
  code: z.number().int().nullable(),
  nameInThai: z.string(),
  nameInEnglish: z.string(),
  province: ProvinceSchema.nullable(),
});

export type District = z.infer<typeof DistrictSchema>;