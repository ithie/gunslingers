import { ref } from 'vue'

export interface PlayerSetup {
  name: string
  characterName: string
}

export interface GameSession {
  /** 0 = Host, 1 = Gast */
  localPlayerIndex: number
  players: [PlayerSetup, PlayerSetup]
}

const session = ref<GameSession | null>(null)

export default () => ({
  session,

  setSession(s: GameSession) {
    session.value = s
  },

  clearSession() {
    session.value = null
  },
})
