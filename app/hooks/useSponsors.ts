import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sponsorService } from "../services/sponsorService";
import type { SponsorRow } from "../types";

export const useSponsors = () =>
  useQuery({ queryKey: ["sponsors"], queryFn: sponsorService.getAll });

export const useSponsor = (id: number) =>
  useQuery({
    queryKey: ["sponsors", id],
    queryFn: () => sponsorService.getById(id),
    enabled: !!id,
  });

export const useCreateSponsor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sponsorService.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sponsors"] }),
  });
};

export const useUpdateSponsor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: number;
      updates: Partial<SponsorRow>;
    }) => sponsorService.update(id, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["sponsors"] });
      queryClient.invalidateQueries({ queryKey: ["sponsors", variables.id] });
    },
  });
};

export const useDeleteSponsor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sponsorService.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sponsors"] }),
  });
};
