# Gunslingers — Showdown im wilden Westen

Digitaler Prototyp zum Testen der Spielregeln.

## Setup

```bash
npm install
npm run dev
```

## Kartenformat

Karten beschreiben ihre Effekte deklarativ als Daten (Trigger + Effekt-Deskriptor).^

Details: [CARD_FORMAT.md](CARD_FORMAT.md)

## Packages

| Package      | Inhalt                                               |
| ------------ | ---------------------------------------------------- |
| `client`     | Vue 3-App — Spieloberfläche, Spiellogik, Composables |
| `interfaces` | Gemeinsame TypeScript-Interfaces und Trigger-Typen   |

## Scripts

```bash
npm run dev            # Entwicklungsserver
npm run test:unit      # Unit-Tests
npm run story:dev      # Komponenten-Stories (Histoire)
npm run build          # Produktions-Build
```
