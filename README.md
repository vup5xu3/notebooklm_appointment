# NLM Tracker

NotebookLM Coda 使用預約記錄工具

## 部署步驟

### 1. 上傳到 GitHub
建一個新的 repo，把這個資料夾的所有檔案 push 上去。

### 2. 部署到 Vercel
1. 去 [vercel.com](https://vercel.com) 登入
2. New Project → Import 你的 GitHub repo
3. 不需要改任何設定，直接 Deploy

### 3. 設定環境變數（重要！）
Deploy 完成後：
- 進 Vercel 專案 → Settings → Environment Variables
- 新增以下兩個變數：

| Key | Value |
|---|---|
| `SUPABASE_URL` | `https://lhnviqsadfxpvwwmsubz.supabase.co` |
| `SUPABASE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxobnZpcXNhZGZ4cHZ3d21zdWJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzNDQwMjYsImV4cCI6MjA5NDkyMDAyNn0.xzUOev3w-IxFB3Z5fjatYJef2VUWqJLMI8RUJT98OzM` |

4. 設定完後 Vercel 會自動重新部署
5. 完成！把網址分享給團隊就可以一起用

## 專案結構

```
nlm-tracker/
├── index.html        ← 前端頁面
├── api/
│   ├── users.js      ← 使用者 API
│   └── logs.js       ← 記錄 API
├── vercel.json       ← Vercel 路由設定
└── package.json
```
