import { SignInProp } from "@/interfaces/AuthContextData";
import { AuthData } from "@/interfaces/AuthData";
import { api } from "@/services/api";
import axios from 'axios';


async function signIn(data: SignInProp): Promise<AuthData> {
    if (!data.email || !data.password) {
        throw new Error("Email e senha são obrigatórios.");
    }

    try {
        const response = await api.post<AuthData>(`/login`, {
            email: data.email,
            password: data.password
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            throw new Error("Credenciais inválidas. Verifique seu email e senha.");
        }
        
        throw new Error("Não foi possível conectar ao servidor. Tente novamente mais tarde.");
    }
}

export const authService = { signIn };
