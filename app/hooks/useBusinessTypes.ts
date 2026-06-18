import { useQuery } from "@tanstack/react-query";
import { businessTypeService } from "../services/businessTypeService";

export const useBusinessTypes = () => {
  return useQuery({
    queryKey: ["businessTypes"],
    queryFn: businessTypeService.getAll,
  });
};
