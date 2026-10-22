import { ReactNode } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'

import { Carro } from '@/types/carro'
import { Patiotuerca } from '@/constants/patiotuerca'
import { Icono } from './icono'

//Formatea numeros con separador de miles (15000 -> 15,000). Si no es numero muestra '-'
export const formatearNumero = (valor: string | number | undefined) => {
  const numero = Number(valor)
  return valor !== undefined && valor !== '' && Number.isFinite(numero) ? numero.toLocaleString('en-US') : '-'
}

type Props = {
  carro: Carro
  //Al tocar la tarjeta (por ejemplo, abrir el detalle)
  onPress?: () => void
  //Resalta la tarjeta con borde rojo (por ejemplo, cuando se esta editando)
  resaltada?: boolean
  //Texto del chip superior cuando esta resaltada
  etiqueta?: string
  //Contenido extra al final de la tarjeta (botones de editar/eliminar)
  children?: ReactNode
}

//Tarjeta de vehiculo Patiotuerca: imagen superior, marca y modelo, precio en rojo y chips de año y km
export function TarjetaCarro({ carro, onPress, resaltada, etiqueta, children }: Props){
  return (
    <View style={[styles.tarjeta, resaltada && styles.tarjetaResaltada]}>
      <Pressable onPress={onPress} disabled={!onPress} style={({ pressed }) => pressed && { opacity: 0.85 }}>
        {/* Imagen superior: el modelo Carro no tiene foto, asi que mostramos un espacio con icono y marca */}
        <View style={styles.imagen}>
          <View style={styles.imagenCirculo}>
            <Icono nombre="auto" color={Patiotuerca.rojo} size={44}/>
          </View>
          <Text style={styles.imagenMarca} numberOfLines={1}>{carro.marca}</Text>
          {/* Año en la esquina superior derecha */}
          {!!carro.anio && <Text style={styles.anioEsquina}>{carro.anio}</Text>}
          {resaltada && !!etiqueta && <Text style={styles.etiqueta}>{etiqueta}</Text>}
        </View>

        <View style={styles.cuerpo}>
          <Text style={styles.titulo} numberOfLines={1}>{carro.marca} {carro.modelo}</Text>
          {!!carro.color && <Text style={styles.secundario}>Color {carro.color}</Text>}

          <Text style={styles.precio}>${formatearNumero(carro.precio)}</Text>

          <View style={styles.chips}>
            <View style={styles.chip}>
              <Icono nombre="anio" color={Patiotuerca.rojo} size={14}/>
              <Text style={styles.chipTexto}>{carro.anio ?? '-'}</Text>
            </View>
            <View style={styles.chip}>
              <Icono nombre="kilometraje" color={Patiotuerca.rojo} size={14}/>
              <Text style={styles.chipTexto}>{formatearNumero(carro.kilometraje)} km</Text>
            </View>
          </View>

          {!!onPress && (
            <View style={styles.verDetalle}>
              <Text style={styles.verDetalleTexto}>Ver detalle</Text>
              <Icono nombre="flecha" color={Patiotuerca.rojo} size={16}/>
            </View>
          )}
        </View>
      </Pressable>

      {!!children && <View style={styles.acciones}>{children}</View>}
    </View>
  )
}

//Boton de accion dentro de la tarjeta. 'primario' = rojo relleno, 'secundario' = borde neutro
export function BotonTarjeta({ titulo, onPress, variante = 'secundario', disabled }: {
  titulo: string, onPress: () => void, variante?: 'primario' | 'secundario', disabled?: boolean
}){
  const primario = variante === 'primario'
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.boton,
        primario ? styles.botonPrimario : styles.botonSecundario,
        pressed && (primario ? { backgroundColor: Patiotuerca.rojoActivo } : { borderColor: Patiotuerca.rojoSuave }),
        disabled && { opacity: 0.5 }
      ]}
    >
      <Text style={[styles.botonTexto, { color: primario ? '#FFFFFF' : Patiotuerca.rojo }]}>{titulo}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: Patiotuerca.superficie,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Patiotuerca.borde,
    marginBottom: 16,
    overflow: 'hidden',
    //Sombra sutil (iOS usa shadow*, Android usa elevation)
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2
  },
  tarjetaResaltada: { borderColor: Patiotuerca.rojo, borderWidth: 2 },
  imagen: {
    height: 140,
    backgroundColor: Patiotuerca.rojoFondo,
    alignItems: 'center',
    justifyContent: 'center'
  },
  imagenCirculo: {
    width: 76, height: 76, borderRadius: 38,
    backgroundColor: Patiotuerca.superficie,
    borderWidth: 3, borderColor: Patiotuerca.rojoSuave,
    alignItems: 'center', justifyContent: 'center'
  },
  imagenMarca: {
    fontSize: 13, fontWeight: 'bold', color: Patiotuerca.rojo,
    textTransform: 'uppercase', letterSpacing: 1.5, marginTop: 8
  },
  anioEsquina: {
    position: 'absolute', top: 10, right: 10,
    backgroundColor: Patiotuerca.superficie, color: Patiotuerca.rojo,
    fontSize: 12, fontWeight: 'bold',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, overflow: 'hidden'
  },
  etiqueta: {
    position: 'absolute', top: 10, left: 10,
    backgroundColor: Patiotuerca.rojo, color: '#FFFFFF',
    fontSize: 12, fontWeight: 'bold',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, overflow: 'hidden'
  },
  cuerpo: { padding: 14 },
  titulo: { fontSize: 18, fontWeight: 'bold', color: Patiotuerca.texto },
  secundario: { fontSize: 14, color: Patiotuerca.textoSecundario, marginTop: 2 },
  precio: { fontSize: 26, fontWeight: 'bold', color: Patiotuerca.rojo, marginTop: 8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Patiotuerca.rojoFondo,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999
  },
  chipTexto: { color: Patiotuerca.texto, fontSize: 13, fontWeight: '600' },
  verDetalle: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 2,
    marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderColor: Patiotuerca.borde
  },
  verDetalleTexto: { color: Patiotuerca.rojo, fontWeight: 'bold', fontSize: 14 },
  acciones: {
    flexDirection: 'row', gap: 10,
    paddingHorizontal: 14, paddingBottom: 14
  },
  boton: { flex: 1, borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  botonPrimario: { backgroundColor: Patiotuerca.rojo },
  botonSecundario: { backgroundColor: Patiotuerca.superficie, borderWidth: 1, borderColor: Patiotuerca.borde },
  botonTexto: { fontWeight: 'bold', fontSize: 15 }
})
