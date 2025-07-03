import axiosClient from "@/libs/axios";
import {
  GetReportStatusParamsSchema,
  ReportStatus,
} from "@/types/report_status";
import { useQuery } from "@tanstack/react-query";

export const useQueryGetReportStatuses = (
  params: GetReportStatusParamsSchema
) => {
  return useQuery({
    queryKey: ["reportStatuses", params],
    queryFn: async () => {
      const response = await axiosClient.get<ReportStatus[]>(
        "/reportStatuses",
        {
          params,
        }
      );
      return response.data;
    },
  });
};
