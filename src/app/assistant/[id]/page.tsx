"use client";

import { useParams } from "next/navigation";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  CircularProgress,
  Paper,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { fetchAssistants } from "@/src/services/assitants.service";
import { useAssistantsStore } from "@/src/store/assistants.store";
import { generateAnswer } from "@/src/services/helpers";
import { useState } from "react";

export default function AssistantTrainingPage() {
  const { id } = useParams<{ id: string }>();

  const { data: assistants = [], isLoading } = useQuery({
    queryKey: ["assistants"],
    queryFn: fetchAssistants,
  });

  const assistant = assistants.find((a) => a.id === id);

  const { chatHistory, addMessage, resetChat } = useAssistantsStore();
  const messages = chatHistory[id] || [];

  const [rules, setRules] = useState("");
  const [saving, setSaving] = useState(false);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");

  if (isLoading) {
    return (
      <Box p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (!assistant) {
    return (
      <Box p={3}>
        <Typography color="error">Asistente no encontrado</Typography>
      </Box>
    );
  }

  //Training
  const handleSaveRules = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
    alert("Entrenamiento guardado correctamente");
  };

  //Chat
  const sendMessage = async () => {
    if (!input.trim()) return;

    addMessage(id, { role: "user", content: input });
    setInput("");
    setTyping(true);

    const delay = 1000 + Math.random() * 1000;
    setTimeout(() => {
      addMessage(id, {
        role: "assistant",
        content: generateAnswer(rules),
      });
      setTyping(false);
    }, delay);
  };

  return (
    <Box p={3} maxWidth="1100px" mx="auto">
      <Typography variant="h4">{assistant.name}</Typography>
      <Typography color="text.secondary">
        Idioma: {assistant.language} · Tono: {assistant.tone}
      </Typography>

      <Stack direction={{ xs: "column", md: "row" }} spacing={2} mt={3}>
        {/*REGLAS*/}
        <Paper sx={{ p: 2, flex: 1 }}>
          <Typography variant="h6">Entrenamiento</Typography>

          <TextField
            fullWidth
            multiline
            rows={10}
            label="Reglas / Instrucciones"
            value={rules}
            onChange={(e) => setRules(e.target.value)}
            sx={{ mt: 2 }}
            placeholder="Ej: Responde siempre en tono formal y con respuestas cortas"
          />

          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={handleSaveRules}
            disabled={saving}
          >
            {saving ? <CircularProgress size={20} /> : "Guardar"}
          </Button>
        </Paper>

        {/*CHAT*/}
        <Paper sx={{ p: 2, flex: 1 }}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h6">Chat simulado</Typography>
            <Button size="small" onClick={() => resetChat(id)}>
              Reiniciar
            </Button>
          </Stack>

          <Box
            sx={{
              mt: 2,
              mb: 2,
              height: 300,
              overflowY: "auto",
              border: "1px solid #ddd",
              p: 1,
              borderRadius: 1,
            }}
          >
            {messages.map((m, i) => (
              <Typography
                key={i}
                sx={{
                  mb: 1,
                  fontWeight: m.role === "assistant" ? 500 : 400,
                }}
              >
                <b>{m.role === "user" ? "Tú" : assistant.name}:</b> {m.content}
              </Typography>
            ))}

            {typing && (
              <Typography color="text.secondary">
                {assistant.name} está escribiendo...
              </Typography>
            )}
          </Box>

          <Stack direction="row" spacing={1}>
            <TextField
              fullWidth
              placeholder="Escribe un mensaje..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <Button variant="contained" onClick={sendMessage}>
              Enviar
            </Button>
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
}
