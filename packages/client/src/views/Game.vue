<template>
  <GameTable v-if="session" />
  <div v-else class="loading">Laden…</div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import GameTable from '../components/GameTable/GameTable.vue'
import useGameSession from '../composables/useGameSession/useGameSession'
import useWebRTC from '../composables/useWebRTC/useWebRTC'
import useGameTable, { type NetworkMessage } from '../composables/useGameTable/useGameTable'
import {
  gunslingerData,
  gamblerData,
  headhunterData,
} from '../rules/charactersheet'
import type ICharacter from '../../../interfaces/src/ICharacter'
import routeConfigs from '../router/routeConfigs'

const router = useRouter()
const { session } = useGameSession()
const webrtc = useWebRTC()
const gt = useGameTable()

const CHARACTER_MAP: Record<string, ICharacter> = {
  'character.gunslinger': gunslingerData,
  'character.gambler': gamblerData,
  'character.headhunter': headhunterData,
}

onMounted(() => {
  if (!session.value) {
    router.push({ name: routeConfigs.LOBBY })
    return
  }

  // 1. Netzwerk-Sender registrieren
  gt.setNetworkSender((msg: NetworkMessage) => webrtc.sendMessage(msg))

  // 2. Eingehende Nachrichten weiterleiten
  webrtc.onMessage((msg) => gt.handleNetworkMessage(msg as NetworkMessage))

  // 3. Lokalen Spieler-Index setzen
  gt.localPlayerIndex.value = session.value.localPlayerIndex

  if (session.value.localPlayerIndex === 0) {
    // Host: Spiel initialisieren – Sender ist jetzt gesetzt, broadcastState() klappt
    gt.init(
      session.value.players.map((p) => ({
        name: p.name,
        character: CHARACTER_MAP[p.characterName] ?? gunslingerData,
      })),
      { startHand: 7, zoneCards: { alwaysFull: false, maxZoneCards: 5 } },
    )
  } else {
    // Gast: Host signalisieren dass wir bereit sind (State anfordern)
    gt.handleNetworkMessage({ type: 'READY' })  // eigene Handler nicht nötig, direkt ans Netz
    webrtc.sendMessage({ type: 'READY' })
  }
})

onUnmounted(() => {
  webrtc.onMessage(() => {})
})
</script>

<style scoped>
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.5rem;
  color: #888;
}
</style>
