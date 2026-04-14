import { ref } from 'vue'

export interface SignalingEnvelope {
  sdp: RTCSessionDescriptionInit
  playerName: string
  characterName: string
}

export type NetworkMessageHandler = (msg: unknown) => void

const peerConnection = ref<RTCPeerConnection | null>(null)
const dataChannel = ref<RTCDataChannel | null>(null)
const isConnected = ref(false)
const messageHandler = ref<NetworkMessageHandler | null>(null)

const STUN_SERVERS: RTCConfiguration = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
}

function waitForIceGathering(pc: RTCPeerConnection): Promise<void> {
  return new Promise((resolve) => {
    if (pc.iceGatheringState === 'complete') {
      resolve()
      return
    }
    const timeout = setTimeout(resolve, 4000)
    pc.onicegatheringstatechange = () => {
      if (pc.iceGatheringState === 'complete') {
        clearTimeout(timeout)
        resolve()
      }
    }
  })
}

function attachChannel(channel: RTCDataChannel) {
  dataChannel.value = channel
  channel.onopen = () => {
    isConnected.value = true
  }
  channel.onclose = () => {
    isConnected.value = false
  }
  channel.onmessage = (e) => {
    try {
      const msg = JSON.parse(e.data)
      messageHandler.value?.(msg)
    } catch {
      // ignore malformed messages
    }
  }
}

export default () => ({
  isConnected,

  onMessage(handler: NetworkMessageHandler) {
    messageHandler.value = handler
  },

  sendMessage(msg: unknown) {
    if (dataChannel.value?.readyState === 'open') {
      dataChannel.value.send(JSON.stringify(msg))
    }
  },

  /** Vom Host aufgerufen: erzeugt ein Offer-Paket zum Kopieren */
  async createOffer(meta: Omit<SignalingEnvelope, 'sdp'>): Promise<string> {
    const pc = new RTCPeerConnection(STUN_SERVERS)
    peerConnection.value = pc

    const channel = pc.createDataChannel('game')
    attachChannel(channel)

    const offer = await pc.createOffer()
    await pc.setLocalDescription(offer)
    await waitForIceGathering(pc)

    const envelope: SignalingEnvelope = {
      sdp: pc.localDescription!,
      ...meta,
    }
    return JSON.stringify(envelope)
  },

  /** Vom Gast aufgerufen: nimmt das Offer entgegen, liefert ein Answer-Paket */
  async acceptOffer(
    offerStr: string,
    meta: Omit<SignalingEnvelope, 'sdp'>,
  ): Promise<{ answer: string; hostMeta: Omit<SignalingEnvelope, 'sdp'> }> {
    const envelope: SignalingEnvelope = JSON.parse(offerStr)

    const pc = new RTCPeerConnection(STUN_SERVERS)
    peerConnection.value = pc

    pc.ondatachannel = (e) => {
      attachChannel(e.channel)
    }

    await pc.setRemoteDescription(envelope.sdp)
    const answer = await pc.createAnswer()
    await pc.setLocalDescription(answer)
    await waitForIceGathering(pc)

    const answerEnvelope: SignalingEnvelope = {
      sdp: pc.localDescription!,
      ...meta,
    }
    return {
      answer: JSON.stringify(answerEnvelope),
      hostMeta: { playerName: envelope.playerName, characterName: envelope.characterName },
    }
  },

  /** Vom Host aufgerufen: nimmt das Answer des Gastes entgegen */
  async acceptAnswer(answerStr: string): Promise<Omit<SignalingEnvelope, 'sdp'>> {
    const envelope: SignalingEnvelope = JSON.parse(answerStr)
    await peerConnection.value?.setRemoteDescription(envelope.sdp)
    return { playerName: envelope.playerName, characterName: envelope.characterName }
  },
})
