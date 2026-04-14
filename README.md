# Gunslingers — Showdown im wilden Westen

Digitaler Prototyp zur Regelvalidierung des Kartenspiels **GUNSLINGERS**.  
Ziel: Erweiterungen und Balance-Anpassungen testen, bevor die Karten produziert werden.

## Spielprinzip

Zwei Spieler treten gegeneinander an. Wer die Lebenspunkte des Gegners zuerst auf 0 bringt, gewinnt. Reichen die Nachziehstapel nicht aus, endet das Spiel unentschieden.

Jeder Zug besteht aus: Ablageortkarte wählen → Karte ziehen → Karte ausspielen → Angreifen.

→ Vollständige Regeln: [RULES.md](RULES.md)

## Architektur

### Kartenformat

Alle Karten beschreiben ihre Spielmechanik deklarativ als Daten — die Spiellogik kennt keine Kartennamen. Ein Event-Trigger-System wertet die Definitionen zur Laufzeit aus.

→ Format-Dokumentation: [CARD_FORMAT.md](CARD_FORMAT.md)

### Packages

| Package      | Inhalt                                               |
| ------------ | ---------------------------------------------------- |
| `client`     | Vue 3-App — Spieloberfläche, Spiellogik, Composables |
| `interfaces` | Gemeinsame TypeScript-Interfaces und Trigger-Typen   |

### Wichtige Dateien

| Datei                                                          | Beschreibung                 |
| -------------------------------------------------------------- | ---------------------------- |
| `packages/client/src/rules/cardEffectEngine.ts`                | Karten-Trigger auflösen      |
| `packages/client/src/rules/getDefenseCards.ts`                 | Abwehrkarten-Definitionen    |
| `packages/client/src/rules/getEventCards.ts`                   | Fintenkarten-Definitionen    |
| `packages/client/src/rules/characterEffects.ts`                | Charakter-Spezialfähigkeiten |
| `packages/client/src/composables/useGameTable/useGameTable.ts` | Spielzustand & Spielfluss    |
| `packages/interfaces/src/ICardTrigger.ts`                      | Trigger-Typen                |

## Entwicklung

```bash
npm install          # Abhängigkeiten installieren
npm run dev          # Entwicklungsserver starten
npm run test:unit    # Unit-Tests
npm run story:dev    # Komponenten-Stories (Histoire)
npm run build        # Produktions-Build
```

Alle Befehle funktionieren aus dem Projekt-Root heraus (npm workspaces).

## Erweiterungen

Das Grundspiel ist stabil. Geplante Erweiterungen (noch nicht implementiert):

- **Mexican Standoff** — Mehrspieler-Modus (3+ Spieler, neue Ablageort- und Fintenkarten)

Neue Karten lassen sich durch Hinzufügen einer Kartendefinition mit passenden Triggern ergänzen — ohne Änderungen an der Spiellogik, sofern der Effekttyp bereits in der Engine vorhanden ist.
