# Ominicus Feature Roadmap

This document compares Ominicus (this repo, mobile) against the [Cherry Studio desktop client](https://github.com/CherryHQ/cherry-studio) and proposes features to close the gap, ordered by user impact and implementation cost on the mobile (Expo/React Native, HeroUI + Uniwind, Redux + Drizzle) stack.

## Current State

### Already available in Ominicus

- Multi-provider chat (OpenAI, Anthropic, Google, and more via the aiCore abstraction)
- Assistants with marketplace, topics, message blocks, multi-model conversations
- MCP servers (market + detail screens, streamable HTTP client, OAuth)
- Web search providers
- Backup / restore, LAN transfer with the desktop client
- Message translation, TTS playback, best-answer marking, token usage display

### Missing vs desktop Cherry Studio

## Proposed Features

### Tier 1 — High value, low risk (fits current architecture)

1. **Topic pinning** — ✅ _Implemented._ `isPinned` column, context-menu pin/unpin, Pinned group in the topic list; carried through backup/restore automatically.
2. **Notes & Collections (mobile capture)** — desktop roadmap item. Start with a simple `notes` Drizzle table + a Notes tab in the drawer. Voice-to-note via the existing speech-recognition integration is a natural mobile-first extension.
3. **Quick actions on selected text** — desktop has a Selection Assistant. On mobile, expose Ominicus in the iOS Share Sheet / Android text-selection menu so users can send selected text to a chosen assistant without opening the app.
4. **Per-topic token cost summary** — ✅ _Partially implemented._ Token Usage action in the topic context menu aggregates persisted `messages.usage` per topic (input/output/total). Per-model pricing for cost display is still open.

### Tier 2 — Medium effort

5. **Knowledge base integration** — citations plumbing already exists (`citationCallbacks.ts`, knowledge types). Add knowledge base attachment to topics and a document ingestion screen (PDF/text), reusing the existing file upload pipeline.
6. **Mermaid / chart rendering** — markdown renderer exists; add a Mermaid block type that renders via a WebView (desktop parity for viz messages) with export-to-image via the media library.
7. **OCR for images** — desktop roadmap item; `expo-camera` and image picker are already wired. Add an OCR message tool so photographed text becomes chat input.
8. **Advanced assistant settings parity** — desktop exposes context count/pinned prompts per assistant; extend `AssistantDetailScreen` tabs with the missing parameters that the aiCore already accepts (e.g. reasoning effort, max tokens warnings already exist).

### Tier 3 — Larger initiatives

9. **Mini-app / plugin system** — desktop roadmap; would need a sandboxed JS runtime (e.g. WebView bridge) and a plugin manifest + market screen next to the MCP market.
10. **Widgets & system integration** — iOS/Android home-screen widget for "new chat with assistant X" and continued conversation from notifications.
11. **Multi-window / split view (tablet)** — `supportsTablet` is already true; adopt a two-pane chat layout for iPad/Android tablets to mirror desktop's multi-window support.

## Newelle Feature Analysis

[Newelle](https://github.com/qwersyk/Newelle) (GTK/Linux assistant, GPL-3) has several features worth porting. Assessed for the mobile/Expo stack:

| Newelle feature                                    | Ported?               | Notes                                                                                                                                                                                                        |
| -------------------------------------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Website reading (`#https://` prefix)               | ✅ Implemented        | `WebsiteReaderService` — send `#https://example.com your question` in chat; the page is fetched, stripped to text, and prepended to the prompt with a 15s timeout and 100k char cap                          |
| Terminal command execution                         | ❌ Not applicable     | No shell access on iOS; Android would need privileged apps. Skip                                                                                                                                             |
| Local models (llama.cpp/Ollama)                    | ⚠️ Partial fit        | The aiCore can already point at a LAN Ollama/LM Studio endpoint via a custom OpenAI-compatible provider — no new code needed, document it instead                                                            |
| Long-term memory                                   | ✅ Implemented        | `memory` column on assistants + `MemoryService.rememberTopic()` — "Save to Memory" in the topic context menu summarizes the topic and merges it into the assistant's memory note, injected into every prompt |
| Scheduled tasks                                    | 🔜 Roadmap            | Requires background execution (expo-task-manager); pairs with the existing ReminderTools                                                                                                                     |
| Profile manager                                    | 🔜 Roadmap            | Maps to preference presets; medium effort                                                                                                                                                                    |
| Chat branching                                     | 🔜 Roadmap            | Message-level regenerate already exists; full branching needs a fork-map UI                                                                                                                                  |
| Chat folders                                       | ✅ Covered by pinning | Pinning covers the primary need; folders can build on the same pattern later                                                                                                                                 |
| Extensions/skills                                  | 🔜 Roadmap            | Equivalent to the desktop mini-app/plugin system (Tier 3)                                                                                                                                                    |
| Voice mode / call mode / wakeword                  | ⚠️ Exists             | App already has speech-to-text and TTS; continuous conversation mode is the gap                                                                                                                              |
| Multichat                                          | ✅ Exists             | Multi-model mentions already supported                                                                                                                                                                       |
| Dynamic context management (token-budget trimming) | ✅ Implemented        | `chat.context_token_budget` preference (Settings → General) — `trimMessagesToTokenBudget()` drops oldest messages that exceed the budget before sending; LLM summarization of trimmed content is still open  |
| Image generation                                   | ✅ Exists             | GenerateImage response plumbing already present                                                                                                                                                              |

### Implemented in this pass

- **Website reading** (`#https://` prefix, Newelle-style) — `src/services/WebsiteReaderService.ts`, wired into the send flow in `useMessageSend` with error dialog and input restore; unit-tested URL extraction; localized error strings in 5 languages
- **Per-topic token usage** — `getTopicTokenUsage` aggregation query in `db/queries/messages.queries.ts`, exposed via `messageDatabase`, shown from the topic context menu
- **Topic pinning** — see Tier 1 above
- **Long-term memory (Newelle-style)** — `memory` column on `assistants` (migration `0017`), `src/services/MemoryService.ts` with `rememberTopic()` (topic summary → merged memory note), memory injection into the system prompt in `fetchChatCompletion`, editable **Memory** tab on the assistant detail screen, "Save to Memory" topic context-menu action; i18n in 5 languages; unit tests for prompt assembly
- **Dynamic context management (token budget)** — `chat.context_token_budget` preference (0 = off by default) with UI in Settings → General, `trimMessagesToTokenBudget()` in `ConversationService` keeps prompts within budget (newest-first greedy fill, last user message always kept); unit tests for the trimming logic

## Desktop Compatibility (must keep)

- `_cherrystudio._tcp` Bonjour service and LAN transfer protocol
- `cherry-studio://` OAuth redirect scheme and MCP client metadata
- `persist:cherry-studio` backup format and `cherry-studio.*` backup filenames
- `import_from_cherry_studio` flow and backup-file name validation (`useRestore.ts`)
- CherryAI / CherryIN provider ids and the `@cherrystudio/*` npm packages

These identifiers are intentionally unchanged by the Ominicus rebrand.
