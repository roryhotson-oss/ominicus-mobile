# 🛡️ Ominicus

English | [中文](./README-zh.md)

**Ominicus** is a powerful LLM (Large Language Model) AI assistant for iOS and Android, built on the [Cherry Studio App](https://github.com/CherryHQ/cherry-studio-app) structure.

<div align="center">

**[About This Fork](#-about-this-fork)** | **[Quick Start](#-quick-start)** | **[Features](#-features)** | **[Contributing](#-contributing)** | **[Roadmap](#-roadmap)**

</div>

## 🔗 About This Fork

Ominicus exists in a small family of related projects:

```
Cherry Studio (desktop)  ──►  Cherry Studio App (mobile)  ──fork──►  Ominicus (this repo)
Newelle (GTK/Linux assistant)  ──inspiration──►  website reading, long-term memory
```

- **[Cherry Studio](https://github.com/CherryHQ/cherry-studio)** — the desktop client. Ominicus is _not_ a rebrand of the desktop app; it builds on the **mobile** codebase below.
- **[Cherry Studio App](https://github.com/CherryHQ/cherry-studio-app)** — the official mobile version, where this repository's history begins. Ominicus is a fork of it and retains its architecture (Expo + React Native, HeroUI/Uniwind, Redux + Drizzle, the `@cherrystudio/ai-core` abstraction).
- **[Newelle](https://github.com/qwersyk/Newelle)** — a GTK/Linux assistant whose website-reading (`#https://` prefix) and long-term-memory ideas were ported to mobile here.

### What Ominicus adds on top of upstream

- 🧠 **Long-term memory** — per-assistant memory notes built from topic summaries, recalled in every chat (details below)
- 📏 **Context token budget** — automatic prompt trimming to a configurable token budget
- 🌐 **Website reading** — `#https://example.com your question` in chat
- 📌 **Topic pinning** — pinned topics grouped at the top of the list
- 💰 **Per-topic token usage** — input/output/total from the topic context menu
- 📝 **Notes** — quick mobile capture: create, search, pin, and delete notes from the drawer; auto-saves as you leave
- 🛡️ Ominicus branding and app icon

### Cherry Studio compatibility (unchanged by design)

These identifiers are intentionally kept, so desktop sync and backups keep working — **do not rename them in contributions**:

| What                         | Identifier                                  |
| ---------------------------- | ------------------------------------------- |
| LAN transfer Bonjour service | `_cherrystudio._tcp`                        |
| OAuth redirect scheme        | `cherry-studio://`                          |
| Backup Redux key / filenames | `persist:cherry-studio` / `cherry-studio.*` |
| Import flow                  | `import_from_cherry_studio`                 |
| Provider ids / npm packages  | CherryAI, CherryIN, `@cherrystudio/*`       |

See [docs/ominicus-feature-roadmap.md](./docs/ominicus-feature-roadmap.md) for the full feature comparison against desktop Cherry Studio and Newelle.

## ✨ Features

### Chat & Assistants

- **Multi-LLM Provider Support**: OpenAI, Gemini, Anthropic, and many more — bring your own API key, including local endpoints (Ollama / LM Studio via a custom OpenAI-compatible provider)
- **AI Assistants & Conversations**: Access preset assistants and an assistant marketplace; create your own with custom prompts, models, and tools
- **Multi-model conversations**: mention several models in one topic and compare answers; best-answer marking included
- **🧠 Long-term Memory**: Save any topic to an assistant's memory — Ominicus summarizes the conversation, merges it into a durable memory note, and recalls it in every future chat. Fully editable per assistant
- **📏 Context Token Budget**: Keep prompts within a configurable token budget — older messages are trimmed automatically so long conversations never blow the context window
- **🌐 Website Reading**: Paste `#https://example.com your question` in chat and Ominicus reads the page for you
- **📌 Topic Pinning**: Pin your most important conversations to the top
- **MCP Support**: Connect Model Context Protocol servers with OAuth and a server marketplace
- **Web Search**: pluggable search providers plus built-in model-side search, with result count and content-limit settings
- **Files & images**: attach documents/images to messages (PDF, text, vision models supported)
- **Message tools**: translation, regenerate/edit, reasoning display, TTS playback, voice input
- **Topic tools**: auto-generated topic names, per-topic token usage (input/output/total), export to Markdown, rename, pin, multi-select
- **📝 Notes**: quick capture with auto-derived titles, search, pinning, and auto-save — reachable from the drawer

### Mobile-first Experience

- **iOS & Android**: One codebase, native performance, tablet support
- **Light/Dark themes** with 5 languages (English, 简体中文, 繁體中文, 日本語, Русский)
- **Cherry Studio Desktop Sync**: Import backups and transfer data over LAN from the Cherry Studio desktop client — the transfer protocol and backup format are unchanged from upstream
- **Data control**: local SQLite storage, full backup/restore, in-app history search

## 🛠️ Tech Stack

- **Framework**: Expo React Native
- **Package Manager**: Pnpm
- **UI**: HeroUI + Uniwind (Tailwind CSS)
- **Routing**: React Navigation
- **State Management**: Redux Toolkit
- **Database**: SQLite + Drizzle ORM

## 🚀 Quick Start

> Related development documentation is in the [docs folder](./docs)

1. **Clone the repository**

   ```bash
   git clone https://github.com/roryhotson-oss/ominicus-mobile.git
   ```

2. **Enter the directory**

   ```bash
   cd ominicus-mobile
   ```

3. **Install dependencies**

   ```bash
   pnpm install
   ```

4. **Generate database**

   ```bash
   npx drizzle-kit generate
   ```

5. **Build the MCP Streamable Http**

   ```bash
   cd packages/react-native-streamable-http
   npm install
   npm run build
   ```

6. **Start the application**

   iOS:

   ```bash
   npx expo prebuild -p ios
   cd ios # Add self-signed certificate
   npx expo run:ios -d
   ```

   Android:

   ```bash
   npx expo prebuild -p android
   cd android # Add Android SDK path to local.properties
   npx expo run:android -d
   ```

### Android SDK Setup

#### For windows users:

```bash
sdk.dir=C\:\\Users\\UserName\\AppData\\Local\\Android\\sdk
```

or (for newer versions of Android Studio / IntelliJ IDEA):

```bash
sdk.dir=C\:\\Users\\USERNAME\\AppData\\Local\\Android\\sdk
```

Where USERNAME your PC user name. Also, make sure the folder is sdk or Sdk.

Example:

```bash
sdk.dir=C\:\\Users\\ USERNAME\\AppData\\Local\\Android\\Sdk
```

## 🧭 Try the New Features

### Long-term Memory

1. Long-press any topic → **Save to Memory**
2. Ominicus summarizes the conversation and merges it into the assistant's memory note
3. Open an assistant → **Memory** tab to view or edit what it remembers
4. Every future chat with that assistant silently recalls the memory — it's injected into the system prompt, wrapped in `[ominicus-memory]` tags

### Context Token Budget

1. **Settings → General → Context Token Budget**
2. Set a token budget (e.g. `8000`) — or leave at `0` to disable
3. Older messages are automatically trimmed (newest-first) so prompts stay within budget; the latest user message is always kept

## 🤝 Contributing

Contributions are welcome — this project is a great place to work on real mobile AI features with a modern React Native stack! Whether it's a bug fix, a new feature, better translations, or docs improvements, every contribution counts.

### Ways to contribute

- 🐛 **Fix bugs** — check [open issues](https://github.com/roryhotson-oss/ominicus-mobile/issues) for `bug` labels
- ✨ **Build features** — pick something from the [roadmap](#-roadmap) below; Tier 1 items are ideal first contributions
- 🌍 **Improve translations** — locale files live in `src/i18n/locales/`, run `pnpm sync:i18n` after adding keys
- 📝 **Improve docs** — architecture notes in `docs/` help every new contributor

### Workflow

1. Fork the repo and create a branch from `main`
2. Make your change — keep it focused; add tests for new services under `src/**/__tests__/`
3. Run the checks:

   ```bash
   pnpm typecheck     # TypeScript
   pnpm lint          # ESLint (auto-fixes)
   pnpm format        # Prettier
   pnpm test:ci       # Jest
   pnpm check:i18n    # translation completeness
   ```

4. Open a pull request describing what changed and how you verified it

> Tip: the [feature roadmap](./docs/ominicus-feature-roadmap.md) maps desktop Cherry Studio / Newelle features onto this codebase with concrete implementation notes — it's the best place to find a well-scoped task.

## 🗺️ Roadmap

Highlights from the full [feature roadmap](./docs/ominicus-feature-roadmap.md):

- ✅ Long-term memory — done
- ✅ Topic pinning, website reading, per-topic token usage — done
- ✅ Notes (mobile capture) — done; voice-to-note is the next step
- 🔜 **Knowledge base** — attach document collections to topics with citations
- 🔜 **Quick actions on selected text** — expose Ominicus in the OS share sheet
- 🔜 **Mermaid & chart rendering** — visual message blocks via WebView
- 🔜 **OCR** — turn photographed text into chat input
- 💡 **Ideas welcome** — open an issue with the `feature` label to propose yours

## 🙏 Acknowledgements

- [Cherry Studio](https://github.com/CherryHQ/cherry-studio) — Ominicus is a fork of the Cherry Studio mobile app and retains its architecture and upstream compatibility.
- [Newelle](https://github.com/qwersyk/Newelle) — inspiration for website reading and long-term memory features.

## 📄 License

The upstream project is governed by the standard GNU Affero General Public License v3.0 (AGPL-3.0), available at https://www.gnu.org/licenses/agpl-3.0.html.
