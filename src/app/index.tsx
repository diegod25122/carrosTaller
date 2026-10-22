import { useState } from "react";
import {View, Text, TextInput, Button, FlatList} from "react-native"

import {Carro} from "../types/carro"
import { carrosService } from "@/api/carros.service";
import { useCarros, useAgregarCarro } from "@/hooks/useCarros";


export default function App(){
  //Estado para almecenar la lista de carros obtenidos del backend mockeado
  //const [carros, setCarros] = useState<Carro[]>([])
  const [marca, setMarca] = useState('')

  //GET de tanStack Query  para manejar la carga, el cache y los estados
  const {data: carros = [], isLoading, error} = useCarros()

  //POST: la mutation invalida la query 'carros' y la lista se refresca 
  const {mutate: agregarCarro} = useAgregarCarro()

  //GET: una funcion reutulizable para traer la lista desde el backend
  //const cargar = () => {
  //    carrosService.getAll().then(setCarros)
  //    console.log('GET ejecutado con axios desde pantalla index') //Imprimira por cada get realizado
  //}
  
  //el useEffect se ejecuta una sola vez al montar el componente
  //useEffect( () => {cargar()}, [])

  
  const agregar = async () => {
    agregarCarro(marca, {onSuccess: () => setMarca('')})
  }
  
  //POST: funcion para agregar un nuevo carro
  //const agregar = async () => {
    
  //  await carrosService.add(marca)
  //  console.log('POST ejecutado con axios desde pantalla index')

  //  cargar() //Cargar GET para refrescar la lista de HOME
    //Limpiamos el input
  //  setMarca('')

  //}

  //isLoading es True solo durante la primera carga, cuando aun no hay datos
  //Mientras tantomostramos un texto en lugar de la pantalla con la vista vacia 
  if(isLoading) return <Text> Cargando...</Text>
  //SI el get fallo(sin red, servidor caido, etc) 'El metodo traer' trae la excepcion 
  //Mostramos un mensaje y no seguimos el return principal
  if(error) return <Text>Error: {error.message}</Text>


  return (
    <View style = {{flex: 1, paddingTop:60, backgroundColor:'#fff'}}>
      <TextInput
      value={marca}
      onChangeText={setMarca}
      style={{borderWidth:3}}/>

      <Button title = "Agregar" onPress={agregar}/>
      <FlatList 
        data={carros}
        keyExtractor={item => item.id}
        renderItem = {({item}) =>
          <Text>{item.id} - {item.marca}</Text>
        }
      />
    </View>
  )
}