# Contributing to Ominicus

Thanks for your interest in contributing! Ominicus is an Expo/React Native AI assistant for iOS and Android — a great place to work on real mobile AI features with a modern stack.

## Ways to help

- 🐛 **Fix bugs** — issues labeled [`bug`](https://github.com/roryhotson-oss/ominicus-mobile/labels/bug)
- ✨ **Build features** — issues labeled [`good first issue`](https://github.com/roryhotson-oss/ominicus-mobile/labels/good%20first%20issue) are ideal starting points; the [feature roadmap](./docs/ominicus-feature-roadmap.md) maps desktop Cherry Studio / Newelle features onto this codebase with concrete implementation notes
- 🌍 **Improve translations** — locale files live in `src/i18n/locales/` (en, zh-CN, zh-TW, ja, ru)
- 📝 **Improve docs** — architecture notes in `docs/` help every new contributor

## Codebase map

| Path                | What lives there                                                                          |
| ------------------- | ----------------------------------------------------------------------------------------- |
| `src/aiCore/`       | Provider abstraction: OpenAI/Anthropic/Google clients, param building, message conversion |
| `src/services/`     | Business logic: `NoteService`, `MemoryService`, `ConversationService`, orchestration      |
| `db/`               | Drizzle schema, migrations, queries, mappers (SQLite)                                     |
| `src/componentsV2/` | Reusable UI: base components, features, icons, layout                                     |
| `src/screens/`      | Screen components, grouped by feature (`notes/`, `assistant/`, `settings/`, …)            |
| `src/navigators/`   | React Navigation stacks and the app drawer                                                |
| `src/i18n/locales/` | Translations                                                                              |

## Development setup

1. **Clone and install**

   ```bash
   git clone https://github.com/roryhotson-oss/ominicus-mobile.git
   cd ominicus-mobile
   pnpm install
   ```

2. **Generate the database**

   ```bash
   npx drizzle-kit generate
   ```

3. **Build the MCP Streamable HTTP package**

   ```bash
   cd packages/react-native-streamable-http
   npm install
   npm run build
   cd ../..
   ```

4. **Run the app** (see the [README](./README.md#-quick-start) for platform-specific notes)

   ```bash
   npx expo prebuild -p android   # or -p ios
   npx expo run:android -d        # or: npx expo run:ios -d
   ```

## Making changes

- **Keep PRs focused** — one feature or fix per pull request
- **Follow existing patterns** — services follow the `XService` singleton pattern with a matching `XDatabase` facade; DB changes go through schema (`db/schema/`) → `drizzle-kit generate` → queries → mapper → facade
- **Add tests** for new services under `src/**/__tests__/` — the existing suites (`NoteService.test.ts`, `MemoryService.test.ts`, `ContextTrimming.test.ts`) show the mocking style
- **i18n** — add keys to `src/i18n/locales/en-us.json`, then run `pnpm sync:i18n` to propagate and sort; all 5 locales must stay complete (`pnpm check:i18n` enforces this)

### Things that must not change

These identifiers are intentionally kept for Cherry Studio desktop compatibility — **do not rename them**:

- `_cherrystudio._tcp` (LAN transfer Bonjour service)
- `cherry-studio://` (OAuth redirect scheme)
- `persist:cherry-studio` and `cherry-studio.*` (backup format)
- `import_from_cherry_studio` (import flow)
- CherryAI / CherryIN provider ids and `@cherrystudio/*` packages

## Checks to run before opening a PR

```bash
pnpm typecheck     # TypeScript
pnpm lint          # ESLint (auto-fixes where it can)
pnpm format        # Prettier
pnpm test:ci       # Jest — all tests must pass
pnpm check:i18n    # translation completeness
```

Or all at once: `pnpm check`

## Pull requests

1. Fork the repo and create a branch from `main`
2. Make your change, run the checks above
3. Open a pull request describing:
   - **What changed** and why
   - **How you verified it** (tests run, manual testing done, screenshots for UI changes)
4. CI runs on every PR — keep it green

## License

By contributing, you agree that your contributions are licensed under the repository's AGPL-3.0 license (same as upstream Cherry Studio).
