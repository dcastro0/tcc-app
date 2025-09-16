import {
  deleteMeasurement,
  getMeasurements,
  initMeasurementTable,
  Measurement,
} from "@/services/orm/entities/measurement"
import { Feather } from "@expo/vector-icons"
import React, { useCallback, useEffect, useState } from "react"
import { ActivityIndicator, Alert, FlatList, Pressable, RefreshControl, SafeAreaView, Text, View } from "react-native"
import tw from "twrnc"

const ITEM_HEIGHT = 72

function ItemRow({ item, onDelete }: { item: Measurement; onDelete: (id?: number) => void }) {
  return (
    <View style={tw`flex-row justify-between items-center py-3 px-2 h-18`} >
      <View style={tw`flex-row items-center gap-3`}>
        <View style={tw`bg-blue-50 p-2 rounded-full`}>
          <Feather name="droplet" size={16} color="#2563eb" />
        </View>
        <View>
          <Text style={tw`text-lg font-semibold text-slate-700`}>{item.value} mg/dL</Text>
          <Text style={tw`text-slate-500 text-sm`}>{new Date(item.date).toLocaleString()}</Text>
        </View>
      </View>
      <Pressable onPress={() => onDelete(item.id)} style={tw`p-2`}>
        <Feather name="trash-2" size={18} color="#ef4444" />
      </Pressable>
    </View>
  )
}

const MemoItemRow = React.memo(ItemRow, (prev, next) => prev.item.id === next.item.id && prev.item.value === next.item.value && prev.item.date === next.item.date)

export default function HistoricoScreen() {
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [measurements, setMeasurements] = useState<Measurement[]>([])

  const loadAll = useCallback(async () => {
    setLoading(true)
    try {
      await initMeasurementTable()
      const rows = await getMeasurements()
      const sorted = rows.sort((a, b) => (a.date < b.date ? 1 : -1))
      setMeasurements(sorted)
    } catch (err) {
      console.error("Erro carregando histórico:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      await loadAll()
      if (!mounted) return
    })()
    return () => { mounted = false }
  }, [loadAll])

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    try {
      await loadAll()
    } finally {
      setRefreshing(false)
    }
  }, [loadAll])

  const handleDelete = useCallback((id?: number) => {
    if (!id) return
    Alert.alert("Confirmar", "Deseja remover esta medição?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: async () => {
          const prev = measurements
          const next = prev.filter((m) => m.id !== id)
          setMeasurements(next)
          try {
            await deleteMeasurement(id)
          } catch (err) {
            console.error("Erro ao deletar:", err)
            setMeasurements(prev)
            Alert.alert("Erro", "Não foi possível deletar a medição.")
          }
        },
      },
    ])
  }, [measurements])

  const keyExtractor = useCallback((item: Measurement) => String(item.id ?? Math.random()), [])
  const renderItem = useCallback(({ item }: { item: Measurement }) => <MemoItemRow item={item} onDelete={handleDelete} />, [handleDelete])
  interface GetItemLayoutResult {
    length: number
    offset: number
    index: number
  }

  type GetItemLayout = (data: ArrayLike<Measurement> | null | undefined, index: number) => GetItemLayoutResult

  const getItemLayout: GetItemLayout = useCallback((_, index: number): GetItemLayoutResult => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }), [])

  if (loading) {
    return (
      <SafeAreaView style={tw`flex-1 justify-center items-center bg-slate-50`}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-slate-50`}>
      <View style={tw`p-4`}>
        <Text style={tw`text-2xl font-bold text-slate-800 mb-4`}>Histórico de Medições</Text>

        <FlatList
          data={measurements}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          initialNumToRender={20}
          maxToRenderPerBatch={20}
          windowSize={11}
          removeClippedSubviews={true}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          getItemLayout={getItemLayout}
          ItemSeparatorComponent={() => <View style={tw`h-px bg-slate-100`} />}
          contentContainerStyle={tw`bg-white rounded-2xl p-2 shadow-md`}
        />

        {measurements.length === 0 && (
          <View style={tw`mt-6 items-center`}>
            <Text style={tw`text-slate-500`}>Nenhuma medição registrada.</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  )
}
