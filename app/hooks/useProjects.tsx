// app/hooks/useProjects.tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectService } from "../services/projectService";
import type { ProjectWithDetails } from "../types";

export const useProjects = (
  params?: Parameters<typeof projectService.getAll>[0],
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: ["projects", params],
    queryFn: () => projectService.getAll(params ?? {}),
    enabled: options?.enabled ?? true,
  });
};

export const useProject = (id: number) => {
  return useQuery<ProjectWithDetails>({
    queryKey: ["project", id],
    queryFn: () => projectService.getById(id),
    enabled: !!id && id > 0,
  });
};

export const useProjectBySlug = (slug: string) => {
  return useQuery<ProjectWithDetails>({
    queryKey: ["project", "slug", slug],
    queryFn: () => projectService.getBySlug(slug),
    enabled: !!slug,
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
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Parameters<typeof projectService.updateFull>[1];
    }) => projectService.updateFull(id, data),
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
