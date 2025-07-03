import axiosClient from "@/libs/axios";
import { useToastContext } from "@/providers/Toast";
import { GetReportsQueryParams, Report } from "@/types/report";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const getAuthHeaders = () => {
  const token = localStorage.getItem("jwtToken");
  return {
    Authorization: `Bearer ${token}`,
    "X-Source-App": "Web",
  };
};

export const useQueryGetReports = (params: GetReportsQueryParams) => {
  return useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const response = await axiosClient.get<Report[]>("/reports/filters", {
        params,
        headers: getAuthHeaders(),
      });
      return response.data;
    },
    refetchInterval: 5000,
  });
};

export const useMutationUpdateReport = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToastContext();

  return useMutation({
    mutationFn: async ({
      report,
      files,
    }: {
      report: Report;
      files?: File[];
    }) => {
      const formData = new FormData();
      formData.append("report", JSON.stringify(report));
      if (files) {
        files.forEach((file) => {
          formData.append("files", file);
        });
      }

      const response = await axiosClient.put<Report>(`/reports`, formData, {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["reports"] });
      showToast({
        severity: "success",
        summary: "Success",
        detail: "Update Report successful!",
        life: 3000,
      });
    },
    onError: (error) => {
      showToast({
        severity: "error",
        summary: "Error",
        detail: "Update Report failed.",
        life: 3000,
      });
    },
  });
};

export const useMutationDeleteReport = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToastContext();

  return useMutation({
    mutationFn: async (reportId: number) => {
      const response = await axiosClient.delete(`/reports/${reportId}`,{
        headers: getAuthHeaders(),
      });
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["reports"] });
      showToast({
        severity: "success",
        summary: "Success",
        detail: "Delete Report successful!",
        life: 3000,
      });
    },
    onError: (error) => {
      showToast({
        severity: "error",
        summary: "Error",
        detail: "Delete Report failed.",
        life: 3000,
      });
    },
  });
};
