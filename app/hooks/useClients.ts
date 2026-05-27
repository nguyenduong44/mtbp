import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clientService } from "../services/clientService";
import type { ClientRow } from "../types";

export const useClients = () => {
  return useQuery({
    queryKey: ["clients"],
    queryFn: clientService.getAll,
  });
};

export const useClient = (id: number) => {
  return useQuery({
    queryKey: ["clients", id],
    queryFn: () => clientService.getById(id),
    enabled: !!id,
  });
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: clientService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
};

export const useUpdateClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: number;
      updates: Partial<ClientRow>;
    }) => clientService.update(id, updates),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["clients", variables.id] });
    },
  });
};

export const useDeleteClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: clientService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
};
