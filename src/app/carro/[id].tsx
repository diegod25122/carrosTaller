import { View, Text, ScrollView, Pressable, ActivityIndicator, StyleSheet } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'

import { useCarro } from '@/hooks/useCarro'
import { Patiotuerca } from '@/constants/patiotuerca'

//Formatea numeros con separador de miles (15000 -> 15,000). Si no es numero, lo deja igual
const formatearNumero = (valor: string | number | undefined) => {
  const numero = Number(valor)
  return Number.isFinite(numero) ? numero.toLocaleString('en-US') : String(valor ?? '-')
}

//Pantalla de detalle: /carro/123 -> id = '123'
export default function DetalleCarro(){
  const { id } = useLocalSearchParams<{ id: string }>()
  const { data: carro, isLoading, error } = useCarro(id)

  const volver = () => router.canGoBack() ? router.back() : router.replace('/')

  if (isLoading) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color={Patiotuerca.rojo}/>
      </View>
    )
  }

  if (error || !carro) {
    return (
      <View style={styles.centrado}>
        <Text style={styles.alerta}>
          {error ? `No se pudo cargar el vehículo: ${error.message}` : 'Este vehículo no existe'}
        </Text>
        <BotonPrimario titulo="Volver a la lista" onPress={volver}/>
      </View>
    )
  }

  //Datos de la ficha tecnica, basados en la interfaz Carro
  const ficha = [
    { label: 'Marca', valor: carro.marca },
    { label: 'Modelo', valor: carro.modelo },
    { label: 'Año', valor: carro.anio },
    { label: 'Color', valor: carro.color },
    { label: 'Kilometraje', valor: `${formatearNumero(carro.kilometraje)} km` },
  ]

  return (
    <ScrollView style={styles.pantalla} contentContainerStyle={styles.contenido}>
      {/* Tarjeta principal: nombre, año/km y precio destacado */}
      <View style={styles.tarjeta}>
        <View style={styles.chips}>
          <Text style={styles.chip}>{carro.anio}</Text>
          <Text style={styles.chip}>{formatearNumero(carro.kilometraje)} km</Text>
          {!!carro.color && <Text style={styles.chip}>{carro.color}</Text>}
        </View>

        <Text style={styles.nombre}>{carro.marca} {carro.modelo}</Text>
        <Text style={styles.secundario}>Año {carro.anio} · {formatearNumero(carro.kilometraje)} km</Text>

        <Text style={styles.precioLabel}>Precio</Text>
        <Text style={styles.precio}>${formatearNumero(carro.precio)}</Text>
      </View>

      {/* Ficha tecnica */}
      <View style={styles.tarjeta}>
        <Text style={styles.seccion}>Ficha técnica</Text>
        {ficha.map((fila, i) => (
          <View key={fila.label} style={[styles.fila, i === ficha.length - 1 && { borderBottomWidth: 0 }]}>
            <Text style={styles.filaLabel}>{fila.label}</Text>
            <Text style={styles.filaValor}>{fila.valor ?? '-'}</Text>
          </View>
        ))}
        <Text style={styles.idTexto}>ID del vehículo: {carro.id}</Text>
      </View>

      <BotonPrimario titulo="Volver a la lista" onPress={volver}/>
    </ScrollView>
  )
}

//Boton principal Patiotuerca: rojo, texto blanco en negrita, rojo claro al presionar
function BotonPrimario({ titulo, onPress }: { titulo: string, onPress: () => void }){
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.boton, pressed && styles.botonPresionado]}
    >
      <Text style={styles.botonTexto}>{titulo}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: Patiotuerca.fondo },
  contenido: { padding: 16, paddingBottom: 32, gap: 16 },
  centrado: {
    flex: 1, backgroundColor: Patiotuerca.fondo,
    alignItems: 'center', justifyContent: 'center', padding: 24, gap: 16
  },
  tarjeta: {
    backgroundColor: Patiotuerca.superficie,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Patiotuerca.borde,
    padding: 16,
    //Sombra sutil (iOS usa shadow*, Android usa elevation)
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  chip: {
    backgroundColor: Patiotuerca.rojoFondo,
    color: Patiotuerca.texto,
    fontSize: 13,
    fontWeight: '600',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: 'hidden'
  },
  nombre: { fontSize: 24, fontWeight: 'bold', color: Patiotuerca.texto },
  secundario: { fontSize: 15, color: Patiotuerca.textoSecundario, marginTop: 4 },
  precioLabel: { fontSize: 13, color: Patiotuerca.textoSecundario, marginTop: 16 },
  precio: { fontSize: 32, fontWeight: 'bold', color: Patiotuerca.rojo },
  seccion: { fontSize: 18, fontWeight: 'bold', color: Patiotuerca.texto, marginBottom: 8 },
  fila: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 12, borderBottomWidth: 1, borderColor: Patiotuerca.borde
  },
  filaLabel: { fontSize: 15, color: Patiotuerca.textoSecundario },
  filaValor: { fontSize: 15, fontWeight: '600', color: Patiotuerca.texto },
  idTexto: { fontSize: 12, color: Patiotuerca.textoSecundario, marginTop: 12 },
  alerta: {
    backgroundColor: Patiotuerca.rojoFondo, color: Patiotuerca.texto,
    padding: 12, borderRadius: 8, textAlign: 'center'
  },
  boton: {
    backgroundColor: Patiotuerca.rojo,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  botonPresionado: { backgroundColor: Patiotuerca.rojoActivo },
  botonTexto: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 }
})
