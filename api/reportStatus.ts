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
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            "X-Source-App": "Web",
          },
        }
      );
      return response.data;
    },
  });
};
