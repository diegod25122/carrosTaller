//TAB desde expo-router, define la navegacion de tipo stack
//importamos QueryClient, QueryClientProvider desde tanStack
//Estos se usan para configurar y proveeder el cliente de querys de toda la app

import {Tabs} from 'expo-router'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'

//Creamos una instancia de QueryClient
//Este objeto administra la cache y el ciclo de vida de la querys/mutations
const qc = new QueryClient()

//Componente Layout, para envolver la navegacion dentro de QueryClientProvider
//Con eso, todos los componentes hijos pueden usar useQuery y useMutation
//Este el punto de integracion entra tanStack Query y la navegacion de EXPO

export default function Layout(){
  return (
    <QueryClientProvider client = {qc}>
    <Tabs>
      <Tabs.Screen name = 'index' options = {{title: 'Home'}}/>
      <Tabs.Screen name = 'explore' options = {{title: 'Explore'}}/>
    </Tabs>
    </QueryClientProvider>
  )
}