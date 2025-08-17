import { useAuth } from "@/hooks/useAuth";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Pressable, SafeAreaView, Text, View } from "react-native";
import tw from "twrnc";

type RankingItem = {
    id: string;
    rank: number;
    nome: string;
    avatar: string | null;
    pontos: number;
};

const rankingData: RankingItem[] = [
    { id: '1', rank: 1, nome: 'Ana Beatriz', avatar: null, pontos: 3250 },
    { id: '2', rank: 2, nome: 'Ricardo Lima', avatar: null, pontos: 2980 },
    { id: '3', rank: 3, nome: 'Fernanda Costa', avatar: null, pontos: 2610 },
    { id: '4', rank: 4, nome: 'Juliano Alves', avatar: null, pontos: 1780 },
    { id: '5', rank: 5, nome: 'Caio Silva', avatar: null, pontos: 1250 },
    { id: '6', rank: 6, nome: 'Mariana Dias', avatar: null, pontos: 1190 },
    { id: '7', rank: 7, nome: 'Pedro Martins', avatar: null, pontos: 950 },
    { id: '8', rank: 8, nome: 'Larissa Souza', avatar: null, pontos: 820 },
];

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
    const currentUserData = rankingData.find(u => u.nome === authData?.nome) || { rank: 5, nome: 'Caio Silva', pontos: 1250, id: '5' };

    return (
        <SafeAreaView style={tw`flex-1 bg-slate-50`}>
            <View style={tw`flex-row items-center p-4 mt-8`}>
                <Pressable onPress={() => router.back()} style={tw`p-2`}>
                    <Feather name="chevron-left" size={28} color={tw.color("slate-600")} />
                </Pressable>
                <Text style={tw`text-2xl font-bold text-slate-800 ml-4`}>🏆 Ranking Geral</Text>
            </View>

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

            <FlatList
                data={rankingData}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <RankingRow item={item} currentUserId={currentUserData.id} />}
                contentContainerStyle={tw`px-6`}
            />
        </SafeAreaView>
    );
}