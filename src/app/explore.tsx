import { useEffect, useState } from "react";
import {View, Text, FlatList} from 'react-native'
import {Carro} from "../types/carro"
import { carrosService } from "@/api/carros.service";
import { useCarros } from "@/hooks/useCarros";

//const URL=`${process.env.EXPO_PUBLIC_API_URL}patio`

export default function Explore(){

  //Misma querykey que index: Comparten la cache con esa vista, asi que no se repite el GET 
  //Pero mientras los datos esten frescos

  //const [carros, setCarros] = useState<Carro[]>([])

  //useEffect(()=>{
  //  console.log('GET ejecutado desde pantalla Explore con axios(Sin Cache)', URL)
  //  carrosService.getAll().then(setCarros)
  //},[])

  const {data: carros = []} = useCarros()

  return (
    <View style={{flex: 1, paddingTop: 60, backgroundColor:'#fff'}}>
    <FlatList 
      data={carros}
      keyExtractor={item => item.id}
      renderItem={({item}) => <Text>{item.id} - {item.marca}</Text>}
    />
    </View>
  )
}


