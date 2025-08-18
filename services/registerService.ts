import { SignInProp } from "@/interfaces/AuthContextData";
import { AuthData } from "@/interfaces/AuthData";
import { RegisterFormValues } from '@/schema/registerSchema';
import axios from 'axios';

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
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            throw new Error("Credenciais inválidas. Verifique seu email e senha.");
        }
        throw new Error("Não foi possível conectar ao servidor. Tente novamente mais tarde.");
    }
}

async function signUp(data: RegisterFormValues): Promise<{ message: string }> {
    try {
        const response = await axios.post<{ message: string }>(`${API_URL}/register`, {
            nome: data.nome,
            email: data.email,
            password: data.password
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 409) {
            throw new Error("Este email já está em uso. Tente outro.");
        }
        throw new Error("Não foi possível realizar o cadastro. Tente novamente.");
    }
}

export const authService = { signIn, signUp };
