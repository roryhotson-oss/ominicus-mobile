# 🛡️ Welcome to Ominicus

English | [中文](./README-zh.md)

🛡️ **Ominicus** —— A powerful LLM (Large Language Model) AI assistant for iOS and Android, built on the [Cherry Studio App](https://github.com/CherryHQ/cherry-studio-app) structure.

Ominicus keeps full compatibility with the Cherry Studio ecosystem: LAN transfer, desktop backups, and the CherryAI provider all keep working.

## ✨ Key Features

- **Multi-LLM Provider Support**: (Gradually integrating) OpenAI, Gemini, Anthropic, and more.
- **AI Assistants & Conversations**: Access preset assistants and engage in smooth multi-model conversations.
- **Mobile Optimized**: Designed specifically for iOS/Android with light/dark theme support.
- **Core Tools**: Conversation management, history search, data migration.
- **Cherry Studio Desktop Sync**: Import backups and transfer data over LAN from the Cherry Studio desktop client.

## 🛠️ Tech Stack

- **Framework**: Expo React Native
- **Package Manager**: Pnpm
- **UI**: HeroUI + Uniwind (Tailwind CSS)
- **Routing**: React Navigation
- **State Management**: Redux Toolkit

## 🚀 Development

> Related development documentation is in the docs folder

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
sdk.dir=C\\:\\Users\\USERNAME\\AppData\\Local\\Android\\sdk
```

Where USERNAME your PC user name. Also, make sure the folder is sdk or Sdk.
Example:

```bash
sdk.dir=C\\:\\Users\\ USERNAME\\AppData\\Local\\Android\\Sdk
```

## 🤝 Acknowledgements

- [Cherry Studio](https://github.com/CherryHQ/cherry-studio) — Ominicus is a fork of the Cherry Studio mobile app and retains its architecture and upstream compatibility.

## 📄 License

The upstream project is governed by the standard GNU Affero General Public License v3.0 (AGPL-3.0), available at https://www.gnu.org/licenses/agpl-3.0.html.
