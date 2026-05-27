import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { contactService } from "../services/contactService";

export const useContacts = () => {
  return useQuery({
    queryKey: ["contacts"],
    queryFn: contactService.getAll,
  });
};

export const useUpdateContactStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: number;
      status: "new" | "read" | "replied";
    }) => contactService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
};

export const useDeleteContact = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: contactService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
};
