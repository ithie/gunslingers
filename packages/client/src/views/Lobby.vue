<template>
  <div class="lobby">
    <h1>Gunslingers</h1>
    <p class="subtitle">Showdown im Wilden Westen</p>

    <!-- Schritt 1: Name + Charakter -->
    <section v-if="step === 'setup'" class="card">
      <h2>Dein Charakter</h2>

      <label class="field">
        <span>Dein Name</span>
        <input v-model="playerName" placeholder="z.B. Billy the Kid" maxlength="20" />
      </label>

      <div class="characters">
        <button
          v-for="char in characters"
          :key="char.name"
          :class="['character-btn', { selected: selectedCharacter === char.name }]"
          @click="selectedCharacter = char.name"
        >
          <strong>{{ char.label }}</strong>
          <div class="stats">
            <span>LP {{ char.HP }}</span>
            <span>ANG {{ char.ATK }}</span>
            <span>VER {{ char.DEF }}</span>
            <span>GES {{ char.SPD }}</span>
          </div>
          <small>{{ char.effectLabel }}</small>
        </button>
      </div>

      <div class="actions">
        <button class="btn primary" :disabled="!playerName.trim()" @click="step = 'role'">
          Weiter
        </button>
      </div>
    </section>

    <!-- Schritt 2: Rolle wählen -->
    <section v-else-if="step === 'role'" class="card">
      <h2>Wie möchtest Du spielen?</h2>
      <div class="actions stacked">
        <button class="btn primary" @click="startHost">
          🤠 Spiel erstellen
        </button>
        <button class="btn secondary" @click="step = 'join'">
          🎲 Spiel beitreten
        </button>
        <button class="btn ghost" @click="step = 'setup'">Zurück</button>
      </div>
    </section>

    <!-- Schritt 3a: Host – Offer erzeugen -->
    <section v-else-if="step === 'host-offer'" class="card">
      <h2>Spiel erstellen</h2>
      <p v-if="loading" class="hint">Verbindung wird vorbereitet…</p>
      <template v-else>
        <p class="hint">
          Kopiere diesen Text und schicke ihn Deinem Mitspieler (WhatsApp, Mail, …).
        </p>
        <textarea :value="offerText" readonly rows="6" @focus="($event.target as HTMLTextAreaElement).select()" />
        <button class="btn copy" @click="copyToClipboard(offerText)">
          {{ copied ? '✓ Kopiert!' : 'In Zwischenablage kopieren' }}
        </button>

        <hr />

        <p class="hint">Füge hier die Antwort Deines Mitspielers ein:</p>
        <textarea v-model="answerText" placeholder="Antwort hier einfügen…" rows="6" />
        <div class="actions">
          <button class="btn primary" :disabled="!answerText.trim()" @click="hostAcceptAnswer">
            Verbinden
          </button>
          <button class="btn ghost" @click="step = 'role'">Zurück</button>
        </div>
        <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
      </template>
    </section>

    <!-- Schritt 3b: Gast – Offer einfügen -->
    <section v-else-if="step === 'join'" class="card">
      <h2>Spiel beitreten</h2>
      <p class="hint">Füge hier den Text ein, den Dir der Gastgeber geschickt hat:</p>
      <textarea v-model="offerText" placeholder="Einladungstext hier einfügen…" rows="6" />
      <div class="actions">
        <button class="btn primary" :disabled="!offerText.trim()" @click="guestAcceptOffer">
          Weiter
        </button>
        <button class="btn ghost" @click="step = 'role'">Zurück</button>
      </div>
      <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
    </section>

    <!-- Schritt 4b: Gast – Answer anzeigen -->
    <section v-else-if="step === 'guest-answer'" class="card">
      <h2>Fast geschafft!</h2>
      <p class="hint">
        Kopiere diesen Text und schicke ihn zurück an den Gastgeber:
      </p>
      <textarea :value="answerText" readonly rows="6" @focus="($event.target as HTMLTextAreaElement).select()" />
      <button class="btn copy" @click="copyToClipboard(answerText)">
        {{ copied ? '✓ Kopiert!' : 'In Zwischenablage kopieren' }}
      </button>
      <p class="hint waiting">Warte auf die Verbindung des Gastgebers…</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import useWebRTC from '../composables/useWebRTC/useWebRTC'
import useGameSession from '../composables/useGameSession/useGameSession'
import {
  gunslingerData,
  gamblerData,
  headhunterData,
} from '../rules/charactersheet'
import routeConfigs from '../router/routeConfigs'

const router = useRouter()
const webrtc = useWebRTC()
const { setSession } = useGameSession()

// ---------------------------------------------------------------------------
// Formulardaten
// ---------------------------------------------------------------------------
const playerName = ref('')
const selectedCharacter = ref('character.gunslinger')

const characters = [
  { ...gunslingerData, label: 'Revolverheld' },
  { ...gamblerData, label: 'Glücksspieler' },
  { ...headhunterData, label: 'Kopfgeldjäger' },
]

// ---------------------------------------------------------------------------
// UI-Zustand
// ---------------------------------------------------------------------------
type Step = 'setup' | 'role' | 'host-offer' | 'join' | 'guest-answer'
const step = ref<Step>('setup')
const loading = ref(false)
const offerText = ref('')
const answerText = ref('')
const errorMsg = ref('')
const copied = ref(false)

// ---------------------------------------------------------------------------
// Hilfsfunktionen
// ---------------------------------------------------------------------------
async function copyToClipboard(text: string) {
  await navigator.clipboard.writeText(text)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

function navigateToGame(
  localPlayerIndex: number,
  localName: string,
  localCharName: string,
  remoteName: string,
  remoteCharName: string,
) {
  const players: [{ name: string; characterName: string }, { name: string; characterName: string }] =
    localPlayerIndex === 0
      ? [
          { name: localName, characterName: localCharName },
          { name: remoteName, characterName: remoteCharName },
        ]
      : [
          { name: remoteName, characterName: remoteCharName },
          { name: localName, characterName: localCharName },
        ]

  setSession({ localPlayerIndex, players })
  router.push({ name: routeConfigs.GAME })
}

// ---------------------------------------------------------------------------
// Host-Flow
// ---------------------------------------------------------------------------
async function startHost() {
  step.value = 'host-offer'
  loading.value = true
  errorMsg.value = ''

  try {
    offerText.value = await webrtc.createOffer({
      playerName: playerName.value.trim(),
      characterName: selectedCharacter.value,
    })
  } catch (e) {
    errorMsg.value = 'Fehler beim Erstellen des Angebots. Bitte neu versuchen.'
    step.value = 'role'
  } finally {
    loading.value = false
  }
}

async function hostAcceptAnswer() {
  errorMsg.value = ''
  try {
    const guestMeta = await webrtc.acceptAnswer(answerText.value.trim())

    // Warte auf DataChannel-Verbindung
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Timeout')), 10000)
      const stop = watch(webrtc.isConnected, (val) => {
        if (val) {
          clearTimeout(timeout)
          stop()
          resolve()
        }
      }, { immediate: true })
    })

    navigateToGame(
      0,
      playerName.value.trim(),
      selectedCharacter.value,
      guestMeta.playerName,
      guestMeta.characterName,
    )
  } catch {
    errorMsg.value = 'Ungültige Antwort oder Verbindungs-Timeout. Bitte erneut versuchen.'
  }
}

// ---------------------------------------------------------------------------
// Gast-Flow
// ---------------------------------------------------------------------------
async function guestAcceptOffer() {
  errorMsg.value = ''
  try {
    const { answer, hostMeta } = await webrtc.acceptOffer(offerText.value.trim(), {
      playerName: playerName.value.trim(),
      characterName: selectedCharacter.value,
    })
    answerText.value = answer
    step.value = 'guest-answer'

    // Warte auf DataChannel (Host setzt remote description → Kanal öffnet sich)
    const stop = watch(webrtc.isConnected, (val) => {
      if (val) {
        stop()
        navigateToGame(
          1,
          playerName.value.trim(),
          selectedCharacter.value,
          hostMeta.playerName,
          hostMeta.characterName,
        )
      }
    }, { immediate: true })
  } catch {
    errorMsg.value = 'Ungültiger Einladungstext. Bitte erneut prüfen.'
  }
}

import { watch } from 'vue'
</script>

<style scoped>
.lobby {
  max-width: 560px;
  margin: 0 auto;
  padding: 2rem 1rem;
  font-family: sans-serif;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 0;
  text-align: center;
}

.subtitle {
  text-align: center;
  color: #888;
  margin-top: 0.25rem;
  margin-bottom: 2rem;
}

.card {
  background: #fafafa;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
}

h2 {
  margin-top: 0;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 1rem;
}

.field input {
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.characters {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}

.character-btn {
  text-align: left;
  padding: 0.75rem 1rem;
  border: 2px solid #ddd;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  transition: border-color 0.15s;
}

.character-btn:hover {
  border-color: #aaa;
}

.character-btn.selected {
  border-color: #b5420a;
  background: #fff8f5;
}

.stats {
  display: flex;
  gap: 0.75rem;
  font-size: 0.85rem;
  color: #555;
  margin: 0.2rem 0;
}

.actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.actions.stacked {
  flex-direction: column;
}

.btn {
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  border: none;
}

.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn.primary {
  background: #b5420a;
  color: white;
}

.btn.primary:hover:not(:disabled) {
  background: #a03a08;
}

.btn.secondary {
  background: #555;
  color: white;
}

.btn.secondary:hover {
  background: #444;
}

.btn.ghost {
  background: transparent;
  color: #555;
  border: 1px solid #ccc;
}

.btn.copy {
  background: #2a7a2a;
  color: white;
  margin-top: 0.5rem;
  width: 100%;
}

textarea {
  width: 100%;
  box-sizing: border-box;
  font-family: monospace;
  font-size: 0.8rem;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: vertical;
  margin-bottom: 0.5rem;
}

hr {
  border: none;
  border-top: 1px solid #ddd;
  margin: 1.25rem 0;
}

.hint {
  color: #555;
  font-size: 0.9rem;
  margin: 0 0 0.75rem;
}

.hint.waiting {
  text-align: center;
  margin-top: 1rem;
  animation: pulse 1.5s infinite;
}

.error {
  color: #c0392b;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
</style>
