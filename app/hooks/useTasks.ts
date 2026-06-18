import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskService } from "../services/taskService";
import type { TaskRow } from "../types";

export const useTasks = (clientId: number) => {
  return useQuery({
    queryKey: ["tasks", clientId],
    queryFn: () => taskService.getByClient(clientId),
    enabled: !!clientId,
  });
};

export const useAllTasks = () => {
  return useQuery({
    queryKey: ["tasks", "all"],
    queryFn: () => taskService.getAll(),
  });
};

export const useCreateTask = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: taskService.create,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["tasks", data.client_id] });
    },
  });
};

export const useUpdateTask = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<TaskRow> }) =>
      taskService.update(id, updates),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["tasks", data.client_id] });
    },
  });
};

export const useUpdateTaskStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
      clientId,
    }: {
      id: number;
      status: TaskRow["status"];
      clientId: number;
    }) => taskService.updateStatus(id, status, clientId),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["tasks", variables.clientId] });
    },
  });
};

export const useDeleteTask = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: taskService.delete,
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};
