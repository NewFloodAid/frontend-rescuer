import { z } from "zod";
import { LocationSchema } from "./location";
import { ReportStatusSchema } from "./report_status";
import { ReportAssistanceSchema } from "./report_assistance";
import { ImageSchema } from "./image";

export const GetReportsQueryParamsSchema = z.object({
  subDistrict: z.string().optional(),
  district: z.string().optional(),
  province: z.string().optional(),
  postalCode: z.string().optional(),
  reportStatusId: z.number().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  isUser: z.boolean().optional(),
  userId: z.string().optional(),
});

export const ReportSchema = z.object({
  id: z.number(),
  userId: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  location: LocationSchema,
  mainPhoneNumber: z.string(),
  reservePhoneNumber: z.string().optional(),
  reportStatus: ReportStatusSchema,
  additionalDetail: z.string(),
  afterAdditionalDetail: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  reportAssistances: z.array(ReportAssistanceSchema),
  images: z.array(ImageSchema),
});

export type Report = z.infer<typeof ReportSchema>;
export type GetReportsQueryParams = z.infer<typeof GetReportsQueryParamsSchema>;
