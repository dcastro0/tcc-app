import { FloatingRankingButton } from "@/components/FloatingRankingButton"
import { Feather } from "@expo/vector-icons"
import React from "react"
import { FlatList, SafeAreaView, Text, View } from "react-native"
import tw from "twrnc"
type AchievementProp = {
    id: number
    titulo: string
    desc: string
    unlocked: boolean
    icon: string
    progress?: number
    color: string
    goal?: number
}
const achievementData: AchievementProp[] = [
    {
        id: 1,
        titulo: "Primeira Gota",
        desc: "Registre sua primeira glicemia.",
        unlocked: true,
        icon: "droplet",
        color: "blue-500",
    },
    {
        id: 2,
        titulo: "Consistência I",
        desc: "Medições por 3 dias seguidos.",
        unlocked: true,
        icon: "calendar",
        color: "teal-500",
    },
    {
        id: 3,
        titulo: "Controle Perfeito",
        desc: "Manter glicemia na faixa ideal por 7 dias.",
        unlocked: false,
        icon: "target",
        color: "green-500",
        progress: 4,
        goal: 7,
    },
    {
        id: 4,
        titulo: "Maratonista",
        desc: "50 medições registradas no total.",
        unlocked: false,
        icon: "trending-up",
        color: "purple-500",
        progress: 32,
        goal: 50,
    },
    {
        id: 5,
        titulo: "Veterano",
        desc: "100 medições registradas no total.",
        unlocked: false,
        icon: "award",
        color: "amber-500",
    },
    {
        id: 6,
        titulo: "Guardião da Saúde",
        desc: "30 dias seguidos de medições.",
        unlocked: false,
        icon: "shield",
        color: "red-500",
    },
]

const AchievementCard = ({ item }: { item: AchievementProp }) => (
    <View
        style={tw.style(
            `w-[48%] bg-white p-4 rounded-3xl mb-4 shadow-md shadow-slate-200`,
            !item.unlocked && `opacity-60`
        )}
    >
        <View
            style={tw.style(
                `p-3 self-start rounded-full mb-3`,
                item.unlocked ? `bg-${item.color}` : `bg-slate-300`
            )}
        >
            <Feather
                name={item.icon as any}
                size={24}
                color={item.unlocked ? "white" : tw.color("slate-500")}
            />
        </View>

        <Text style={tw`text-base font-bold text-slate-800 mb-1`}>{item.titulo}</Text>
        <Text style={tw`text-sm text-slate-500 mb-4 h-10`}>{item.desc}</Text>

        {item.progress !== undefined && !item.unlocked ? (
            <View>
                <Text style={tw`text-xs text-slate-500 font-medium self-end mb-1`}>
                    {item.progress} / {item.goal}
                </Text>
                <View style={tw`bg-slate-200 rounded-full h-2 w-full`}>
                    <View
                        style={tw.style(`bg-slate-400 rounded-full h-2`, {
                            width: `${item.goal ? (item.progress / item.goal) * 100 : 0}%`,
                        })}
                    />
                </View>
            </View>
        ) : (
            <View style={tw`h-7`} />
        )}
    </View>
)

export default function AchievementsScreen() {
    const ListHeader = (
        <View style={tw`mb-8 mt-8 pt-4`}>
            <Text style={tw`text-3xl font-bold text-slate-800 text-center`}>
                🏆 Minhas Conquistas
            </Text>
        </View>
    )

    return (
        <SafeAreaView style={tw`flex-1 bg-slate-50`}>
            <FlatList
                data={achievementData}
                renderItem={({ item }) => <AchievementCard item={item} />}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                ListHeaderComponent={ListHeader}
                contentContainerStyle={tw`p-6`}
                columnWrapperStyle={tw`justify-between`}
            />
            <FloatingRankingButton />
        </SafeAreaView>
    )
}