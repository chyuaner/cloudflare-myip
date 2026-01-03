# Cloudflare MyIP

[English](#english) | [繁體中文](#繁體中文)

---

<h2 id="english">English</h2>

A premium, feature-rich IP and Geolocation information service built on Cloudflare Workers and Hono.

### ✨ Features

-   **Dual Stack Support**: Full support for IPv4 and IPv6 detection.
-   **Rich Geolocation Data**: Provides ISP, ASN, Country, City, Continent, Timezone, and more.
-   **Dynamic Map Background**: Real-time map background based on your current location (powered by Yandex Maps).
-   **Premium Design**: Modern Glassmorphism UI with smooth animations and full Dark Mode support.
-   **Multi-format API**: 
    -   `HTML`: Beautiful web interface for human users.
    -   `JSON`: Structured data for developers.
    -   `Plain Text`: Simple output for CLI tools like `curl`.
-   **Time Service**: Integrated endpoint for local and UTC time with real-time clock synchronization.
-   **Cloudflare Native**: Optimized for performance and security using Cloudflare Workers.

### 🚀 Deployment Options

This project is highly flexible and supports several deployment environments:

#### 1. Cloudflare Workers (Primary)
The recommended way to deploy, leveraging Cloudflare's global edge network and native Geolocation data.
-   **Command**: `npm run deploy`

#### 2. Vercel
Supports deployment as Vercel Functions.
-   **Command**: `npm run dev:vercel` (local testing) or deploy via Vercel Dashboard/CLI.

#### 3. Traditional Node.js Server
Running as a standard Node.js application (uses `@hono/node-server`). Ideal for Docker or private servers.
-   **Command**: `npm start` (standard launch) or `npm run start:node`.
-   **Note**: Includes an integrated GeoIP database (via `mmdb-lib`) for local environment IP lookups.

### 🛠️ Getting Started

#### Prerequisites
- Node.js (version specified in `.node-version`)
- Cloudflare Wrangler CLI (if deploying to Workers)

#### Installation

```bash
npm install
```

#### Local Development (Wrangler)

```bash
npm run dev
```

#### Type Generation

[To synchronize types based on your Worker configuration](https://developers.cloudflare.com/workers/wrangler/commands/#types):

```bash
npm run cf-typegen
```

---

<h2 id="繁體中文">繁體中文</h2>

這是一個基於 Cloudflare Workers 與 Hono 構建的高質感、功能豐富的 IP 與地理位置資訊服務。

### ✨ 核心特色

-   **雙棧支援**：完整支援 IPv4 與 IPv6 檢測。
-   **豐富地理資訊**：提供包括 ISP、ASN、國家、城市、大洲、時區等詳細數據。
-   **動態地圖背景**：根據使用者目前位置即時呈現地圖背景（採用 Yandex Maps）。
-   **進階設計感**：現代化的毛玻璃（Glassmorphism）UI，具備平滑動畫並完整支援深色模式（Dark Mode）。
-   **多格式介面**：
    -   `HTML`：專為人類設計的美觀網頁介面。
    -   `JSON`：專為開發者提供的結構化數據。
    -   `純文字`：適合 `curl` 等 CLI 工具使用的簡潔輸出。
-   **時間服務**：提供本地與 UTC 時間，並包含客戶端即時時鐘同步。
-   **Cloudflare 原生**：針對 Cloudflare Workers 優化，確保高效能與安全性。

### 🚀 部署方式

本專案具備高度靈活性，支援多種部署環境：

#### 1. Cloudflare Workers (主推)
官方推薦的部署方式，充分利用 Cloudflare 的全球邊緣網路與原生地理位置數據。
-   **指令**：`npm run deploy`

#### 2. Vercel
支援部署為 Vercel Functions。
-   **指令**：可透過 `npm run dev:vercel` 進行本地開發測試，或直接經由 Vercel Dashboard/CLI 部署。

#### 3. 傳統 Node.js 伺服器
作為標準 Node.js 應用程式運行（使用 `@hono/node-server`）。適合 Docker 或私有伺服器。
-   **指令**：`npm start` 或 `npm run start:node`。
-   **備註**：內建 GeoIP 資料庫解決方案（透過 `mmdb-lib`），解決非 CF 環境下的 IP 查詢需求。

### 🛠️ 快速上手

#### 前置要求
- Node.js (請參考 `.node-version`)
- Cloudflare Wrangler CLI (若需部署至 Workers)

#### 安裝步驟

```bash
npm install
```

#### 本地開發 (Wrangler)

```bash
npm run dev
```

#### 型別生成

[根據您的 Worker 配置產生/同步型別控制](https://developers.cloudflare.com/workers/wrangler/commands/#types):

```bash
npm run cf-typegen
```

---

### 📄 License

This project is licensed under the [MIT License](LICENSE).
