import axiosClient from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";

export interface District {
  id: number;
  nameInThai: string;
  nameInEnglish: string;
  provinceNameInThai: string;
}

export const useQueryGetDistricts = (province?: string) => {
  return useQuery({
    queryKey: ["districts", province],
    queryFn: async () => {
      const response = await axiosClient.get<District[]>("/districts", {
        params: province ? { province } : undefined,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          "X-Source-App": "Web",
        },
      });
      return response.data;
    },
  });
};
