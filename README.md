# 🛡️ Ominicus

English | [中文](./README-zh.md)

**Ominicus** is a powerful LLM (Large Language Model) AI assistant for iOS and Android, built on the [Cherry Studio App](https://github.com/CherryHQ/cherry-studio-app) structure.

Ominicus keeps full compatibility with the Cherry Studio ecosystem: LAN transfer, desktop backups, and the CherryAI provider all keep working.

<div align="center">

**[Quick Start](#-quick-start)** | **[Features](#-features)** | **[Contributing](#-contributing)** | **[Roadmap](#-roadmap)**

</div>

## ✨ Features

### Chat & Assistants

- **Multi-LLM Provider Support**: OpenAI, Gemini, Anthropic, and many more — bring your own API key
- **AI Assistants & Conversations**: Access preset assistants and engage in smooth multi-model conversations
- **🧠 Long-term Memory**: Save any topic to an assistant's memory — Ominicus summarizes the conversation, merges it into a durable memory note, and recalls it in every future chat. Fully editable per assistant
- **📏 Context Token Budget**: Keep prompts within a configurable token budget — older messages are trimmed automatically so long conversations never blow the context window
- **🌐 Website Reading**: Paste `#https://example.com your question` in chat and Ominicus reads the page for you
- **📌 Topic Pinning**: Pin your most important conversations to the top
- **MCP Support**: Connect Model Context Protocol servers with OAuth and a server marketplace
- **Tools**: Web search providers, message translation, TTS, token usage per topic, best-answer marking

### Mobile-first Experience

- **iOS & Android**: One codebase, native performance
- **Light/Dark themes** with 5 languages (English, 简体中文, 繁體中文, 日本語, Русский)
- **Cherry Studio Desktop Sync**: Import backups and transfer data over LAN from the Cherry Studio desktop client

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
- 🔜 **Notes & Collections** — mobile capture with a Notes tab in the drawer
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
