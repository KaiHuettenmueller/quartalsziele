# Theme System - JSA Quarterly Goals

## 🎨 Verfügbare Themes

Die App unterstützt **2 verschiedene UI-Themes**, zwischen denen du jederzeit wechseln kannst:

### 1. Terminal Theme (Standard)
- **Stil**: Retro IT, Kodi-inspiriert
- **Farben**: Matrix-Grün auf Schwarz
- **Font**: Monospace (JetBrains Mono)
- **Effekte**: CRT-Scanlines, Flicker-Animation
- **Zielgruppe**: IT-Nerds, Retro-Fans
- **Vorteil**: Coole Ästhetik, Meme-Faktor
- **Nachteil**: Augenbelastung bei langer Nutzung

### 2. Modern Theme
- **Stil**: Clean, professionell, startup-like
- **Farben**: Heller Hintergrund, blaue Akzente
- **Font**: Inter (moderne Sans-Serif)
- **Effekte**: Subtile Schatten, smooth Transitions
- **Zielgruppe**: Daily Use, Produktivität
- **Vorteil**: Bessere Lesbarkeit, größere Buttons
- **Nachteil**: Weniger "cool"

---

## 🔄 Theme wechseln

### Im Browser
1. Logge dich ein
2. Klicke oben rechts auf den **Theme-Button**
   - Terminal-Theme: Zeigt "Modern" Button (mit Palette-Icon)
   - Modern-Theme: Zeigt "Terminal" Button (mit Monitor-Icon)
3. Theme wechselt sofort
4. Auswahl wird in localStorage gespeichert

### Programmatisch
```javascript
import { useTheme, THEMES } from './contexts/ThemeContext';

function MyComponent() {
  const { theme, setTheme, toggleTheme } = useTheme();
  
  // Theme wechseln
  toggleTheme();
  
  // Spezifisches Theme setzen
  setTheme(THEMES.TERMINAL);
  setTheme(THEMES.MODERN);
  
  // Aktuelles Theme abfragen
  console.log(theme); // 'terminal' oder 'modern'
}
```

---

## 🛠️ Eigenes Theme erstellen

### 1. Theme-Datei erstellen
```javascript
// src/themes/myTheme.js
export const myTheme = {
  name: 'My Custom Theme',
  colors: {
    bg: 'bg-purple-900',
    text: 'text-white',
    textSecondary: 'text-purple-200',
    textMuted: 'text-purple-400',
  },
  card: 'bg-purple-800 rounded-lg shadow-xl border border-purple-600',
  button: {
    primary: 'bg-pink-500 text-white hover:bg-pink-600',
    secondary: 'bg-purple-700 text-white hover:bg-purple-600',
  },
  input: 'bg-purple-900 border border-purple-600 text-white',
  badge: {
    MUST: 'bg-red-500 text-white',
    SHOULD: 'bg-yellow-500 text-black',
    COULD: 'bg-blue-500 text-white',
    WONT: 'bg-gray-500 text-white',
  },
  status: {
    NOT_STARTED: 'bg-gray-600 text-white',
    IN_PROGRESS: 'bg-yellow-500 text-black',
    BLOCKED: 'bg-red-500 text-white',
    DONE: 'bg-green-500 text-white',
  },
  progressBar: 'bg-purple-900',
  progressFill: 'bg-gradient-to-r from-pink-500 to-purple-500',
  font: 'font-sans',
  effects: '',
};
```

### 2. Theme registrieren
```javascript
// src/themes/index.js
import { myTheme } from './myTheme';

export const THEMES = {
  TERMINAL: 'terminal',
  MODERN: 'modern',
  CUSTOM: 'custom', // Neu
};

export const getTheme = (themeName) => {
  switch (themeName) {
    case THEMES.TERMINAL:
      return terminalTheme;
    case THEMES.MODERN:
      return modernTheme;
    case THEMES.CUSTOM:
      return myTheme; // Neu
    default:
      return terminalTheme;
  }
};
```

### 3. Theme-Switcher erweitern
Füge einen Button für dein neues Theme hinzu oder erweitere den Toggle-Mechanismus.

---

## 📦 Theme-Struktur

Jedes Theme-Objekt hat folgende Properties:

```typescript
interface Theme {
  name: string;                    // Display-Name
  colors: {
    bg: string;                    // Hintergrund
    text: string;                  // Haupttext
    textSecondary: string;         // Sekundärtext
    textMuted: string;             // Gedämpfter Text
  };
  card: string;                    // Card-Styling
  button: {
    primary: string;               // Primär-Button
    secondary: string;             // Sekundär-Button
  };
  input: string;                   // Input-Felder
  badge: {
    MUST: string;                  // Must-Have Badge
    SHOULD: string;                // Should-Have Badge
    COULD: string;                 // Could-Have Badge
    WONT: string;                  // Won't-Have Badge
  };
  status: {
    NOT_STARTED: string;           // Status: Nicht gestartet
    IN_PROGRESS: string;           // Status: In Arbeit
    BLOCKED: string;               // Status: Blockiert
    DONE: string;                  // Status: Fertig
  };
  progressBar: string;             // Progress-Bar Container
  progressFill: string;            // Progress-Bar Fill
  progressFillDone?: string;       // Optional: Fill für Done-Status
  font: string;                    // Font-Family
  effects: string;                 // Spezielle Effekte (z.B. scanline)
}
```

---

## 🎯 Best Practices

### Theme-aware Komponenten erstellen
```javascript
import { useTheme } from '../contexts/ThemeContext';
import { getTheme } from '../themes';

function MyComponent() {
  const { theme } = useTheme();
  const currentTheme = getTheme(theme);
  
  return (
    <div className={currentTheme.card}>
      <h1 className={currentTheme.colors.text}>
        Hello World
      </h1>
      <button className={currentTheme.button.primary}>
        Click me
      </button>
    </div>
  );
}
```

### Conditional Rendering basierend auf Theme
```javascript
import { THEMES } from '../contexts/ThemeContext';

const isTerminal = theme === THEMES.TERMINAL;

return (
  <div>
    {isTerminal ? (
      <span className="font-mono">root@jsa:~$</span>
    ) : (
      <span>Welcome</span>
    )}
  </div>
);
```

---

## 🔍 Troubleshooting

### Theme wechselt nicht
- Browser-Cache leeren
- localStorage prüfen: `localStorage.getItem('jsa_theme')`
- Dev-Tools Console auf Fehler checken

### Styles werden nicht angewendet
- TailwindCSS Config prüfen
- Sicherstellen, dass alle Farben in `tailwind.config.js` definiert sind
- `npm run dev` neu starten

### Theme bleibt nicht gespeichert
- localStorage muss aktiviert sein
- Private/Incognito Mode speichert nicht persistent

---

## 💡 Ideen für weitere Themes

- **Dark Mode**: Dunkles Theme ohne Terminal-Effekte
- **High Contrast**: Für bessere Accessibility
- **Compact**: Kleinere Abstände, mehr Dichte
- **Colorful**: Bunte Farben für jede Kategorie
- **Minimal**: Absolut minimalistisch, schwarz-weiß

---

**Viel Spaß beim Themen-Wechseln! 🎨**
