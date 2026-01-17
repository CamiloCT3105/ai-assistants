"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  Box,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useAssistantsStore } from "@/src/store/assistants.store";
import { createAssistant, updateAssistant } from "@/src/services/assitants.service";
import { AssistantLanguage, AssistantTone } from "@/src/types/assistant";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const steps = ["Datos básicos", "Configuración de respuestas"];

export default function CreateAssistantModal() {
  const { modalOpen, modalMode, formDraft, closeModal } = useAssistantsStore();
  const isEdit = modalMode === "edit";
  const queryClient = useQueryClient();

  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [language, setLanguage] = useState<AssistantLanguage | "">("");
  const [tone, setTone] = useState<AssistantTone | "">("");
  const [shortResp, setShortResp] = useState(0);
  const [mediumResp, setMediumResp] = useState(0);
  const [longResp, setLongResp] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(false);

  //RESET
  const resetForm = () => {
    setName("");
    setLanguage("");
    setTone("");
    setShortResp(0);
    setMediumResp(0);
    setLongResp(0);
    setAudioEnabled(false);
    setError(null);
    setStep(0);
  };

  const handleClose = () => {
    closeModal();
    resetForm();
  };

    useEffect(() => {
        if (!modalOpen) return;

        if (isEdit && formDraft) {
            setTimeout(() => {
            setName(formDraft.name);
            setLanguage(formDraft.language);
            setTone(formDraft.tone);
            setShortResp(formDraft.responseConfig.short);
            setMediumResp(formDraft.responseConfig.medium);
            setLongResp(formDraft.responseConfig.long);
            setAudioEnabled(formDraft.responseConfig.audioEnabled);
            }, 0);
        }

        if (!isEdit) {
            setTimeout(() => resetForm(), 0);
        }
    }, [modalOpen, isEdit, formDraft]);


  //MUTATION
  const mutation = useMutation({
    mutationFn: isEdit ? updateAssistant : createAssistant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assistants"] });
      handleClose();
    },
    onError: () => {
      setError(isEdit ? "Error al actualizar el asistente" : "Error al crear el asistente");
    },
  });

  //Validaciones
  const validateStep1 = () => {
    if (name.trim().length < 3) {
      setError("El nombre debe tener al menos 3 caracteres");
      return false;
    }
    if (!language) {
      setError("Debe seleccionar un idioma");
      return false;
    }
    if (!tone) {
      setError("Debe seleccionar un tono");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    const total = shortResp + mediumResp + longResp;
    if (total !== 100) {
      setError("La suma de los porcentajes debe ser 100%");
      return false;
    }
    return true;
  };

  //HANDLERS
  const handleNext = () => {
    setError(null);
    if (validateStep1()) setStep(1);
  };

  const handleSave = () => {
    setError(null);
    if (!validateStep2()) return;

    mutation.mutate({
      id: formDraft?.id ?? "",
      name,
      language: language as AssistantLanguage,
      tone: tone as AssistantTone,
      responseConfig: { short: shortResp, medium: mediumResp, long: longResp, audioEnabled },
    });
  };

  //RENDER
  return (
    <Dialog open={modalOpen} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEdit ? "Editar asistente" : "Crear asistente"}</DialogTitle>

      <DialogContent dividers>
        <Stepper activeStep={step} sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {step === 0 && (
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Nombre del asistente"
              required
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <FormControl fullWidth required>
              <InputLabel>Idioma</InputLabel>
              <Select
                label="Idioma"
                value={language}
                onChange={(e) => setLanguage(e.target.value as AssistantLanguage)}
              >
                <MenuItem value="">
                  <em>Seleccione un idioma</em>
                </MenuItem>
                <MenuItem value="es">Español</MenuItem>
                <MenuItem value="en">Inglés</MenuItem>
                <MenuItem value="pt">Portugués</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth required>
              <InputLabel>Tono</InputLabel>
              <Select
                label="Tono"
                value={tone}
                onChange={(e) => setTone(e.target.value as AssistantTone)}
              >
                <MenuItem value="">
                  <em>Seleccione un tono</em>
                </MenuItem>
                <MenuItem value="formal">Formal</MenuItem>
                <MenuItem value="casual">Casual</MenuItem>
                <MenuItem value="professional">Profesional</MenuItem>
                <MenuItem value="friendly">Amigable</MenuItem>
              </Select>
            </FormControl>
          </Box>
        )}

        {step === 1 && (
          <Box display="flex" flexDirection="column" gap={2}>
            <Typography variant="body2" color="text.secondary">
              La suma debe ser exactamente 100%
            </Typography>

            <TextField
              label="Respuestas cortas (%)"
              type="number"
              value={shortResp}
              onChange={(e) => setShortResp(Number(e.target.value))}
            />
            <TextField
              label="Respuestas medias (%)"
              type="number"
              value={mediumResp}
              onChange={(e) => setMediumResp(Number(e.target.value))}
            />
            <TextField
              label="Respuestas largas (%)"
              type="number"
              value={longResp}
              onChange={(e) => setLongResp(Number(e.target.value))}
            />

            <FormControlLabel
              control={<Checkbox checked={audioEnabled} onChange={(e) => setAudioEnabled(e.target.checked)} />}
              label="Habilitar respuestas de audio"
            />
          </Box>
        )}

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button color="inherit" onClick={step === 0 ? handleClose : () => setStep(0)}>
          {step === 0 ? "Cancelar" : "Atrás"}
        </Button>

        <Button variant="contained" disabled={mutation.isPending} onClick={step === 0 ? handleNext : handleSave}>
          {step === 0 ? "Siguiente" : isEdit ? "Guardar cambios" : "Crear asistente"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
