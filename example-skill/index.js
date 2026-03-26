/**
 * Przykładowy GitHub Copilot Skill
 *
 * Skill to serwer HTTP, który:
 * 1. Odbiera wiadomość z Copilot Chat (POST /copilot)
 * 2. Wyodrębnia ostatnią wiadomość użytkownika
 * 3. Odpowiada strumieniem SSE (Server-Sent Events) zgodnym ze standardem Copilot Extensions
 *
 * Aby zarejestrować ten serwer jako Copilot Extension:
 * - Utwórz GitHub App na https://github.com/settings/apps
 * - Włącz integrację Copilot i ustaw "Agent URL" na https://<twoja-domena>/copilot
 * - Zainstaluj aplikację w swoim repozytorium lub organizacji
 */

const express = require("express");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

/**
 * Wysyła pojedynczą wiadomość jako zdarzenie SSE w formacie wymaganym przez Copilot.
 *
 * @param {import("express").Response} res - Obiekt odpowiedzi Express
 * @param {string} text - Tekst do wysłania
 */
function sendMessage(res, text) {
  const payload = {
    choices: [
      {
        index: 0,
        delta: {
          role: "assistant",
          content: text,
        },
      },
    ],
  };
  res.write(`data: ${JSON.stringify(payload)}\n\n`);
}

/**
 * Kończy strumień SSE sygnałem [DONE].
 *
 * @param {import("express").Response} res
 */
function sendDone(res) {
  res.write("data: [DONE]\n\n");
  res.end();
}

/**
 * Generuje odpowiedź na podstawie wiadomości użytkownika.
 * W rzeczywistym Skill możesz tu wywołać zewnętrzne API, bazy danych,
 * dokumentację projektu itp.
 *
 * @param {string} userMessage - Ostatnia wiadomość użytkownika
 * @returns {string} Odpowiedź asystenta
 */
function generateResponse(userMessage) {
  const lower = userMessage.toLowerCase();

  if (lower.includes("cześć") || lower.includes("hej") || lower.includes("hello")) {
    return "Cześć! Jestem przykładowym GitHub Copilot Skill. Mogę odpowiadać na pytania dotyczące Twojego projektu. Jak mogę pomóc?";
  }

  if (lower.includes("skill") || lower.includes("rozszerzenie") || lower.includes("extension")) {
    return (
      "**GitHub Copilot Skills** (znane też jako *Copilot Extensions*) to serwery HTTP, które rozszerzają " +
      "możliwości Copilot Chat o własne dane i akcje.\n\n" +
      "Skill:\n" +
      "- Odbiera wiadomości z czatu jako żądania HTTP POST\n" +
      "- Przetwarza je (np. odpytuje API, bazę danych, dokumentację)\n" +
      "- Zwraca odpowiedź jako strumień SSE\n\n" +
      "Przykład rejestracji: utwórz GitHub App i ustaw Copilot Agent URL na adres tego serwera."
    );
  }

  return `Otrzymałem Twoją wiadomość: "${userMessage}". W rzeczywistym Skill tutaj nastąpiłoby zapytanie do zewnętrznego API lub bazy wiedzy projektu.`;
}

/**
 * POST /copilot
 *
 * Główny endpoint Skilla. GitHub Copilot wysyła tutaj każdą wiadomość użytkownika.
 *
 * Struktura żądania:
 * {
 *   "messages": [
 *     { "role": "user", "content": "Treść wiadomości" },
 *     ...
 *   ]
 * }
 */
app.post("/copilot", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const messages = req.body?.messages ?? [];
  const lastUserMessage = messages
    .filter((m) => m.role === "user")
    .map((m) => m.content)
    .at(-1) ?? "";

  const response = generateResponse(lastUserMessage);
  sendMessage(res, response);
  sendDone(res);
});

/**
 * GET /
 * Prosty health-check – przydatny do weryfikacji, że serwer działa.
 */
app.get("/", (_req, res) => {
  res.json({ status: "ok", skill: "copilot-skill-example" });
});

app.listen(PORT, () => {
  console.log(`Copilot Skill nasłuchuje na http://localhost:${PORT}`);
  console.log("Endpoint Skilla: POST /copilot");
});
