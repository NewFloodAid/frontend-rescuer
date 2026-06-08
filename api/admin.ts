import axiosClient from "@/libs/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToastContext } from "@/providers/Toast";

interface AdminProfile {
  id: number;
  username: string;
  email: string;
  fullName: string;
  phone: string;
  role: string;
  isActive: boolean;
  lastLoginAt: string;
  province?: string;
  assignedDistricts: { id: number; nameInThai: string; nameInEnglish: string }[];
}

interface CreateAdminRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phone: string;
  role: string;
  province?: string;
  districtIds: number[];
}

interface UpdateAdminRequest {
  email?: string;
  fullName?: string;
  phone?: string;
  role?: string;
  isActive?: boolean;
  province?: string;
  districtIds?: number[];
}

export interface DistrictOption {
  id: number;
  nameInThai: string;
  nameInEnglish: string;
  provinceNameInThai: string;
}

export interface ProvinceOption {
  id: number;
  nameInThai: string;
  nameInEnglish: string;
}

interface AuditLog {
  id: number;
  adminId: number;
  action: string;
  entityType: string;
  entityId: number;
  oldValue: string;
  newValue: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

interface PaginatedAuditLogs {
  content: AuditLog[];
  totalPages: number;
  totalElements: number;
  number: number;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem("jwtToken");
  return {
    Authorization: `Bearer ${token}`,
    "X-Source-App": "Web",
  };
};

export const useQueryGetAdmins = () => {
  return useQuery({
    queryKey: ["admins", "list"],
    queryFn: async () => {
      const response = await axiosClient.get<AdminProfile[]>("/admin/admins", {
        headers: getAuthHeaders(),
      });
      return response.data;
    },
  });
};

export const useMutationCreateAdmin = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToastContext();

  return useMutation({
    mutationFn: async (request: CreateAdminRequest) => {
      const response = await axiosClient.post("/admin/admins", request, {
        headers: getAuthHeaders(),
      });
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admins"] });
      showToast({
        severity: "success",
        summary: "สำเร็จ",
        detail: "เพิ่มผู้ดูแลเรียบร้อยแล้ว",
        life: 3000,
      });
    },
    onError: (error: any) => {
      showToast({
        severity: "error",
        summary: "เกิดข้อผิดพลาด",
        detail: error.response?.data?.message || "ไม่สามารถเพิ่มผู้ดูแลได้",
        life: 3000,
      });
    },
  });
};

export const useMutationUpdateAdmin = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToastContext();

  return useMutation({
    mutationFn: async ({
      id,
      request,
    }: {
      id: number;
      request: UpdateAdminRequest;
    }) => {
      const response = await axiosClient.put(`/admin/admins/${id}`, request, {
        headers: getAuthHeaders(),
      });
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admins"] });
      showToast({
        severity: "success",
        summary: "สำเร็จ",
        detail: "อัปเดตผู้ดูแลเรียบร้อยแล้ว",
        life: 3000,
      });
    },
    onError: (error: any) => {
      showToast({
        severity: "error",
        summary: "เกิดข้อผิดพลาด",
        detail: error.response?.data?.message || "ไม่สามารถอัปเดตผู้ดูแลได้",
        life: 3000,
      });
    },
  });
};

export const useMutationDeactivateAdmin = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToastContext();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await axiosClient.delete(`/admin/admins/${id}`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admins"] });
      showToast({
        severity: "success",
        summary: "สำเร็จ",
        detail: "ปิดใช้งานผู้ดูแลเรียบร้อยแล้ว",
        life: 3000,
      });
    },
    onError: () => {
      showToast({
        severity: "error",
        summary: "เกิดข้อผิดพลาด",
        detail: "ไม่สามารถปิดใช้งานผู้ดูแลได้",
        life: 3000,
      });
    },
  });
};

export const useQueryGetAuditLogs = (page: number, size: number) => {
  return useQuery({
    queryKey: ["auditLogs", page, size],
    queryFn: async () => {
      const response = await axiosClient.get<PaginatedAuditLogs>(
        "/admin/audit-logs",
        {
          params: { page, size },
          headers: getAuthHeaders(),
        }
      );
      return response.data;
    },
  });
};

export const useQueryGetProvinces = () => {
  return useQuery({
    queryKey: ["provinces"],
    queryFn: async () => {
      const response = await axiosClient.get<ProvinceOption[]>("/provinces", {
        headers: getAuthHeaders(),
      });
      return response.data;
    },
    staleTime: 1000 * 60 * 60, // provinces rarely change – cache 1 hour
  });
};

export const useQueryGetDistricts = (province: string | undefined) => {
  return useQuery({
    queryKey: ["districts", province],
    queryFn: async () => {
      const response = await axiosClient.get<DistrictOption[]>("/districts", {
        params: province ? { province } : {},
        headers: getAuthHeaders(),
      });
      return response.data;
    },
    enabled: !!province,
    staleTime: 1000 * 60 * 60,
  });
};

export const useQueryGetAllDistricts = () => {
  return useQuery({
    queryKey: ["districts", "all"],
    queryFn: async () => {
      const response = await axiosClient.get<DistrictOption[]>("/districts", {
        headers: getAuthHeaders(),
      });
      return response.data;
    },
    staleTime: 1000 * 60 * 60,
  });
};
