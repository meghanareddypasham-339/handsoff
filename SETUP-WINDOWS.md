# HandoffOS — Windows Setup

## 1. Open this folder
Open PowerShell inside the folder that contains `package.json`.

You should see:

```text
HandoffOS-FIXED
├── package.json
├── vite.config.ts
├── client
├── server
└── shared
```

## 2. Install

```powershell
npm install
```

The incompatible `@builder.io/vite-plugin-jsx-loc` dependency has been removed, so you do NOT need `--force` or `--legacy-peer-deps`.

## 3. Start

```powershell
npm run dev
```

Open:

```text
http://localhost:3000
```

## 4. If port 3000 is already busy

```powershell
netstat -ano | findstr :3000
```

Then stop the process using its PID:

```powershell
taskkill /PID <PID> /F
```

## Main fixes in this package
- Status pills safely handle missing/undefined status values.
- Removed the Vite 4/5-only JSX location plugin that conflicted with Vite 7.
- Made the development/start scripts work from Windows PowerShell/cmd.
