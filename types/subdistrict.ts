import { z } from 'zod';
import { DistrictSchema } from './district';

export const SubdistrictSchema = z.object({
  id: z.number().int().positive(),
  code: z.number().int().nullable(),
  nameInThai: z.string(),
  nameInEnglish: z.string(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  zipCode: z.number().int().nullable(),
  district: DistrictSchema.nullable(),
});

export type Subdistrict = z.infer<typeof SubdistrictSchema>;