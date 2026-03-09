
import { z } from "zod";
import { AssistanceTypeSchema } from "./assistance_type";

export const ReportAssistanceSchema = z.object({
    id: z.number(),
    assistanceType: AssistanceTypeSchema,
    quantity: z.number(),
    isActive: z.boolean(),
    extraDetail: z.string().nullable().optional(),
});

export type ReportAssistance = z.infer<typeof ReportAssistanceSchema>;
