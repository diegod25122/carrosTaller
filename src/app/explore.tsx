import { View, Text, FlatList, StyleSheet } from 'react-native'
import { router } from 'expo-router'

import { useCarros } from "@/hooks/useCarros";
import { Patiotuerca } from '@/constants/patiotuerca'
import { TarjetaCarro } from '@/components/tarjeta-carro'

export default function Explore(){

  //Misma querykey que index: comparten la cache.
  //Cuando index agrega, edita o elimina, invalidateQueries refresca esta lista sola
  const {data: carros = []} = useCarros()

  return (
    <View style={styles.pantalla}>
      <FlatList
        data={carros}
        keyExtractor={item => item.id}
        contentContainerStyle={{padding: 16, paddingBottom: 32}}
        ListHeaderComponent={
          <View style={styles.seccion}>
            <View style={styles.seccionBarra}/>
            <Text style={styles.titulo}>Vehículos disponibles</Text>
            <Text style={styles.contador}>{carros.length}</Text>
          </View>
        }
        //Tocar la tarjeta abre la pantalla de detalle
        renderItem={({item}) => (
          <TarjetaCarro
            carro={item}
            onPress={() => router.push({pathname: '/carro/[id]', params: {id: item.id}})}
          />
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  pantalla: {flex: 1, backgroundColor: Patiotuerca.fondo},
  seccion: {flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12},
  seccionBarra: {width: 4, height: 22, borderRadius: 2, backgroundColor: Patiotuerca.rojo},
  titulo: {fontSize: 20, fontWeight: 'bold', color: Patiotuerca.texto},
  contador: {
    backgroundColor: Patiotuerca.rojo, color: '#FFFFFF',
    fontWeight: 'bold', fontSize: 13,
    paddingHorizontal: 10, paddingVertical: 2, borderRadius: 999, overflow: 'hidden'
  }
})
