import { AuthContextData, SignInProp } from "@/interfaces/AuthContextData";
import { AuthData } from "@/interfaces/AuthData";
import { AuthProviderProps } from "@/interfaces/AuthProviderProps";
import { authService } from "@/services/authServices";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
    createContext,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [authData, setAuthData] = useState<AuthData | undefined>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadAuthDataFromStorage() {
            try {
                const auth = await AsyncStorage.getItem("@AuthData");
                if (auth) {
                    setAuthData(JSON.parse(auth));
                }
            } catch (error) {
                console.error("Falha ao carregar dados de autenticação:", error);
            } finally {
                setLoading(false);
            }
        }

        loadAuthDataFromStorage();
    }, []);

    const signIn = useCallback(async (data: SignInProp): Promise<void> => {
        const auth = await authService.signIn(data);

        if (auth && Object.keys(auth).length > 0) {
            setAuthData(auth);
            await AsyncStorage.setItem("@AuthData", JSON.stringify(auth));
        } else {
            throw new Error("Recebidos dados de autenticação inválidos do serviço.");
        }
    }, []);

    const signOut = useCallback(async (): Promise<void> => {
        setAuthData(undefined);
        await AsyncStorage.removeItem("@AuthData");
    }, []);

    const contextValue = useMemo(
        () => ({
            authData,
            loading,
            signIn,
            signOut,
        }),
        [authData, loading, signIn, signOut]
    );

    return (
        <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
