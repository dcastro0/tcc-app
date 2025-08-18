export interface AuthData {
    id: number;
    nome: string;
    email: string;
    token: string;
    avatar?: string | null; // O '?' torna a propriedade opcional
    membroDesde?: string;
    totalMedicoes?: number;
    pontos?: number;
}