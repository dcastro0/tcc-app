import { AuthContextData, SignInProp } from "@/interfaces/AuthContextData"
import { AuthData } from "@/interfaces/AuthData"
import { AuthProviderProps } from "@/interfaces/AuthProviderProps"
import { authService } from "@/services/authServices"
import { sendHeartbeat, trySendPendingHeartbeat } from "@/services/heartbeat"
import AsyncStorage from "@react-native-async-storage/async-storage"
import React, {
    createContext,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react"

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authData, setAuthData] = useState<AuthData | undefined>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadAuthDataFromStorage() {
      try {
        const auth = await AsyncStorage.getItem("@AuthData")
        if (auth) {
          const parsed = JSON.parse(auth)
          setAuthData(parsed)
          if (parsed?.token) {
            await trySendPendingHeartbeat(parsed.token)
          }
        }
      } catch (error) {
        console.error("Falha ao carregar dados de autenticação:", error)
      } finally {
        setLoading(false)
      }
    }
    loadAuthDataFromStorage()
  }, [])

  // 1. MUDANÇA: A função agora retorna Promise<AuthData>
  const signIn = useCallback(
    async (data: SignInProp): Promise<AuthData> => {
      const auth = await authService.signIn(data)
      if (auth && Object.keys(auth).length > 0) {
        setAuthData(auth)
        await AsyncStorage.setItem("@AuthData", JSON.stringify(auth))
        if (auth.token) {
          await sendHeartbeat(auth.token)
        }
        // 2. MUDANÇA: Retorna os dados do usuário para a tela que o chamou
        return auth
      } else {
        throw new Error(
          "Recebidos dados de autenticação inválidos do serviço.",
        )
      }
    },
    [],
  )

  const signOut = useCallback(async (): Promise<void> => {
    setAuthData(undefined)
    await AsyncStorage.removeItem("@AuthData")
  }, [])

  const contextValue = useMemo(
    () => ({
      authData,
      loading,
      signIn,
      signOut,
      // 3. MUDANÇA: Remove 'streak_count' (que não existe) do contexto.
      // Os componentes devem usar 'authData.streak_count'
    }),
    [authData, loading, signIn, signOut],
  )

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }
