import { z } from "zod";

export const ReportStatusEnum = z.enum([
  "PENDING",
  "REJECTED",
  "PROCESS",
  "SUCCESS",
]);

export const ReportStatusSchema = z.object({
  id: z.number(),
  status: ReportStatusEnum,
  userOrderingNumber: z.number(),
  governmentOrderingNumber: z.number(),
});

export const GetReportStatusParamsSchema = z.object({
  isUser: z.boolean(),
});

export type ReportStatus = z.infer<typeof ReportStatusSchema>;
export type GetReportStatusParamsSchema = z.infer<
  typeof GetReportStatusParamsSchema
>;
export type ReportStatusEnum = z.infer<typeof ReportStatusEnum>;
