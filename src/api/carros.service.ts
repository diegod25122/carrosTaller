//Importar el cliente axios y el tipo de carro
import {client} from './client'
import {Carro} from '../types/carro'
import { get } from 'react-native/Libraries/NativeComponent/NativeComponentRegistry'

//definir un servicio llamado carrosService
//El servicio centraliza las operaciones de la entidad Carro
//retorna una promesa con un arreglo de objeto
//Poner metodos asincronicos para interactuar con la API

export const carrosService = {
    //Metodo GET
    getAll: async (): Promise<Carro[]> =>{
        const {data} = await client.get<Carro[]>('patio')   
        return data
    },

    //Metodo POST: agregar un nuevo carro, retornar la promesa con el objeto carro
    add: async (marca:string): Promise<Carro> => {
        const {data} = await client.post<Carro>('patio', {marca})
        return data 
    }
}