# HiddenDevs

## GitHub Copilot Skills – czym są i jak się je stosuje?

### Co to są Skills?

**Skills** to rozszerzenia (ang. *Copilot Extensions*) pozwalające dodać własne możliwości do GitHub Copilot Chat. Dzięki nim Copilot może:

- odpowiadać na pytania specyficzne dla Twojej firmy lub projektu,
- integrować się z zewnętrznymi API (np. Jira, Slack, Confluence),
- wykonywać niestandardowe operacje i zwracać wyniki bezpośrednio w oknie czatu.

Skill to serwer HTTP, który odbiera wiadomości od Copilota (przez webhook) i odpowiada strumieniem SSE (Server-Sent Events). GitHub rejestruje go jako **GitHub App** z włączoną integracją Copilot.

### Jak działa Skill? – schemat

```
Użytkownik pisze w Copilot Chat
        │
        ▼
  GitHub Copilot
        │  (przekazuje wiadomość jako JSON)
        ▼
  Twój serwer (Skill)
        │  (przetwarza żądanie, wywołuje API itp.)
        ▼
  Odpowiedź SSE → wraca do Copilot Chat
```

### Przykład – prosty Skill w Node.js

Pełny, uruchamialny przykład znajdziesz w katalogu [`example-skill/`](./example-skill/).

```
example-skill/
├── index.js        # serwer Express odbierający wiadomości z Copilota
└── package.json
```

#### Uruchomienie przykładu

```bash
cd example-skill
npm install
npm start
# Serwer nasłuchuje na http://localhost:3000
```

Następnie wystawij go publicznie (np. przez [ngrok](https://ngrok.com/)) i zarejestruj jako GitHub App z adresem `https://<twoja-domena>/copilot` w polu *Copilot Agent URL*.

### Dalsze materiały

- [Dokumentacja Copilot Extensions](https://docs.github.com/en/copilot/building-copilot-extensions/about-building-copilot-extensions)
- [Quickstart: building a Copilot extension](https://docs.github.com/en/copilot/building-copilot-extensions/building-a-copilot-extension/building-a-copilot-skillset-for-your-copilot-extension)
