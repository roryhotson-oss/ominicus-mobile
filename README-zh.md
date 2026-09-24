# 🛡️ Ominicus

[English](./README.md) | 中文

**Ominicus** —— 一款强大的 LLM（AI 大语言模型）助手应用，支持 iOS 和 Android，基于 [Cherry Studio App](https://github.com/CherryHQ/cherry-studio-app) 架构构建。

Ominicus 与 Cherry Studio 生态保持完全兼容：局域网传输、桌面端备份、CherryAI 提供商均可继续使用。

<div align="center">

**[快速开始](#-快速开始)** | **[功能特性](#-功能特性)** | **[参与贡献](#-参与贡献)** | **[路线图](#-路线图)**

</div>

## ✨ 功能特性

### 对话与助手

- **多 LLM 提供商支持**：OpenAI、Gemini、Anthropic 等 —— 使用你自己的 API Key
- **AI 助手 & 对话**：使用预设助手，进行流畅的多模型对话
- **🧠 长期记忆**：将任意话题保存到助手的记忆中 —— Ominicus 会总结对话、合并为持久记忆笔记，并在之后的每次对话中自动召回。每个助手的记忆均可手动编辑
- **📏 上下文 Token 预算**：为提示词设置 Token 预算，自动裁剪较早的消息，长对话也不会超出上下文窗口
- **🌐 网页阅读**：在对话中输入 `#https://example.com 你的问题`，Ominicus 会自动读取网页内容
- **📌 话题置顶**：将重要对话固定在列表顶部
- **MCP 支持**：连接 Model Context Protocol 服务器，支持 OAuth 与服务器市场
- **实用工具**：网页搜索、消息翻译、TTS、话题 Token 用量统计、最佳回答标记

### 移动端优先体验

- **iOS & Android**：一套代码，原生性能
- **浅色/深色主题**，支持 5 种语言（English、简体中文、繁體中文、日本語、Русский）
- **Cherry Studio 桌面端同步**：从 Cherry Studio 桌面客户端导入备份、局域网传输数据

## 🛠️ 技术栈

- **框架**：Expo React Native
- **包管理器**：Pnpm
- **UI**：HeroUI + Uniwind (Tailwind CSS)
- **路由**：React Navigation
- **状态管理**：Redux Toolkit
- **数据库**：SQLite + Drizzle ORM

## 🚀 快速开始

> 相关开发文档位于 docs 文件夹

1. **克隆仓库**

   ```bash
   git clone https://github.com/roryhotson-oss/ominicus-mobile.git
   ```

2. **进入目录**

   ```bash
   cd ominicus-mobile
   ```

3. **安装依赖**

   ```bash
   pnpm install
   ```

4. **生成数据库**

   ```bash
   npx drizzle-kit generate
   ```

5. **构建 MCP Streamable Http**

   ```bash
   cd packages/react-native-streamable-http
   npm install
   npm run build
   ```

6. **启动应用**

   iOS:

   ```bash
   npx expo prebuild -p ios
   cd ios # 添加自签名证书
   npx expo run:ios -d
   ```

   Android:

   ```bash
   npx expo prebuild -p android
   cd android # 在 local.properties 中添加 Android SDK 路径
   npx expo run:android -d
   ```

### Android SDK 配置（Windows 用户）

```bash
sdk.dir=C\:\\Users\\UserName\\AppData\\Local\\Android\\sdk
```

或（适用于较新版本的 Android Studio / IntelliJ IDEA）：

```bash
sdk.dir=C\:\\Users\\USERNAME\\AppData\\Local\\Android\\sdk
```

其中 USERNAME 为你的电脑用户名，同时请确认文件夹名为 sdk 或 Sdk。

示例：

```bash
sdk.dir=C\:\\Users\\ USERNAME\\AppData\\Local\\Android\\Sdk
```

## 🧭 试用新功能

### 长期记忆

1. 长按任意话题 → **保存到记忆**
2. Ominicus 会总结对话并合并到助手的记忆笔记中
3. 打开助手 → **记忆** 标签页，查看或编辑它的记忆内容
4. 之后与该助手的每次对话都会自动召回记忆 —— 记忆以 `[ominicus-memory]` 标签注入系统提示词

### 上下文 Token 预算

1. **设置 → 通用 → 上下文 Token 预算**
2. 设置 Token 预算（如 `8000`），或保持 `0` 表示关闭
3. 超出预算时会自动裁剪较早的消息（优先保留最新消息），最新一条用户消息始终保留

## 🤝 参与贡献

欢迎参与贡献 —— 这是一个用现代 React Native 技术栈开发真实移动 AI 功能的好项目！无论是修复 Bug、开发新功能、改进翻译还是完善文档，每一份贡献都很重要。

### 贡献方式

- 🐛 **修复 Bug** —— 查看 [开放 Issue](https://github.com/roryhotson-oss/ominicus-mobile/issues) 中的 `bug` 标签
- ✨ **开发功能** —— 从[路线图](#-路线图)中挑选；Tier 1 条目是理想的首个贡献
- 🌍 **改进翻译** —— 语言文件位于 `src/i18n/locales/`，添加 key 后运行 `pnpm sync:i18n`
- 📝 **完善文档** —— `docs/` 中的架构说明能帮助每位新贡献者

### 贡献流程

1. Fork 仓库并从 `main` 创建分支
2. 完成修改 —— 保持聚焦；在 `src/**/__tests__/` 下为新服务添加测试
3. 运行检查：

   ```bash
   pnpm typecheck     # TypeScript
   pnpm lint          # ESLint（自动修复）
   pnpm format        # Prettier
   pnpm test:ci       # Jest
   pnpm check:i18n    # 翻译完整性
   ```

4. 提交 Pull Request，说明改动内容和验证方式

> 提示：[功能路线图](./docs/ominicus-feature-roadmap.md) 将桌面版 Cherry Studio / Newelle 的功能映射到本代码库并附带具体实现说明 —— 是寻找范围明确任务的最佳去处。

## 🗺️ 路线图

摘自完整的[功能路线图](./docs/ominicus-feature-roadmap.md)：

- ✅ 长期记忆 —— 已完成
- ✅ 话题置顶、网页阅读、话题 Token 用量 —— 已完成
- 🔜 **笔记与收藏** —— 抽屉中的笔记标签页，移动端快速记录
- 🔜 **知识库** —— 将文档集合附加到话题并支持引用
- 🔜 **选中文本快捷操作** —— 在系统分享面板中暴露 Ominicus
- 🔜 **Mermaid 与图表渲染** —— 通过 WebView 渲染可视化消息
- 🔜 **OCR** —— 将拍摄的照片文字转为对话输入
- 💡 **欢迎提出想法** —— 使用 `feature` 标签提 Issue

## 🙏 鸣谢

- [Cherry Studio](https://github.com/CherryHQ/cherry-studio) —— Ominicus 是 Cherry Studio 移动应用的一个分支，保留了其架构和上游兼容性。
- [Newelle](https://github.com/qwersyk/Newelle) —— 网页阅读与长期记忆功能的灵感来源。

## 📄 许可证

上游项目采用标准的 GNU Affero General Public License v3.0 (AGPL-3.0) 许可证，详见 https://www.gnu.org/licenses/agpl-3.0.html。
