import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { processService } from "../services/processService";
import type { ProcessRow } from "../types";

export const useProcesses = () =>
  useQuery({ queryKey: ["processes"], queryFn: processService.getAll });
export const useProcess = (id: number) =>
  useQuery({
    queryKey: ["processes", id],
    queryFn: () => processService.getById(id),
    enabled: !!id,
  });
export const useCreateProcess = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: processService.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["processes"] }),
  });
};
export const useUpdateProcess = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: number;
      updates: Partial<ProcessRow>;
    }) => processService.update(id, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["processes"] });
      queryClient.invalidateQueries({ queryKey: ["processes", variables.id] });
    },
  });
};
export const useDeleteProcess = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: processService.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["processes"] }),
  });
};
