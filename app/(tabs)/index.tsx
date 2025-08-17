import { Feather } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import React, { useEffect } from "react"
import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native"
import tw from "twrnc"

export default function HomeScreen() {
  const router = useRouter()
  const [init, setInit] = React.useState(true)

  const userProfile = {
    nome: "Caio",
    pontos: 1250,
    diasOfensiva: 5,
  }
  useEffect(() => {
    const timer = setTimeout(() => {
      setInit(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])
  const ultimasMedicoes = [
    { id: 1, valor: "112 mg/dL", hora: "Hoje, 08:30" },
    { id: 2, valor: "135 mg/dL", hora: "Ontem, 13:10" },
    { id: 3, valor: "120 mg/dL", hora: "Ontem, 19:45" },
  ]

  const ultimaMedicao = ultimasMedicoes[0]

  return (
    <SafeAreaView style={tw`flex-1 bg-slate-50`}>
      <ScrollView
        style={tw`flex-1`}
        contentContainerStyle={tw`p-6 pt-10`}
      >
        <View style={tw`mb-8 mt-8`}>
          {init && <Text style={tw`text-4xl text-slate-600 bg-green-400`}>Olá, {userProfile.nome} 👋</Text>}
          <Text style={tw`text-3xl font-bold text-blue-600`}>
            Pronto para mais um dia de conquistas?
          </Text>
        </View>

        <View style={tw`bg-blue-600 rounded-3xl p-6 shadow-xl shadow-blue-200 mb-8`}>
          <View style={tw`flex-row items-start justify-between mb-4`}>
            <View>
              <Text style={tw`text-lg font-bold text-white`}>Controle Diário</Text>
              <Text style={tw`text-white/80`}>Sua saúde em primeiro lugar.</Text>
            </View>
            <View style={tw`flex-row items-center gap-2 bg-white/20 rounded-full px-3 py-1`}>
              <Feather name="zap" size={14} color="white" />
              <Text style={tw`text-white font-bold`}>{userProfile.pontos} pts</Text>
            </View>
          </View>

          <Text style={tw`text-white/80 text-sm mb-1`}>Último registro:</Text>
          <Text style={tw`text-white text-3xl font-bold mb-6`}>{ultimaMedicao.valor}</Text>

          <Pressable
            onPress={() => router.push("/medir")}
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
            <Text style={tw`text-xl font-bold text-slate-800`}>{userProfile.diasOfensiva} dias</Text>
            <Text style={tw`text-slate-500`}>de ofensiva!</Text>
          </View>

          <Pressable
            onPress={() => router.push("/anchievements")}
            style={({ pressed }) => [
              tw`flex-1 bg-white p-4 rounded-2xl shadow-md shadow-slate-200 items-center justify-center`,
              pressed && tw`bg-gray-100`
            ]}
          >
            <Feather name="award" size={32} color="#f59e0b" />
            <Text style={tw`text-xl font-bold text-slate-800 mt-2`}>Conquistas</Text>
            <Text style={tw`text-slate-500`}>Ver medalhas</Text>
          </Pressable>
        </View>

        <View>
          <Text style={tw`text-xl font-bold text-slate-800 mb-4`}>Histórico Recente</Text>
          <View style={tw`bg-white p-4 rounded-2xl shadow-md shadow-slate-200`}>
            {ultimasMedicoes.map((medicao, index) => (
              <View
                key={medicao.id}
                style={tw`flex-row justify-between items-center py-3 ${index < ultimasMedicoes.length - 1 ? "border-b border-slate-100" : ""
                  }`}
              >
                <View style={tw`flex-row items-center gap-3`}>
                  <View style={tw`bg-blue-50 p-2 rounded-full`}>
                    <Feather name="droplet" size={16} color="#2563eb" />
                  </View>
                  <Text style={tw`text-lg font-semibold text-slate-700`}>{medicao.valor}</Text>
                </View>
                <Text style={tw`text-slate-500`}>{medicao.hora}</Text>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}