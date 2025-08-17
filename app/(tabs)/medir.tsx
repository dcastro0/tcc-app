import { Feather } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import React, { useState } from "react"
import {
    Modal,
    Pressable,
    SafeAreaView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native"
import tw from "twrnc"

export default function MedirScreen() {
    const router = useRouter()
    const [valor, setValor] = useState("")
    const [tagSelecionada, setTagSelecionada] = useState<string | null>(null)
    const [modalVisivel, setModalVisivel] = useState(false)

    const tags = ["Em jejum", "Pós-refeição", "Ao acordar", "Exercício"]

    const handleSalvar = () => {
        if (valor.trim()) {
            setModalVisivel(true)
        }
    }

    const handleFecharModal = () => {
        setModalVisivel(false)
        setValor("")
        setTagSelecionada(null)
        router.push("/")
    }

    return (
        <SafeAreaView style={tw`flex-1 bg-slate-50`}>
            <View style={tw`flex-1 p-6 mt-8`}>
                <View style={tw`mb-8 pt-4`}>
                    <Text style={tw`text-2xl font-bold text-slate-800 text-center`}>
                        Novo Registro de Glicemia
                    </Text>
                </View>

                <View style={tw`bg-white rounded-3xl p-6 shadow-md shadow-slate-200 mb-8 items-center`}>
                    <Text style={tw`text-lg text-slate-500 mb-2`}>
                        Qual o valor da sua glicemia?
                    </Text>
                    <View style={tw`flex-row items-end`}>
                        <TextInput
                            style={tw`text-6xl font-bold text-blue-600 text-center`}
                            placeholder="105"
                            placeholderTextColor={tw.color("slate-300")}
                            keyboardType="numeric"
                            value={valor}
                            onChangeText={setValor}
                            autoFocus={true}
                        />
                        <Text style={tw`text-xl font-semibold text-slate-400 pb-2 ml-2`}>
                            mg/dL
                        </Text>
                    </View>
                </View>

                <View style={tw`mb-8`}>
                    <Text style={tw`text-lg font-semibold text-slate-700 mb-3`}>
                        Adicionar etiqueta (opcional)
                    </Text>
                    <View style={tw`flex-row flex-wrap gap-3`}>
                        {tags.map((tag) => (
                            <TouchableOpacity
                                key={tag}
                                onPress={() => setTagSelecionada(tag)}
                                style={tw`px-4 py-2 rounded-full ${tagSelecionada === tag ? 'bg-blue-600' : 'bg-slate-200'
                                    }`}
                            >
                                <Text style={tw`font-semibold ${tagSelecionada === tag ? 'text-white' : 'text-slate-600'
                                    }`}>{tag}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={tw`mt-auto`}>
                    <Pressable
                        onPress={handleSalvar}
                        disabled={!valor.trim()}
                        style={({ pressed }) => [
                            tw`bg-blue-600 py-4 rounded-2xl shadow-lg shadow-blue-200`,
                            pressed && tw`scale-98`,
                            !valor.trim() && tw`bg-blue-300`,
                        ]}
                    >
                        <Text style={tw`text-white text-center text-lg font-bold`}>
                            Salvar Medição
                        </Text>
                    </Pressable>
                </View>
            </View>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisivel}
                onRequestClose={handleFecharModal}
            >
                <View style={tw`flex-1 justify-center items-center bg-black/60`}>
                    <View style={tw`bg-white w-4/5 rounded-3xl p-6 items-center`}>
                        <View style={tw`bg-green-100 p-4 rounded-full mb-4`}>
                            <Feather name="check" size={40} color={tw.color("green-600")} />
                        </View>
                        <Text style={tw`text-2xl font-bold text-slate-800 mb-2`}>
                            Registro Salvo!
                        </Text>
                        <Text style={tw`text-slate-500 text-center mb-4`}>
                            Ótimo trabalho! Manter seus registros em dia é fundamental.
                        </Text>
                        <View style={tw`bg-yellow-100 rounded-full px-4 py-2 mb-6`}>
                            <Text style={tw`text-lg font-bold text-yellow-700`}>
                                ✨ +50 Pontos!
                            </Text>
                        </View>
                        <Pressable
                            onPress={handleFecharModal}
                            style={({ pressed }) => [
                                tw`bg-blue-600 w-full py-3 rounded-xl`,
                                pressed && tw`bg-blue-700`,
                            ]}
                        >
                            <Text style={tw`text-white text-center font-bold`}>Continuar</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    )
}