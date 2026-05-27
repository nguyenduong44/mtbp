// app/hooks/useProjects.tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectService } from "../services/projectService";
import type { ProjectWithClient, ProjectWithDetails } from "../types";

export const useProjects = (page = 1, limit = 10) => {
  return useQuery<{ data: ProjectWithClient[]; count: number }>({
    queryKey: ["projects", page, limit],
    queryFn: () => projectService.getAll(page, limit),
  });
};

export const useProject = (id: number) => {
  return useQuery<ProjectWithDetails>({
    queryKey: ["project", id],
    queryFn: () => projectService.getById(id),
    enabled: !!id && id > 0,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: projectService.createFull,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Parameters<typeof projectService.updateFull>[1] }) =>
      projectService.updateFull(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", variables.id] });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: projectService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};
