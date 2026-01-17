"use client";

import {
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  IconButton,
  CircularProgress,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Assistant } from "@/src/types/assistant";
import { useAssistantsStore } from "@/src/store/assistants.store";
import { useRouter } from "next/navigation";

interface Props {
  assistant: Assistant;
  onDelete: (id: string) => void;
  loading?: boolean;
}

export default function AssistantCard({ assistant, onDelete, loading = false }: Props) {
  const { openEditModal } = useAssistantsStore();
  const router = useRouter();

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="start">
          <div>
            <Typography variant="h6">{assistant.name}</Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Idioma: {assistant.language} · Tono: {assistant.tone}
            </Typography>

            <Stack direction="row" spacing={1}>
              <Chip size="small" label={`Cortas ${assistant.responseConfig.short}%`} />
              <Chip size="small" label={`Medias ${assistant.responseConfig.medium}%`} />
              <Chip size="small" label={`Largas ${assistant.responseConfig.long}%`} />
              {assistant.responseConfig.audioEnabled && (
                <Chip size="small" color="success" label="Audio" />
              )}
            </Stack>
          </div>

          <Stack direction="row" spacing={1}>
            <IconButton color="error" onClick={() => onDelete(assistant.id)} disabled={loading}>
              {loading ? <CircularProgress size={20} /> : <DeleteIcon />}
            </IconButton>

            <Button
              variant="outlined"
              size="small"
              onClick={() => openEditModal(assistant)}
            >
              Editar
            </Button>

            <Button
              variant="contained"
              size="small"
              onClick={() => router.push(`/assistant/${assistant.id}`)}
            >
              Entrenar
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
