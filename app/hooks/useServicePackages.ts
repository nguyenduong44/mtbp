import { useQuery } from "@tanstack/react-query";
import { servicePackageService } from "../services/servicePackageService";

export const useServicePackages = () => {
  return useQuery({
    queryKey: ["servicePackages"],
    queryFn: servicePackageService.getAll,
  });
};
