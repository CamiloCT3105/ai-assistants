Módulo de Gestión de Asistentes IA

Prueba técnica – Funnelhot
Aplicación web para crear, editar, eliminar y entrenar asistentes de IA simulados.

🚀 Instrucciones para correr el proyecto
Requisitos

Node.js 18+

npm o yarn

Instalación
git clone <url-del-repo>
cd <nombre-del-proyecto>
npm install
# o
yarn install

Correr en desarrollo
npm run dev
# o
yarn dev


Abrir en:

http://localhost:3000

🧠 Decisiones técnicas
Framework

Next.js (App Router)
Permite rutas dinámicas como /assistant/[id] y una arquitectura moderna.

Lenguaje

TypeScript
Para tipado fuerte, menos errores y mejor mantenibilidad.

Estado

Zustand
Maneja:

Lista de asistentes

Asistente seleccionado

Estado del modal

Historial de chat por asistente

React Query
Maneja:

Fetch simulado

Mutaciones CRUD

Loading, error y success states

Invalidación de queries

UI

Material UI
Componentes accesibles y responsivos para enfocarse en lógica y UX.

Servicios Mock

CRUD en memoria

Delays artificiales (300–500ms)

10% de probabilidad de error al eliminar

Datos se pierden al refrescar (intencional)

✅ Características implementadas
Página principal

Listado en tarjetas

Estado vacío

Estados de carga y error

Crear, editar, eliminar y entrenar asistentes

Modal Crear / Editar (2 pasos)

Paso 1:

Nombre (mín. 3 caracteres)

Idioma

Tono

Paso 2:

Porcentaje de respuestas (suma 100%)

Audio opcional

Validaciones:

No avanzar sin completar paso 1

La suma debe ser 100%

Mensajes claros de error

Eliminación

Confirmación antes de borrar

Loading durante eliminación

Mensaje de éxito

Mensaje de error si falla

Entrenamiento /assistant/[id]

Info del asistente

Layout:

Izquierda: reglas

Derecha: chat

Entrenamiento:

Textarea de reglas

Guardado con loading y mensaje de éxito

Chat simulado:

Historial por asistente

Envío de mensajes

Reiniciar conversación

Delay 1–2s

Indicador “está escribiendo…”

Respuestas cambian según reglas (formal, amigable, corto, largo)

⚖️ Priorización

Se priorizó:

Cumplir todos los requerimientos funcionales

Manejo correcto de estado

UX clara

Código defendible en entrevista

Se dejó fuera o simplificado:

Persistencia real

Autenticación

Integración con IA real

Diseño pixel-perfect

Para enfocarse en:

Arquitectura

Lógica

Estados

Experiencia de usuario

⏱ Tiempo aproximado

Análisis de requerimientos: ~1 hora

Estructura base y CRUD: ~3 horas

Modal 2 pasos + validaciones: ~3 horas

Página de entrenamiento + chat: ~4 horas

UX, confirmaciones y feedback visual: ~2 horas

Total aproximado: 13 horas
