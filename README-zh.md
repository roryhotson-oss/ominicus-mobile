# 🛡️ Ominicus

[English](./README.md) | 中文

**Ominicus** —— 一款强大的 LLM（AI 大语言模型）助手应用，支持 iOS 和 Android，基于 [Cherry Studio App](https://github.com/CherryHQ/cherry-studio-app) 架构构建。

<div align="center">

[![CI](https://github.com/roryhotson-oss/ominicus-mobile/actions/workflows/pr-ci.yml/badge.svg?branch=main)](https://github.com/roryhotson-oss/ominicus-mobile/actions/workflows/pr-ci.yml)
[![License](https://img.shields.io/badge/license-AGPL--3.0-blue)](./README.md#-许可证)
[![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-black)](#-快速开始)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)

**[⬇️ 下载](#-下载)** | **[关于本分支](#-关于本分支)** | **[快速开始](#-快速开始)** | **[功能特性](#-功能特性)** | **[参与贡献](#-参与贡献)** | **[路线图](#-路线图)**

</div>

## ⬇️ 下载

从 **[GitHub Releases](https://github.com/roryhotson-oss/ominicus-mobile/releases)** 获取最新 Android APK —— 每个发布标签都会自动附带构建产物。

- **Android**：从最新 Release 下载 `.apk` 安装（如提示请开启“安装未知应用”）
- **iOS**：按照[快速开始](#-快速开始)自行构建（TestFlight 计划中 —— 见[路线图](#-路线图)）
- **自己构建**：跟随[快速开始](#-快速开始)—— Expo 让这一切很简单

## 🔗 关于本分支

Ominicus 处于一个相关项目家族之中：

```
Cherry Studio（桌面版）──► Cherry Studio App（移动版）──fork──► Ominicus（本仓库）
Newelle（GTK/Linux 助手）──灵感来源──► 网页阅读、长期记忆
```

- **[Cherry Studio](https://github.com/CherryHQ/cherry-studio)** —— 桌面客户端。Ominicus 并不是桌面版换皮，而是基于下方的**移动版**代码库。
- **[Cherry Studio App](https://github.com/CherryHQ/cherry-studio-app)** —— 官方移动版，本仓库历史的起点。Ominicus 是它的分支，保留了其架构（Expo + React Native、HeroUI/Uniwind、Redux + Drizzle、`@cherrystudio/ai-core` 抽象层）。
- **[Newelle](https://github.com/qwersyk/Newelle)** —— GTK/Linux 助手，其网页阅读（`#https://` 前缀）和长期记忆的思路在本项目中被移植到移动端。

### Ominicus 在上游基础上新增的功能

- 🧠 **长期记忆** —— 从话题总结生成每个助手的记忆笔记，在每次对话中自动召回（详见下文）
- 📏 **上下文 Token 预算** —— 按可配置的 Token 预算自动裁剪提示词
- 🌐 **网页阅读** —— 在对话中输入 `#https://example.com 你的问题`
- 📌 **话题置顶** —— 置顶话题分组显示在列表顶部
- 💰 **话题 Token 用量** —— 从话题上下文菜单查看输入/输出/总量
- 📝 **笔记** —— 移动端快速记录：在抽屉中创建、搜索、置顶和删除笔记，离开时自动保存
- 🛡️ Ominicus 品牌与应用图标

### Cherry Studio 兼容性（刻意保持不变）

以下标识符被有意保留，以保证桌面端同步和备份继续可用 —— **贡献时请勿重命名**：

| 内容                    | 标识符                                      |
| ----------------------- | ------------------------------------------- |
| 局域网传输 Bonjour 服务 | `_cherrystudio._tcp`                        |
| OAuth 重定向 scheme     | `cherry-studio://`                          |
| 备份 Redux key / 文件名 | `persist:cherry-studio` / `cherry-studio.*` |
| 导入流程                | `import_from_cherry_studio`                 |
| 提供商 id / npm 包      | CherryAI、CherryIN、`@cherrystudio/*`       |

与桌面版 Cherry Studio 和 Newelle 的完整功能对比见 [docs/ominicus-feature-roadmap.md](./docs/ominicus-feature-roadmap.md)。

## ✨ 功能特性

### 对话与助手

- **多 LLM 提供商支持**：OpenAI、Gemini、Anthropic 等 —— 使用你自己的 API Key，也支持本地端点（通过自定义 OpenAI 兼容提供商接入 Ollama / LM Studio）
- **AI 助手 & 对话**：使用预设助手与助手市场；也可以创建自己的助手，自定义提示词、模型和工具
- **多模型对话**：在同一话题中 @ 多个模型并比较回答；支持最佳回答标记
- **🧠 长期记忆**：将任意话题保存到助手的记忆中 —— Ominicus 会总结对话、合并为持久记忆笔记，并在之后的每次对话中自动召回。每个助手的记忆均可手动编辑
- **📏 上下文 Token 预算**：为提示词设置 Token 预算，自动裁剪较早的消息，长对话也不会超出上下文窗口
- **🌐 网页阅读**：在对话中输入 `#https://example.com 你的问题`，Ominicus 会自动读取网页内容
- **📌 话题置顶**：将重要对话固定在列表顶部
- **MCP 支持**：连接 Model Context Protocol 服务器，支持 OAuth 与服务器市场
- **网页搜索**：可插拔搜索提供商 + 模型内置搜索，支持结果数量与内容长度设置
- **文件与图片**：在消息中附加文档/图片（支持 PDF、文本、视觉模型）
- **消息工具**：翻译、重新生成/编辑、思考过程展示、TTS 播放、语音输入
- **话题工具**：话题名自动生成、话题 Token 用量（输入/输出/总量）、导出 Markdown、重命名、置顶、多选
- **📝 笔记**：快速记录，自动生成标题，支持搜索、置顶和自动保存 —— 可从抽屉直达

### 移动端优先体验

- **iOS & Android**：一套代码，原生性能，支持平板
- **浅色/深色主题**，支持 5 种语言（English、简体中文、繁體中文、日本語、Русский）
- **Cherry Studio 桌面端同步**：从 Cherry Studio 桌面客户端导入备份、局域网传输数据 —— 传输协议与备份格式与上游保持不变
- **数据自主**：本地 SQLite 存储、完整备份/恢复、应用内历史搜索

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

### 代码库导览

| 路径                | 内容                                                               |
| ------------------- | ------------------------------------------------------------------ |
| `src/aiCore/`       | 提供商抽象层：OpenAI/Anthropic/Google 客户端、参数构建、消息转换   |
| `src/services/`     | 业务逻辑：`NoteService`、`MemoryService`、`ConversationService` 等 |
| `db/`               | Drizzle 表结构、迁移、查询、映射（SQLite）                         |
| `src/componentsV2/` | 可复用 UI：基础组件、功能组件、图标、布局                          |
| `src/screens/`      | 页面组件，按功能分组（`notes/`、`assistant/`、`settings/` 等）     |
| `src/navigators/`   | React Navigation 导航栈与应用抽屉                                  |
| `src/i18n/locales/` | 翻译（en、zh-CN、zh-TW、ja、ru）                                   |

### 贡献流程

完整指南见 **[CONTRIBUTING.md](./CONTRIBUTING.md)**（英文）。简版：

1. Fork 仓库并从 `main` 创建分支
2. 完成修改 —— 保持聚焦；在 `src/**/__tests__/` 下为新服务添加测试
3. 运行 `pnpm typecheck && pnpm lint && pnpm test:ci && pnpm check:i18n`
4. 提交 Pull Request，说明改动内容和验证方式

> 提示：[功能路线图](./docs/ominicus-feature-roadmap.md) 将桌面版 Cherry Studio / Newelle 的功能映射到本代码库并附带具体实现说明 —— 是寻找范围明确任务的最佳去处。

## 🗺️ 路线图

摘自完整的[功能路线图](./docs/ominicus-feature-roadmap.md)：

- ✅ 长期记忆 —— 已完成
- ✅ 话题置顶、网页阅读、话题 Token 用量 —— 已完成
- ✅ 笔记（移动端快速记录）—— 已完成；下一步是语音转笔记
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
