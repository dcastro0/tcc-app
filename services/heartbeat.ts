import { api } from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PENDING_KEY = "@PendingHeartbeat";

export async function sendHeartbeat(token: string) {
  const localDate = new Date().toLocaleDateString("en-CA");
  try {
    const res = await fetch(`${api.defaults.baseURL}/heartbeat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ local_date: localDate }),
    });
    if (!res.ok) {
      await AsyncStorage.setItem(PENDING_KEY, localDate);
      return null;
    }
    await AsyncStorage.removeItem(PENDING_KEY);
    return await res.json();
  } catch (err) {
    await AsyncStorage.setItem(PENDING_KEY, localDate);
    return null;
  }
}

export async function trySendPendingHeartbeat(token: string) {
  try {
    const pending = await AsyncStorage.getItem(PENDING_KEY);
    if (!pending) return null;
    const res = await fetch(`${api.defaults.baseURL}/heartbeat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ local_date: pending }),
    });
    if (!res.ok) return null;
    await AsyncStorage.removeItem(PENDING_KEY);
    return await res.json();
  } catch (err) {
    return null;
  }
}
