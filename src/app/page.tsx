"use client";

import {
  Button,
  Container,
  Stack,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { fetchAssistants, deleteAssistant } from "../services/assitants.service";
import { Assistant } from "@/src/types/assistant";
import AssistantCard from "../components/assistants/AssistantCard";
import CreateAssistantModal from "@/src/components/modal/CreateAssistantModal";
import { useAssistantsStore } from "@/src/store/assistants.store";

export default function HomePage() {
  const { openCreateModal } = useAssistantsStore();
  const queryClient = useQueryClient();

  const [toDelete, setToDelete] = useState<Assistant | null>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  /**Obtener asistentes*/
  const { data: assistants = [], isLoading, isError } = useQuery<Assistant[]>({
    queryKey: ["assistants"],
    queryFn: fetchAssistants,
  });

  /**Eliminar asistente*/
  const deleteMutation = useMutation({
    mutationFn: deleteAssistant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assistants"] });
      setSuccessMsg("Asistente eliminado correctamente");
      setToDelete(null);
    },
    onError: () => {
      setErrorMsg("Error al eliminar el asistente");
    },
  });

  return (
    <Container sx={{ py: 4 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h4">Asistentes</Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreateModal}
        >
          Crear asistente
        </Button>
      </Stack>

      {isLoading && (
        <Stack direction="row" spacing={1} alignItems="center">
          <CircularProgress size={20} />
          <Typography>Cargando asistentes...</Typography>
        </Stack>
      )}

      {isError && (
        <Typography color="error">Error al cargar asistentes</Typography>
      )}

      {!isLoading && assistants.length === 0 && (
        <Typography color="text.secondary">
          No hay asistentes creados.
        </Typography>
      )}

      <Stack spacing={2}>
        {assistants.map((assistant) => (
          <AssistantCard
            key={assistant.id}
            assistant={assistant}
            onDelete={() => setToDelete(assistant)}   // 👈 ahora pide confirmación
            loading={deleteMutation.isPending}
          />
        ))}
      </Stack>

      {/*Modal de creación/edición*/}
      <CreateAssistantModal />

      {/*Confirmación de eliminación*/}
      <Dialog open={!!toDelete} onClose={() => setToDelete(null)}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Seguro que deseas eliminar el asistente{" "}
            <b>{toDelete?.name}</b>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setToDelete(null)}>Cancelar</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => toDelete && deleteMutation.mutate(toDelete.id)}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <CircularProgress size={20} />
            ) : (
              "Eliminar"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/*Mensaje éxito*/}
      <Snackbar
        open={!!successMsg}
        autoHideDuration={3000}
        onClose={() => setSuccessMsg("")}
      >
        <Alert severity="success">{successMsg}</Alert>
      </Snackbar>

      {/*Mensaje error*/}
      <Snackbar
        open={!!errorMsg}
        autoHideDuration={3000}
        onClose={() => setErrorMsg("")}
      >
        <Alert severity="error">{errorMsg}</Alert>
      </Snackbar>
    </Container>
  );
}
