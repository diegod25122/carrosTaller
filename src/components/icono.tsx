import { ColorValue } from 'react-native'
import { SymbolView, SymbolViewProps } from 'expo-symbols'

//Iconos de la app: SF Symbols en iOS, Material Symbols en Android y web
const ICONOS = {
  auto: { ios: 'car.fill', android: 'directions_car', web: 'directions_car' },
  agregar: { ios: 'plus.circle.fill', android: 'add_circle', web: 'add_circle' },
  marca: { ios: 'tag.fill', android: 'sell', web: 'sell' },
  modelo: { ios: 'car.side.fill', android: 'garage', web: 'garage' },
  anio: { ios: 'calendar', android: 'calendar_month', web: 'calendar_month' },
  color: { ios: 'paintpalette.fill', android: 'palette', web: 'palette' },
  precio: { ios: 'dollarsign.circle.fill', android: 'payments', web: 'payments' },
  kilometraje: { ios: 'speedometer', android: 'speed', web: 'speed' },
  editar: { ios: 'pencil', android: 'edit', web: 'edit' },
  eliminar: { ios: 'trash.fill', android: 'delete', web: 'delete' },
  flecha: { ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' },
} satisfies Record<string, SymbolViewProps['name']>

export type NombreIcono = keyof typeof ICONOS

export function Icono({ nombre, color, size = 20 }: { nombre: NombreIcono, color: ColorValue, size?: number }){
  return <SymbolView name={ICONOS[nombre]} tintColor={color} size={size}/>
}
