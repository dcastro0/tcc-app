import { SignInProp } from "@/interfaces/AuthContextData";
import { AuthData } from "@/interfaces/AuthData";

async function signIn(data: SignInProp): Promise<AuthData> {
    if (!data.email || !data.password) {
        throw new Error("Email e senha são obrigatórios.");
    }

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (
                data.email.toLowerCase() === "user@email.com" &&
                data.password === "123456"
            ) {
                const mockUserData: AuthData = {
                    nome: "Caio Correa",
                    email: "user@email.com",
                    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.1Z-gQ_q_I",
                    avatar: null,
                    membroDesde: "Ago 2025",
                    totalMedicoes: 84,
                    pontos: 1250,
                };
                resolve(mockUserData);
            } else {
                reject(new Error("Credenciais inválidas."));
            }
        }, 1000);
    });
}

export const authService = { signIn };