# Setup Guide - JSA Quarterly Goals Dashboard

## 🚀 Quick Start

### 1. Installation

```bash
npm install
```

### 2. Development

```bash
npm run dev
```

Öffne Browser: `http://localhost:5173`

### 3. Login

**Default Password:** `password`

**Wichtig:** Das ist nur ein Demo-Passwort. Ändere es für Production!

---

## 🔐 Passwort ändern

### Option 1: Online SHA-256 Generator
1. Gehe zu: https://emn178.github.io/online-tools/sha256.html
2. Gib dein neues Passwort ein
3. Kopiere den Hash
4. Öffne `src/components/LoginScreen.jsx`
5. Ersetze die Zeile:
   ```javascript
   const MASTER_PASSWORD_HASH = 'DEIN_NEUER_HASH_HIER';
   ```

### Option 2: Node.js
```bash
node -e "console.log(require('crypto').createHash('sha256').update('dein_passwort').digest('hex'))"
```

### Option 3: PowerShell
```powershell
$password = "dein_passwort"
$hash = [System.Security.Cryptography.SHA256]::Create().ComputeHash([System.Text.Encoding]::UTF8.GetBytes($password))
[System.BitConverter]::ToString($hash).Replace("-", "").ToLower()
```

---

## 📦 GitHub Pages Deployment

### Erstmaliges Setup

1. **Repository erstellen**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/DEIN_USERNAME/Quartalsziele-App.git
   git push -u origin main
   ```

2. **GitHub Pages aktivieren**
   - Gehe zu: Repository Settings → Pages
   - Source: GitHub Actions
   - Warte auf ersten Deploy (automatisch via GitHub Actions)

3. **Base URL anpassen (falls nötig)**
   - Öffne `vite.config.js`
   - Ändere `base: '/Quartalsziele-App/'` zu deinem Repository-Namen

### Manuelles Deployment

```bash
npm run deploy
```

---

## 🔒 Sicherheitshinweise

### ✅ Was ist sicher:
- Alle Daten AES-256 verschlüsselt in localStorage
- Passwort wird nie gespeichert (nur SHA-256 Hash)
- Rate-Limiting: 3 Versuche, dann 5min Sperre
- Session-basiert (Tab schließen = Logout)
- Kein Backend = keine Server-Angriffsfläche

### ⚠️ Limitierungen:
- Daten nur im Browser (kein Sync zwischen Geräten)
- Client-Side Security (kein Server-Side Schutz)
- Passwort-Hash ist im Source Code sichtbar
- Backup nur via Export/Import

### 💡 Empfehlungen:
- Nutze ein starkes, einzigartiges Passwort
- Exportiere regelmäßig Backups
- Teile das Passwort nur mit deinem Team
- Für höhere Sicherheit: Verwende Backend-Lösung

---

## 📊 Features

### Goal Management
- ✅ CRUD Operations (Create, Read, Update, Delete)
- ✅ MoSCoW Priorisierung (Must/Should/Could/Won't)
- ✅ Progress Tracking (0-100%)
- ✅ Status Management (Not Started/In Progress/Blocked/Done)
- ✅ Team Member Assignment
- ✅ Deadline Tracking

### Quarterly Features
- ✅ Quarter Navigation (Prev/Next)
- ✅ Archive Funktion
- ✅ Retrospective Notes
- ✅ Filter by Category
- ✅ Filter by Owner

### Data Management
- ✅ Export to JSON
- ✅ Import from JSON
- ✅ Encrypted localStorage
- ✅ Auto-save

---

## 🎨 UI Customization

### Farben ändern
Öffne `tailwind.config.js`:

```javascript
colors: {
  terminal: {
    bg: '#0a0a0a',        // Hintergrund
    green: '#00ff00',     // Primärfarbe
    darkgreen: '#00aa00', // Sekundärfarbe
    gray: '#333333',      // Grau
    lightgray: '#666666', // Hellgrau
  }
}
```

### Font ändern
Öffne `index.html` und ändere Google Fonts Link.

---

## 🐛 Troubleshooting

### Build-Fehler
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### GitHub Pages zeigt 404
- Überprüfe `base` in `vite.config.js`
- Stelle sicher, dass GitHub Actions erfolgreich durchgelaufen ist
- Warte 2-3 Minuten nach Deploy

### Daten verloren
- Exportiere regelmäßig Backups!
- localStorage wird beim Browser-Cache-Löschen gelöscht
- Importiere letzten Backup

---

## 📝 Team Members

Hardcoded in `src/utils/quarters.js`:
- Maike
- Bacha
- Johannes
- Maxi
- Kai

Zum Ändern: Bearbeite `TEAM_MEMBERS` Array.

---

## 🤝 Support

Bei Fragen oder Problemen:
1. Überprüfe diese Dokumentation
2. Schaue in `README.md`
3. Frage dein Team

---

**Happy Goal Tracking! 🎯**
