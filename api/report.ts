import axiosClient from "@/libs/axios";
import { useToastContext } from "@/providers/Toast";
import { GetReportsQueryParams, Report } from "@/types/report";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import JSZip from "jszip";

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
      const response = await axiosClient.delete(`/reports/${reportId}`, {
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

// Download a report PDF by ID

// Download a report Word document by ID
export const useMutationDownloadReportWord = () => {
  const { showToast } = useToastContext();

  return useMutation({
    mutationFn: async (report: Report) => {
      try {
        const response = await axiosClient.get(`/reports/${report.id}/word`, {
          headers: getAuthHeaders(),
          responseType: "blob",
        });
        return { data: response.data, report };
      } catch (error: any) {
        // Try to read the blob error message if possible
        if (error.response?.data instanceof Blob) {
          const text = await error.response.data.text();
          try {
            const json = JSON.parse(text);
            if (json.message) error.message = json.message;
          } catch (e) {
            // ignore if not json
          }
        }
        throw error;
      }
    },
    onSuccess: ({ data, report }) => {
      const assistanceTypes = report.reportAssistances
        .filter((a) => a.quantity > 0)
        .map((a) => a.assistanceType.name)
        .join("_");

      const timestamp = new Date().getTime();
      const filename = `${report.firstName} ${report.lastName}_${assistanceTypes || "report"}.docx`;

      const blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      showToast({
        severity: "success",
        summary: "Success",
        detail: "Download started",
        life: 3000,
      });
    },
    onError: (error) => {
      console.error("Failed to download Word document:", error);
      showToast({
        severity: "error",
        summary: "Error",
        detail: error.message || "Failed to download Word document.",
        life: 3000,
      });
    },
  });
};

export const useMutationDownloadReportImages = () => {
  const { showToast } = useToastContext();

  return useMutation({
    mutationFn: async (report: Report) => {
      try {
        const response = await axiosClient.get(`/reports/${report.id}/word-with-images`, {
          headers: getAuthHeaders(),
          responseType: "blob",
        });
        return { data: response.data, report };
      } catch (error: any) {
        // Try to read the blob error message if possible
        if (error.response?.data instanceof Blob) {
          const text = await error.response.data.text();
          try {
            const json = JSON.parse(text);
            if (json.message) error.message = json.message;
          } catch (e) {
            // ignore if not json
          }
        }
        throw error;
      }
    },
    onSuccess: ({ data, report }) => {
      const assistanceTypes = report.reportAssistances
        .filter((a) => a.quantity > 0)
        .map((a) => a.assistanceType.name)
        .join("_");

      const filename = `${report.firstName} ${report.lastName}_${assistanceTypes || "report"}_รูป.docx`;

      const blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      showToast({
        severity: "success",
        summary: "Success",
        detail: "Images document download started",
        life: 3000,
      });
    },
    onError: (error) => {
      console.error("Failed to download images document:", error);
      showToast({
        severity: "error",
        summary: "Error",
        detail: error.message || "Failed to download images document.",
        life: 3000,
      });
    },
  });
};

