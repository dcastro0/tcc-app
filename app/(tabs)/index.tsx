import { useAuth } from "@/hooks/useAuth";
import {
  getMeasurements,
  initMeasurementTable,
  Measurement,
} from "@/services/orm/entities/measurement";
import { Feather } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router"; // 1. Importa useFocusEffect
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
// 2. Importa o SafeAreaView correto
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";

export default function HomeScreen() {
  const router = useRouter()
  const { authData } = useAuth()
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [measurements, setMeasurements] = useState<Measurement[]>([])

  // usa campos do backend
  const nome = authData?.nome ?? "Usuário"
  const pontosTotais = authData?.pontos ?? 0 // 3. CORREÇÃO: Usa o total de pontos direto do backend
  const diasOfensiva = authData?.streak_count ?? 0

  const load = useCallback(async () => {
    // Não seta loading(true) aqui, useFocusEffect já faz isso
    try {
      await initMeasurementTable()
      const rows = await getMeasurements()
      const sorted = rows.sort((a, b) => (a.date < b.date ? 1 : -1))
      setMeasurements(sorted)
    } catch (err) {
      console.error("Erro ao carregar medições:", err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  // 4. CORREÇÃO: Troca useEffect por useFocusEffect
  useFocusEffect(
    useCallback(() => {
      setLoading(true) // Mostra o loader sempre que a tela foca
      load()
    }, [load]),
  )

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await load()
    // TODO: Adicionar lógica de sync com backend aqui também
  }, [load])

  const lastThree = measurements.slice(0, 3)
  const ultimaMedicao = measurements.length > 0 ? measurements[0] : null

  // Removemos pontosExtras, pois os pontosTotais vêm direto do backend
  // const pontosExtras = (measurements.length || 0) * 50; (REMOVIDO)

  return (
    <SafeAreaView style={tw`flex-1 bg-slate-50`}>
      {/* BADGE pequeno no topo direito */}
      <View style={tw`absolute top-16 right-6 z-50`}>
        <View style={tw`bg-white px-3 py-2 rounded-full shadow-md items-center justify-center`}>
          <Text style={tw`text-sm font-bold text-blue-600`}>🔥 {diasOfensiva}</Text>
        </View>
      </View>

      <ScrollView
        style={tw`flex-1`}
        contentContainerStyle={tw`p-6 pt-10`}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={tw`mb-8 mt-8`}>
          <Text style={tw`text-4xl text-slate-600`}>Olá,</Text>
          <Text style={tw`text-3xl font-bold text-blue-600`}>{nome} 👋</Text>
        </View>

        <View style={tw`bg-blue-600 rounded-3xl p-6 shadow-xl shadow-blue-200 mb-8`}>
          <View style={tw`flex-row items-start justify-between mb-4`}>
            <View>
              <Text style={tw`text-lg font-bold text-white`}>Controle Diário</Text>
              <Text style={tw`text-white/80`}>Sua saúde em primeiro lugar.</Text>
            </View>
            <View style={tw`flex-row items-center gap-2 bg-white/20 rounded-full px-3 py-1`}>
              <Feather name="zap" size={14} color="white" />
              <Text style={tw`text-white font-bold`}>{pontosTotais} pts</Text>
            </View>
          </View>

          <Text style={tw`text-white/80 text-sm mb-1`}>Último registro:</Text>

          {loading && !refreshing ? (
            <View style={tw`py-6`}>
              <ActivityIndicator size="large" color="white" />
            </View>
          ) : ultimaMedicao ? (
            <>
              <Text style={tw`text-white text-3xl font-bold mb-1`}>
                {ultimaMedicao.value} mg/dL
              </Text>
              <Text style={tw`text-white/80 text-sm mb-6`}>
                {new Date(ultimaMedicao.date).toLocaleString("pt-BR", {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </>
          ) : (
            <>
              <Text style={tw`text-white text-2xl font-bold mb-6`}>— Nenhuma medição —</Text>
              <Text style={tw`text-white/80 text-sm mb-6`}>Registre sua primeira medição agora.</Text>
            </>
          )}

          <Pressable
            onPress={() => router.push("/(tabs)/medir")}
            style={({ pressed }) => [
              tw`bg-white py-4 rounded-2xl shadow-md`,
              pressed && tw`bg-gray-200 scale-98`,
            ]}
          >
            <Text style={tw`text-blue-600 text-center text-lg font-bold`}>
              + Registrar Nova Medição
            </Text>
          </Pressable>
        </View>

        <View style={tw`flex-row gap-4 mb-8`}>
          <View style={tw`flex-1 bg-white p-4 rounded-2xl shadow-md shadow-slate-200 items-center`}>
            <Text style={tw`text-5xl`}>🔥</Text>
            <Text style={tw`text-xl font-bold text-slate-800`}>{diasOfensiva} dias</Text>
            <Text style={tw`text-slate-500`}>de ofensiva!</Text>
          </View>

          <Pressable
            onPress={() => router.push("/(tabs)/achievements")} // 5. CORREÇÃO: Link corrigido
            style={({ pressed }) => [
              tw`flex-1 bg-white p-4 rounded-2xl shadow-md shadow-slate-200 items-center justify-center`,
              pressed && tw`bg-gray-100`,
            ]}
          >
            <Feather name="award" size={32} color={tw.color("amber-500")} />
            <Text style={tw`text-xl font-bold text-slate-800 mt-2`}>Conquistas</Text>
            <Text style={tw`text-slate-500`}>Ver medalhas</Text>
          </Pressable>
        </View>

        <View>
          <View style={tw`flex-row justify-between items-center mb-4`}>
            <Text style={tw`text-xl font-bold text-slate-800`}>Histórico Recente</Text>
            <Pressable onPress={() => router.push("/historico")}>
              <Text style={tw`text-blue-600 font-semibold`}>Ver histórico</Text>
            </Pressable>
          </View>

          <View style={tw`bg-white p-4 rounded-2xl shadow-md shadow-slate-200`}>
            {loading && !refreshing ? (
              <View style={tw`py-6 items-center`}>
                <ActivityIndicator size="small" />
              </View>
            ) : lastThree.length === 0 ? (
              <Text style={tw`text-slate-500 py-4`}>Nenhuma medição registrada.</Text>
            ) : (
              lastThree.map((medicao, index) => (
                <Pressable
                  key={medicao.id ?? index}
                  onPress={() => router.push("/historico")}
                  style={tw`flex-row justify-between items-center py-3 ${index < lastThree.length - 1 ? "border-b border-slate-100" : ""
                    }`}
                >
                  <View style={tw`flex-row items-center gap-3`}>
                    <View style={tw`bg-blue-50 p-2 rounded-full`}>
                      <Feather name="droplet" size={16} color={tw.color("blue-600")} />
                    </View>
                    <Text style={tw`text-lg font-semibold text-slate-700`}>
                      {medicao.value} mg/dL
                    </Text>
                  </View>
                  <Text style={tw`text-slate-500`}>
                    {new Date(medicao.date).toLocaleString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </Pressable>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}