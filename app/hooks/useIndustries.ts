import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { industryService } from "../services/industryService";
import type { IndustryRow } from "../types";

export const useIndustries = (
  params?: Parameters<typeof industryService.getAll>[0],
) => {
  return useQuery({
    queryKey: ["industries", params],
    queryFn: () => industryService.getAll(params),
  });
};

export const useIndustry = (id: number) =>
  useQuery({
    queryKey: ["industries", id],
    queryFn: () => industryService.getById(id),
    enabled: !!id,
  });

export const useIndustryBySlug = (slug: string) =>
  useQuery({
    queryKey: ["industries", "slug", slug],
    queryFn: () => industryService.getBySlug(slug),
    enabled: !!slug,
  });

export const useCreateIndustry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: industryService.create,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["industries"] }),
  });
};

export const useUpdateIndustry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: number;
      updates: Partial<IndustryRow>;
    }) => industryService.update(id, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["industries"] });
      queryClient.invalidateQueries({ queryKey: ["industries", variables.id] });
    },
  });
};

export const useDeleteIndustry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: industryService.delete,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["industries"] }),
  });
};
