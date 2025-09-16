import { useAuth } from "@/hooks/useAuth";
import { getMeasurements, initMeasurementTable, Measurement } from "@/services/orm/entities/measurement";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import tw from "twrnc";

export default function HomeScreen() {
  const router = useRouter();
  const { authData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [initTextVisible, setInitTextVisible] = useState(true);

  // usa campos do backend
  const nome = (authData as any)?.nome ?? "Caio";
  const basePoints = (authData as any)?.pontos ?? 1250;
  const diasOfensiva = (authData as any)?.streak_count ?? 0;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      await initMeasurementTable();
      const rows = await getMeasurements();
      const sorted = rows.sort((a, b) => (a.date < b.date ? 1 : -1));
      setMeasurements(sorted);
    } catch (err) {
      console.error("Erro ao carregar medições:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      await load();
      if (!mounted) return;
      setTimeout(() => setInitTextVisible(false), 1000);
    })();
    return () => {
      mounted = false;
    };
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await load();
    } finally {
      setRefreshing(false);
    }
  }, [load]);

  const lastThree = measurements.slice(0, 3);
  const pontosExtras = (measurements.length || 0) * 50;
  const pontosTotais = basePoints + pontosExtras;
  const ultimaMedicao = measurements.length > 0 ? measurements[0] : null;

  return (
    <SafeAreaView style={tw`flex-1 bg-slate-50`}>
      {/* BADGE pequeno no topo direito */}
      <View style={tw`absolute top-6 right-4 z-50`}>
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
          {initTextVisible && <Text style={tw`text-4xl text-slate-600`}>Olá, {nome} 👋</Text>}
          <Text style={tw`text-3xl font-bold text-blue-600`}>Pronto para mais um dia de conquistas?</Text>
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

          {loading ? (
            <View style={tw`py-6`}>
              <ActivityIndicator size="large" color="white" />
            </View>
          ) : ultimaMedicao ? (
            <>
              <Text style={tw`text-white text-3xl font-bold mb-1`}>
                {ultimaMedicao.value} mg/dL
              </Text>
              <Text style={tw`text-white/80 text-sm mb-6`}>{new Date(ultimaMedicao.date).toLocaleString()}</Text>
            </>
          ) : (
            <>
              <Text style={tw`text-white text-2xl font-bold mb-6`}>— Nenhuma medição —</Text>
              <Text style={tw`text-white/80 text-sm mb-6`}>Registre sua primeira medição agora.</Text>
            </>
          )}

          <Pressable
            onPress={() => router.push("/medir")}
            style={({ pressed }) => [
              tw`bg-white py-4 rounded-2xl shadow-md`,
              pressed && tw`bg-gray-200 scale-98`,
            ]}
          >
            <Text style={tw`text-blue-600 text-center text-lg font-bold`}>+ Registrar Nova Medição</Text>
          </Pressable>
        </View>

        <View style={tw`flex-row gap-4 mb-8`}>
          <View style={tw`flex-1 bg-white p-4 rounded-2xl shadow-md shadow-slate-200 items-center`}>
            <Text style={tw`text-5xl`}>🔥</Text>
            <Text style={tw`text-xl font-bold text-slate-800`}>{diasOfensiva} dias</Text>
            <Text style={tw`text-slate-500`}>de ofensiva!</Text>
          </View>

          <Pressable
            onPress={() => router.push("/anchievements")}
            style={({ pressed }) => [
              tw`flex-1 bg-white p-4 rounded-2xl shadow-md shadow-slate-200 items-center justify-center`,
              pressed && tw`bg-gray-100`,
            ]}
          >
            <Feather name="award" size={32} color="#f59e0b" />
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
            {loading ? (
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
                  style={tw`flex-row justify-between items-center py-3 ${index < lastThree.length - 1 ? "border-b border-slate-100" : ""}`}
                >
                  <View style={tw`flex-row items-center gap-3`}>
                    <View style={tw`bg-blue-50 p-2 rounded-full`}>
                      <Feather name="droplet" size={16} color="#2563eb" />
                    </View>
                    <Text style={tw`text-lg font-semibold text-slate-700`}>{medicao.value} mg/dL</Text>
                  </View>
                  <Text style={tw`text-slate-500`}>{new Date(medicao.date).toLocaleString()}</Text>
                </Pressable>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
