export function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

export function shouldFail(probability = 0.1) {
  return Math.random() < probability;
}

export function generateAnswer(rules: string) {
  const base = [
    "Puedo ayudarte con eso",
    "Claro, veamos tu caso",
    "Entiendo tu necesidad",
    "Buena pregunta",
  ];

  let answer = base[Math.floor(Math.random() * base.length)];

  const rulesLower = rules.toLowerCase();

  if (rulesLower.includes("formal")) {
    answer = "Con gusto le ayudo. " + answer + ".";
  }

  if (rulesLower.includes("amigable") || rulesLower.includes("friendly")) {
    answer = "¡Hey! 😊 " + answer + "!";
  }

  if (rulesLower.includes("corto")) {
    return answer.split(" ").slice(0, 4).join(" ") + ".";
  }

  if (rulesLower.includes("largo")) {
    return answer + " y estaré encantado de explicarlo con más detalle si lo necesitas.";
  }

  return answer + ".";
}

