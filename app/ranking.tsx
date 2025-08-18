import { useAuth } from "@/hooks/useAuth";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, SafeAreaView, Text, View } from "react-native";
import tw from "twrnc";
import { RankingItem, RankingResponse, rankingService } from "../services/rankingService";

interface RankingRowProps {
    item: RankingItem;
    currentUserId: string;
}

const RankingRow = ({ item, currentUserId }: RankingRowProps) => {
    const isCurrentUser = item.id === currentUserId;
    const rank = item.rank;

    const getRankIndicator = () => {
        if (rank === 1) return <Text style={tw`text-xl`}>🥇</Text>;
        if (rank === 2) return <Text style={tw`text-xl`}>🥈</Text>;
        if (rank === 3) return <Text style={tw`text-xl`}>🥉</Text>;
        return <Text style={tw`text-slate-500 font-bold w-6 text-center`}>{rank}</Text>;
    };

    return (
        <View
            style={tw.style(
                `flex-row items-center p-4 rounded-2xl mb-2`,
                isCurrentUser ? 'bg-blue-100' : 'bg-white'
            )}
        >
            <View style={tw`w-8 items-center`}>{getRankIndicator()}</View>
            <View style={tw`w-12 h-12 rounded-full bg-slate-200 items-center justify-center ml-2`}>
                <Text style={tw`text-lg font-bold text-slate-600`}>{item.nome[0]}</Text>
            </View>
            <Text style={tw`flex-1 ml-4 text-base font-bold text-slate-700`}>{item.nome}</Text>
            <View style={tw`flex-row items-center`}>
                <Text style={tw`text-base font-bold text-amber-500`}>{item.pontos}</Text>
                <Feather name="zap" size={14} color={tw.color('amber-500')} style={tw`ml-1`} />
            </View>
        </View>
    );
};

export default function RankingScreen() {
    const router = useRouter();
    const { authData } = useAuth();

    const [rankingData, setRankingData] = useState<RankingResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRanking = async () => {
            if (authData?.id && authData?.token) {
                try {
                    setIsLoading(true);
                    const data = await rankingService.getRanking({
                        userId: authData.id,
                        token: authData.token,
                    });
                    setRankingData(data);
                    setError(null);
                } catch (err: any) {
                    setError(err.message || "Ocorreu um erro.");
                } finally {
                    setIsLoading(false);
                }
            } else {
                setError("Usuário não autenticado.");
                setIsLoading(false);
            }
        };

        fetchRanking();
    }, [authData]);

    const currentUserData = rankingData?.user_ranking.data.find(u => u.id === String(authData?.id));

    if (isLoading) {
        return (
            <SafeAreaView style={tw`flex-1 justify-center items-center bg-slate-50`}>
                <ActivityIndicator size="large" color={tw.color("blue-600")} />
                <Text style={tw`mt-4 text-slate-600`}>Carregando Ranking...</Text>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={tw`flex-1 justify-center items-center bg-slate-50 p-6`}>
                <Text style={tw`text-lg text-red-600 text-center`}>🏆</Text>
                <Text style={tw`text-lg font-bold text-red-600 text-center mt-2`}>Oops!</Text>
                <Text style={tw`text-slate-600 text-center mt-2`}>{error}</Text>
                <Pressable onPress={() => router.back()} style={tw`mt-6 bg-blue-600 py-3 px-6 rounded-full`}>
                    <Text style={tw`text-white font-bold`}>Voltar</Text>
                </Pressable>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={tw`flex-1 bg-slate-50`}>
            <View style={tw`flex-row items-center p-4 mt-8`}>
                <Pressable onPress={() => router.back()} style={tw`p-2`}>
                    <Feather name="chevron-left" size={28} color={tw.color("slate-600")} />
                </Pressable>
                <Text style={tw`text-2xl font-bold text-slate-800 ml-4`}>🏆 Ranking Geral</Text>
            </View>

            {currentUserData && (
                <View style={tw`bg-blue-600 rounded-3xl p-6 mx-6 mb-6 shadow-xl shadow-blue-200`}>
                    <Text style={tw`text-white/80 text-center mb-1`}>Sua Posição</Text>
                    <View style={tw`flex-row items-center justify-center gap-4`}>
                        <Text style={tw`text-5xl font-bold text-white`}>#{currentUserData.rank}</Text>
                        <View>
                            <Text style={tw`text-xl font-bold text-white`}>{currentUserData.nome}</Text>
                            <Text style={tw`text-base text-white/80`}>{currentUserData.pontos} pontos</Text>
                        </View>
                    </View>
                </View>
            )}

            <FlatList
                data={rankingData?.top_5}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <RankingRow item={item} currentUserId={String(authData?.id)} />}
                contentContainerStyle={tw`px-6`}
            />
        </SafeAreaView>
    );
}
