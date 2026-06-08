import axiosClient from "@/libs/axios";
import { Subdistrict } from "@/types/subdistrict";
import { useQuery } from "@tanstack/react-query";

export const useQueryGetSubdistrictFromProvince = (province:string) => {
    return useQuery({
      queryKey: ["subdistricts", province],
      queryFn: async () => {
        const response = await axiosClient.get<Subdistrict[]>(
          `/subdistricts`,
          {
            params: { province },
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
  