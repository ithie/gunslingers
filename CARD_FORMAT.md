# Gunslinger Descriptive Cards

Jede Karte im Spiel beschreibt ihre Spielmechanik vollständig in ihrer eigenen Definition — als reine Daten, ohne dass die Spiellogik Kartennamen kennen muss. Die `cardEffectEngine` wertet diese Daten aus, wenn das Spiel ein Ereignis feuert.

## Aufbau

```ts
{
  name: 'card.defense.blocking',
  type: 'DEFENSE',
  triggers: [
    {
      on: 'ON_DEFEND',
      requires: { type: 'MIN_SPD', value: 3 },
      effect: { type: 'REDUCE_DAMAGE', amount: 2 }
    }
  ]
}
```

## Ereignisse (`on`)

| Ereignis     | Wann wird es gefeuert                                      |
| ------------ | ---------------------------------------------------------- |
| `ON_PLAY`    | Sofort beim Ausspielen der Karte aus der Hand              |
| `TURN_START` | Zu Beginn des Zuges des Spielers, der die Karte trägt      |
| `ON_ATTACK`  | Bevor der Karteninhaber angreift (kann Angriff verhindern) |
| `ON_DEFEND`  | Wenn der Karteninhaber angegriffen wird                    |

## Bedingungen (`requires`)

Optionale Voraussetzung, die vor der Ausführung des Effekts geprüft wird. Ist sie nicht erfüllt, wird der Trigger ignoriert.

| Bedingung                  | Bedeutung                                                                |
| -------------------------- | ------------------------------------------------------------------------ |
| `MIN_SPD: N`               | GES des Verteidigers muss ≥ N sein                                       |
| `ATTACKER_SPD_DIFF_GTE: N` | GES des Angreifers muss mindestens N höher sein als die des Verteidigers |

## Effekte (`effect`)

| Typ              | Parameter | Beschreibung                                                              |
| ---------------- | --------- | ------------------------------------------------------------------------- |
| `DEAL_DAMAGE`    | `amount`  | Verursacht N Schaden beim Karteninhaber                                   |
| `HEAL`           | `amount`  | Heilt den Karteninhaber um N LP (maximal bis Startwert)                   |
| `NEGATE_DAMAGE`  | —         | Angriff läuft ins Leere                                                   |
| `REDUCE_DAMAGE`  | `amount`  | Eingehender Schaden wird um N reduziert                                   |
| `SPLIT_DAMAGE`   | —         | Schaden wird 50:50 auf Angreifer und Verteidiger aufgeteilt (aufgerundet) |
| `COUNTER_DAMAGE` | `amount`  | Schaden geht durch, zusätzlich erhält der Angreifer N Schaden             |
| `PREVENT_ATTACK` | —         | Angreifer kann in diesem Zug nicht angreifen                              |
| `FORCE_DISCARD`  | `count`   | Zielspielerin muss N Karten aus der Hand abwerfen (öffnet UI)             |

## Passive Stat-Modifikatoren

Karten ohne Trigger, die aber Stat-Felder (`ATK`, `DEF`, `SPD`) tragen, wirken **passiv**: `calculateStats()` rechnet sie automatisch ein, solange die Karte sichtbar auf dem Spielfeld liegt. Beispiel: _Schwächung_ (`ATK: -2, DEF: -2, SPD: -2`).

## Karten im Überblick

### Abwehrkarten

| Karte         | Trigger     | Bedingung        | Effekt               |
| ------------- | ----------- | ---------------- | -------------------- |
| Blocken       | `ON_DEFEND` | GES ≥ 3          | `REDUCE_DAMAGE` (2)  |
| Ducken+Rollen | `ON_DEFEND` | GES ≥ 3          | `NEGATE_DAMAGE`      |
| Gegenschuss   | `ON_DEFEND` | GES ≥ 3          | `COUNTER_DAMAGE` (1) |
| Querschläger  | `ON_DEFEND` | GES ≥ 3          | `SPLIT_DAMAGE`       |
| Ausweichen    | `ON_DEFEND` | Angreifer +2 GES | `NEGATE_DAMAGE`      |

### Fintenkarten

| Karte          | Trigger      | Effekt              |
| -------------- | ------------ | ------------------- |
| Schlangenbiss  | `TURN_START` | `DEAL_DAMAGE` (1)   |
| Kopfnuss       | `ON_ATTACK`  | `PREVENT_ATTACK`    |
| Heilung        | `ON_PLAY`    | `HEAL` (2)          |
| Falsches Spiel | `ON_PLAY`    | `FORCE_DISCARD` (2) |
| Schwächung     | (passiv)     | ATK/DEF/SPD −2      |
