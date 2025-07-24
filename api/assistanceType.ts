import axiosClient from "@/libs/axios";
import { AssistanceType } from "@/types/assistance_type";
import { useQuery } from "@tanstack/react-query";

export const useQueryGetAssistanceTypes = () => {
  return useQuery({
    queryKey: ["assistanceTypes"],
    queryFn: async () => {
      const response = await axiosClient.get<AssistanceType[]>("/assistanceTypes");
      return response.data;
    },
  });
}; 