import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingService } from "../services/settingService";

export const useSettings = () => {
  return useQuery({
    queryKey: ["settings"],
    queryFn: settingService.getAll,
  });
};

export const useUpdateSetting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ key, value }: { key: string; value: any }) =>
      settingService.update(key, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });
};

export const useUpdateSettingsBatch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: settingService.updateBatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });
};
