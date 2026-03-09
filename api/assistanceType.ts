import axiosClient from "@/libs/axios";
import { AssistanceType } from "@/types/assistance_type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToastContext } from "@/providers/Toast";

export interface AssistanceTypePayload {
  name: string;
  isActive?: boolean;
  extraFieldLabel?: string | null;
  extraFieldPlaceholder?: string | null;
  extraFieldRequired?: boolean;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem("jwtToken");
  return {
    Authorization: `Bearer ${token}`,
    "X-Source-App": "Web",
  };
};

export const useQueryGetAssistanceTypes = () => {
  return useQuery({
    queryKey: ["assistanceTypes", "active"],
    queryFn: async () => {
      const response = await axiosClient.get<AssistanceType[]>("/assistanceTypes");
      return response.data;
    },
  });
};

export const useQueryGetAllAssistanceTypes = () => {
  return useQuery({
    queryKey: ["assistanceTypes", "all"],
    queryFn: async () => {
      const response = await axiosClient.get<AssistanceType[]>("/assistanceTypes/all", {
        headers: getAuthHeaders(),
      });
      return response.data;
    },
  });
};

export const useMutationCreateAssistanceType = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToastContext();

  return useMutation({
    mutationFn: async (payload: AssistanceTypePayload) => {
      const response = await axiosClient.post<AssistanceType>("/assistanceTypes", payload, {
        headers: getAuthHeaders(),
      });
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["assistanceTypes"] });
      showToast({
        severity: "success",
        summary: "สำเร็จ",
        detail: "เพิ่มประเภทงานเรียบร้อย",
        life: 2500,
      });
    },
    onError: () => {
      showToast({
        severity: "error",
        summary: "ผิดพลาด",
        detail: "ไม่สามารถเพิ่มประเภทงานได้",
        life: 3000,
      });
    },
  });
};

export const useMutationUpdateAssistanceType = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToastContext();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: AssistanceTypePayload;
    }) => {
      const response = await axiosClient.put<AssistanceType>(`/assistanceTypes/${id}`, payload, {
        headers: getAuthHeaders(),
      });
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["assistanceTypes"] });
      showToast({
        severity: "success",
        summary: "สำเร็จ",
        detail: "อัปเดตประเภทงานเรียบร้อย",
        life: 2500,
      });
    },
    onError: () => {
      showToast({
        severity: "error",
        summary: "ผิดพลาด",
        detail: "ไม่สามารถอัปเดตประเภทงานได้",
        life: 3000,
      });
    },
  });
};

export const useMutationDeleteAssistanceType = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToastContext();

  return useMutation({
    mutationFn: async (id: number) => {
      await axiosClient.delete(`/assistanceTypes/${id}`, {
        headers: getAuthHeaders(),
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["assistanceTypes"] });
      showToast({
        severity: "success",
        summary: "สำเร็จ",
        detail: "ลบประเภทงานเรียบร้อย",
        life: 2500,
      });
    },
    onError: () => {
      showToast({
        severity: "error",
        summary: "ผิดพลาด",
        detail: "ไม่สามารถลบประเภทงานได้",
        life: 3000,
      });
    },
  });
};
