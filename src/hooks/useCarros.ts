//importamos los hooks de tanstack query
//useQuery: para consultas GET
//useQueryClient: para interactuar con la cache (invalidar, refrescar)
//useMutation: para operaciones POST-PUT-DELETE

import {useQuery, useQueryClient, useMutation} from '@tanstack/react-query'
import { carrosService } from '@/api/carros.service'

//definir una constante key que servira como identificador unico
//para las querys relacionadas con carros
const KEY = ['carros']

export function useCarros(){
    return useQuery({
        queryKey: ['carros'],
        queryFn: ()=>{
            console.log("GET ejecutado con tanStack")
            return carrosService.getAll()
        },
        //staleTime no significa cuantos tiempo se guardan los datos en cache
        //Sino cuanto tiempo los datos se consideran frescos
        staleTime:1000*60*5 //Cache valido de 5 minutos
    })
}

//Hook personalizado useAgregar carro que encapsula la logica de agregar un carro nuevo
//Usa useMutation con mutationFn que llama a carrosServvice.add()
//onSuccess: invalida la query 'carros' para refrescar la lista automaticamente
export function useAgregarCarro(){
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (marca:string) => carrosService.add(marca),
        onSuccess: () => qc.invalidateQueries({queryKey: KEY})
    })
}