//TAB desde expo-router, define la navegacion de tipo stack
//importamos QueryClient, QueryClientProvider desde tanStack
//Estos se usan para configurar y proveeder el cliente de querys de toda la app

import {Tabs} from 'expo-router'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {SymbolView} from 'expo-symbols'
import {StatusBar} from 'expo-status-bar'
import {View, StyleSheet} from 'react-native'

import {Patiotuerca} from '@/constants/patiotuerca'

//Creamos una instancia de QueryClient
//Este objeto administra la cache y el ciclo de vida de la querys/mutations
const qc = new QueryClient()

//Componente Layout, para envolver la navegacion dentro de QueryClientProvider
//Con eso, todos los componentes hijos pueden usar useQuery y useMutation
//Este el punto de integracion entra tanStack Query y la navegacion de EXPO

export default function Layout(){
  return (
    <QueryClientProvider client = {qc}>
    {/* Iconos de la barra de estado en blanco para que se vean sobre el header rojo */}
    <StatusBar style='light'/>
    <Tabs
      backBehavior='history'
      screenOptions={{
        //Header: titulo PATIOTUERCA centrado en todas las pantallas
        headerTitle: 'PATIOTUERCA',
        headerTitleAlign: 'center',
        //Header rojo de marca con titulo blanco
        headerTitleStyle: {color: '#FFFFFF', fontWeight: 'bold', fontSize: 20, letterSpacing: 3},
        headerStyle: {backgroundColor: Patiotuerca.rojo},
        headerShadowVisible: false,
        //Barra de tabs blanca: la pestaña activa en rojo, con una pildora rosada detras del icono
        tabBarActiveTintColor: Patiotuerca.rojo,
        tabBarInactiveTintColor: Patiotuerca.textoSecundario,
        tabBarStyle: {
          backgroundColor: Patiotuerca.superficie,
          borderTopColor: Patiotuerca.rojo,
          borderTopWidth: 2
        },
        tabBarLabelStyle: {fontWeight: 'bold', fontSize: 11, letterSpacing: 0.5}
      }}
    >
      <Tabs.Screen
        name = 'index'
        options = {{
          title: 'ADD CARS',
          //name por plataforma: SF Symbols en iOS, Material Symbols en Android y web
          tabBarIcon: ({color, focused}) => (
            <View style={[styles.pildora, focused && styles.pildoraActiva]}>
              <SymbolView name={{ios: 'plus.circle.fill', android: 'add_circle', web: 'add_circle'}} tintColor={color} size={22}/>
            </View>
          )
        }}
      />
      <Tabs.Screen
        name = 'explore'
        options = {{
          title: 'DETAILS',
          tabBarIcon: ({color, focused}) => (
            <View style={[styles.pildora, focused && styles.pildoraActiva]}>
              <SymbolView name={{ios: 'car.fill', android: 'directions_car', web: 'directions_car'}} tintColor={color} size={22}/>
            </View>
          )
        }}
      />
      {/* Detalle del carro: existe como ruta pero sin boton en la barra de tabs (href: null) */}
      <Tabs.Screen name = 'carro/[id]' options = {{title: 'Detalle del vehículo', href: null}}/>
    </Tabs>
    </QueryClientProvider>
  )
}

const styles = StyleSheet.create({
  //Contenedor del icono de cada tab. Cuando esta activo se pinta de rosado suave
  pildora: {width: 52, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center'},
  pildoraActiva: {backgroundColor: Patiotuerca.rojoFondo}
})
