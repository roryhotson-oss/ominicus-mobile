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

1. **Topic pinning** — `topics` table has no `is_pinned` column. Add a nullable boolean column (Drizzle migration), a pin action on `TopicScreen` rows, and sort pinned-first in the topic list. Desktop already supports pinned topics, and LAN backup of topics stays compatible because the desktop schema already carries the field.
2. **Notes & Collections (mobile capture)** — desktop roadmap item. Start with a simple `notes` Drizzle table + a Notes tab in the drawer. Voice-to-note via the existing speech-recognition integration is a natural mobile-first extension.
3. **Quick actions on selected text** — desktop has a Selection Assistant. On mobile, expose Ominicus in the iOS Share Sheet / Android text-selection menu so users can send selected text to a chosen assistant without opening the app.
4. **Per-topic token cost summary** — `messages.usage` is already persisted; aggregate it per topic and show a cost row in `TopicScreen` settings using configurable per-model pricing (desktop has this in its model settings).

### Tier 2 — Medium effort

5. **Knowledge base integration** — citations plumbing already exists (`citationCallbacks.ts`, knowledge types). Add knowledge base attachment to topics and a document ingestion screen (PDF/text), reusing the existing file upload pipeline.
6. **Mermaid / chart rendering** — markdown renderer exists; add a Mermaid block type that renders via a WebView (desktop parity for viz messages) with export-to-image via the media library.
7. **OCR for images** — desktop roadmap item; `expo-camera` and image picker are already wired. Add an OCR message tool so photographed text becomes chat input.
8. **Advanced assistant settings parity** — desktop exposes context count/pinned prompts per assistant; extend `AssistantDetailScreen` tabs with the missing parameters that the aiCore already accepts (e.g. reasoning effort, max tokens warnings already exist).

### Tier 3 — Larger initiatives

9. **Mini-app / plugin system** — desktop roadmap; would need a sandboxed JS runtime (e.g. WebView bridge) and a plugin manifest + market screen next to the MCP market.
10. **Widgets & system integration** — iOS/Android home-screen widget for "new chat with assistant X" and continued conversation from notifications.
11. **Multi-window / split view (tablet)** — `supportsTablet` is already true; adopt a two-pane chat layout for iPad/Android tablets to mirror desktop's multi-window support.

## Desktop Compatibility (must keep)

- `_cherrystudio._tcp` Bonjour service and LAN transfer protocol
- `cherry-studio://` OAuth redirect scheme and MCP client metadata
- `persist:cherry-studio` backup format and `cherry-studio.*` backup filenames
- `import_from_cherry_studio` flow and backup-file name validation (`useRestore.ts`)
- CherryAI / CherryIN provider ids and the `@cherrystudio/*` npm packages

These identifiers are intentionally unchanged by the Ominicus rebrand.
