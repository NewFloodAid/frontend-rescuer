import { z } from "zod";

export const LocationSchema = z.object({
    id: z.number(),
    latitude: z.number(),
    longitude: z.number(),
    address: z.string(),
    subDistrict: z.string(),
    district: z.string(),
    province: z.string(),
    postalCode: z.string(),
  });


export type Location = z.infer<typeof LocationSchema>;
