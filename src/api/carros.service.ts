//Importar el cliente axios y el tipo de carro
import {client} from './client'
import {Carro} from '../types/carro'
//import { get } from 'react-native/Libraries/NativeComponent/NativeComponentRegistry'

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

    //Metodo GET por id: trae un solo carro (pantalla de detalle)
    getById: async (id: string): Promise<Carro> => {
        const {data} = await client.get<Carro>(`patio/${id}`)
        return data
    },

    //Metodo POST: agregar un nuevo carro, retornar la promesa con el objeto carro
    //recibe el carro completo sin id pq mockapi lo genera automaticamente
    add: async (carro: Omit<Carro, 'id'>): Promise<Carro> => {
        const {data} = await client.post<Carro>('patio', carro)
        return data 
    },
    //metodo put reemplaqza los datos del carro con ese id y retorna el carro actualizado
    //separamos el id del resto el id va en la url y los demas campos en el lobby
    update: async(carro: Carro):Promise<Carro>=>{
        const {id, ...datos}= carro
        const {data} = await client.put<Carro>(`patio/${id}`, datos)
        return data
    },

    //borrar delete=> elimina el carro con ese id mockapi retorna el carro eliminado
    remove: async(id: string ): Promise<Carro>=>{
        const {data} = await client.delete<Carro>(`patio/${id}`)
        return data
    }
}   
