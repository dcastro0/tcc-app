import { api } from "@/services/api";
import axios from 'axios';

export type RankingItem = {
    id: string;
    rank: number;
    nome: string;
    avatar: string | null;
    pontos: number;
};

export type RankingResponse = {
    top_5: RankingItem[];
    user_ranking: {
        message: string;
        data: RankingItem[];
    };
};

interface GetRankingParams {
    userId: number;
    token: string;
}

async function getRanking({ userId, token }: GetRankingParams): Promise<RankingResponse> {
    try {
        const response = await api.get<RankingResponse>(`/ranking/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || "Erro ao buscar o ranking.");
        }
        throw new Error("Não foi possível conectar ao servidor.");
    }
}

export const rankingService = { getRanking };
