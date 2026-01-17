import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAssistants, createAssistant, deleteAssistant } from "../services/assitants.service";

export function useAssistants() {
  return useQuery({
    queryKey: ["assistants"],
    queryFn: getAssistants,
  });
}

export function useCreateAssistant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAssistant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assistants"] });
    },
  });
}

export function useDeleteAssistant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAssistant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assistants"] });
    },
  });
}
