//importamos los hooks de tanstack query
//useQuery: para consultas GET
//useQueryClient: para interactuar con la cache (invalidar, refrescar)
//useMutation: para operaciones POST-PUT-DELETE

import {useQuery, useQueryClient, useMutation} from '@tanstack/react-query'
import { carrosService } from '@/api/carros.service'
import { Carro} from '@/types/carro'

//definir una constante key que servira como identificador unico
//para las querys relacionadas con carros
export const KEY = ['carros']

export function useCarros(){
    return useQuery({
        queryKey: KEY,
        queryFn: ()=>{
            console.log("GET ejecutado con tanStack")
            return carrosService.getAll()
        },
        //staleTime no significa cuantos tiempo se guardan los datos en cache
        //Sino cuanto tiempo los datos se consideran frescos
        staleTime:1000*60*5 //Cache valido de 5 minutos
    })
}

//hook para agregar recibe el carro sin id , onSucces valida la query carros para refrescar la lista automaticamnete 
export function useAgregarCarro(){
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (carro: Omit<Carro, 'id'>) => carrosService.add(carro),
        onSuccess: () => qc.invalidateQueries({queryKey: KEY})
    })
}
