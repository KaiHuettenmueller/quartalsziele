# GitHub Pages Deployment Guide

## 🚀 Schnell-Anleitung

### Schritt 1: GitHub Repository erstellen

```bash
# Im Projekt-Verzeichnis
git init
git add .
git commit -m "Initial commit: JSA Quarterly Goals Dashboard"
git branch -M main
```

Erstelle ein neues Repository auf GitHub:
- Gehe zu: https://github.com/new
- Name: `Quartalsziele-App` (oder beliebiger Name)
- Visibility: Private (empfohlen) oder Public
- **NICHT** initialisieren mit README, .gitignore oder License

```bash
# Ersetze USERNAME mit deinem GitHub Username
git remote add origin https://github.com/USERNAME/Quartalsziele-App.git
git push -u origin main
```

### Schritt 2: GitHub Pages aktivieren

1. Gehe zu deinem Repository auf GitHub
2. Klicke auf **Settings** (Zahnrad-Icon)
3. Scrolle zu **Pages** im linken Menü
4. Bei **Source** wähle: **GitHub Actions**
5. Fertig! Der erste Deploy startet automatisch

### Schritt 3: Warten & Testen

- Gehe zu **Actions** Tab in deinem Repository
- Warte bis der "Deploy to GitHub Pages" Workflow grün ist (ca. 2-3 Minuten)
- Deine App ist dann verfügbar unter:
  ```
  https://USERNAME.github.io/Quartalsziele-App/
  ```

---

## 🔧 Wichtige Konfiguration

### Base URL anpassen

Falls dein Repository einen **anderen Namen** hat, musst du die `vite.config.js` anpassen:

```javascript
export default defineConfig({
  plugins: [react()],
  base: '/DEIN-REPOSITORY-NAME/',  // ← Hier anpassen!
  // ...
})
```

**Beispiele:**
- Repository: `quarterly-goals` → `base: '/quarterly-goals/'`
- Repository: `jsa-goals` → `base: '/jsa-goals/'`

---

## 🔄 Updates deployen

Nach jeder Änderung:

```bash
git add .
git commit -m "Beschreibung der Änderung"
git push
```

GitHub Actions deployed automatisch!

---

## 🔐 Passwort ändern (WICHTIG!)

**Standard-Passwort:** `password`

### So änderst du es:

1. **Hash generieren** (PowerShell):
   ```powershell
   $password = "dein_neues_passwort"
   $hash = [System.Security.Cryptography.SHA256]::Create().ComputeHash([System.Text.Encoding]::UTF8.GetBytes($password))
   [System.BitConverter]::ToString($hash).Replace("-", "").ToLower()
   ```

2. **Hash in Code einfügen**:
   - Öffne: `src/components/LoginScreen.jsx`
   - Zeile 14: Ersetze den Hash
   ```javascript
   const MASTER_PASSWORD_HASH = 'DEIN_NEUER_HASH_HIER';
   ```

3. **Committen & Pushen**:
   ```bash
   git add src/components/LoginScreen.jsx
   git commit -m "Update password hash"
   git push
   ```

---

## 📱 Custom Domain (Optional)

Falls du eine eigene Domain verwenden willst:

1. Erstelle Datei `public/CNAME` mit deiner Domain:
   ```
   goals.deine-domain.de
   ```

2. Bei deinem Domain-Provider DNS-Eintrag erstellen:
   ```
   Type: CNAME
   Name: goals (oder @)
   Value: USERNAME.github.io
   ```

3. In GitHub Settings → Pages → Custom domain eintragen

---

## 🐛 Troubleshooting

### Problem: 404 Fehler nach Deployment

**Lösung 1:** Überprüfe `base` in `vite.config.js`
```javascript
base: '/Quartalsziele-App/',  // Muss mit Repository-Namen übereinstimmen!
```

**Lösung 2:** Warte 2-3 Minuten nach Deploy

**Lösung 3:** Hard-Refresh im Browser (Ctrl+F5)

### Problem: GitHub Actions Workflow schlägt fehl

1. Gehe zu **Actions** Tab
2. Klicke auf den fehlgeschlagenen Workflow
3. Schaue dir die Logs an
4. Häufige Ursachen:
   - `npm ci` schlägt fehl → Lösche `package-lock.json` und committe neu
   - Build-Fehler → Teste lokal mit `npm run build`

### Problem: Weiße Seite / Blank Page

1. Öffne Browser DevTools (F12)
2. Schaue in die Console
3. Häufig: Falsche `base` URL in `vite.config.js`

---

## 📊 Monitoring

### Deployment Status checken

```bash
# Lokaler Build-Test
npm run build
npm run preview
```

### GitHub Actions Status

- Gehe zu: `https://github.com/USERNAME/Quartalsziele-App/actions`
- Grüner Haken = Erfolgreich
- Rotes X = Fehler (klicken für Details)

---

## 🔒 Sicherheits-Checkliste

- [ ] Standard-Passwort geändert
- [ ] Repository auf Private gesetzt (optional)
- [ ] Team-Passwort sicher geteilt (z.B. via 1Password, Bitwarden)
- [ ] Regelmäßige Backups via Export-Funktion
- [ ] `.env` Datei NICHT committen (ist in `.gitignore`)

---

## 📦 Backup & Restore

### Backup erstellen
1. Öffne die App
2. Klicke auf **EXPORT**
3. JSON-Datei wird heruntergeladen
4. Speichere sie sicher (z.B. OneDrive, Dropbox)

### Backup wiederherstellen
1. Öffne die App
2. Klicke auf **IMPORT**
3. Wähle die JSON-Backup-Datei
4. Fertig!

**Empfehlung:** Wöchentliches Backup am Ende jedes Sprints

---

## 🎯 Nächste Schritte

1. ✅ Repository erstellen & pushen
2. ✅ GitHub Pages aktivieren
3. ✅ Passwort ändern
4. ✅ Team-Zugang teilen
5. ✅ Ersten Quarterly Goal erstellen
6. ✅ Regelmäßige Backups einrichten

---

**Viel Erfolg mit eurem Quarterly Goals Dashboard! 🚀**

Bei Fragen: Siehe `SETUP.md` oder `README.md`
