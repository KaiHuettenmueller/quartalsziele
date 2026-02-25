# JSA IT Weekly - Quarterly Goals Dashboard

Dashboard für Quarterly Goals Management mit **2 UI-Themes**.

## Team
- Maike
- Bacha
- Johannes
- Maxi
- Kai

## Features
- 🔒 Password-geschützt (client-side verschlüsselt)
- 📊 MoSCoW-Priorisierung (Must/Should/Could/Won't)
- 📅 Quarterly-basierte Verwaltung
- 💾 localStorage mit AES-Verschlüsselung
- 🎨 **2 Themes**: Terminal (Retro-IT) & Modern (Clean)
- 🔄 Theme-Switcher mit localStorage-Persistenz
- 📦 GitHub Pages Ready

## 🎨 Themes

### Terminal Theme
Retro-IT Kodi-Style mit Matrix-Grün, Monospace-Font und CRT-Effekten.
Perfekt für IT-Nerds und Meme-Faktor.

### Modern Theme  
Clean, professionelles Design mit hellem Hintergrund und besserer Lesbarkeit.
Perfekt für tägliche Nutzung und Produktivität.

**Theme wechseln**: Klicke nach dem Login oben rechts auf den Theme-Button.

Mehr Infos: Siehe `THEMES.md`

## Setup

```bash
npm install
npm run dev
```

## Deployment

```bash
npm run deploy
```

## Sicherheit
- Alle Daten AES-verschlüsselt in localStorage
- Passwort wird nie gespeichert
- Session-basiert (Tab-Close = Logout)
- Rate-Limiting bei Login-Versuchen

## Backup
Nutze Export/Import Funktion im Dashboard für Datensicherung.
