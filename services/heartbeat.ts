import AsyncStorage from "@react-native-async-storage/async-storage"
import { api } from "./api"

const HEARTBEAT_KEY = "@LastHeartbeat"

interface HeartbeatResponse {
  streak_count: number
  last_active_date: string
}

async function sendHeartbeat(token: string): Promise<HeartbeatResponse | null> {
  const today = new Date().toISOString().split("T")[0] // YYYY-MM-DD
  await AsyncStorage.setItem(HEARTBEAT_KEY, today)
  console.log("Batimento cardíaco enviado para:", today)

  try {
    const response = await api.post<HeartbeatResponse>(
      "/heartbeat",
      { local_date: today },
      { headers: { Authorization: `Bearer ${token}` } },
    )
    // Retorna os dados do backend (ex: { streak_count: 5 })
    return response.data
  } catch (error) {
    console.error("Erro ao enviar batimento cardíaco:", error)
    return null
  }
}

async function trySendPendingHeartbeat(token: string): Promise<HeartbeatResponse | null> {
  const lastSent = (await AsyncStorage.getItem(HEARTBEAT_KEY)) || ""
  const today = new Date().toISOString().split("T")[0]

  if (lastSent !== today) {
    console.log("Enviando batimento cardíaco pendente...")
    return await sendHeartbeat(token)
  }
  return null
}

export { sendHeartbeat, trySendPendingHeartbeat }
