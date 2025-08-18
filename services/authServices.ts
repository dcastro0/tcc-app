import axios from 'axios';
import { SignInProp } from "@/interfaces/AuthContextData";
import { AuthData } from "@/interfaces/AuthData";

// URL da sua API em produção
const API_URL = "https://dcastr0caio.pythonanywhere.com/api";

async function signIn(data: SignInProp): Promise<AuthData> {
    if (!data.email || !data.password) {
        throw new Error("Email e senha são obrigatórios.");
    }

    try {
        const response = await axios.post<AuthData>(`${API_URL}/login`, {
            email: data.email,
            password: data.password
        });
        return response.data;

    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response && error.response.status === 401) {
                throw new Error("Credenciais inválidas. Verifique seu email e senha.");
            }
        }
        throw new Error("Não foi possível conectar ao servidor. Tente novamente mais tarde.");
    }
}

export const authService = { signIn };
