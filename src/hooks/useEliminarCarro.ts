//hook para eliminar un carro
//recibe solo el id y llama a carrosService.remove() para eliminarlo
//onSuccess: invalida la query carros para refrescar la lista automaticamnete 
import {useQuery, useQueryClient, useMutation} from '@tanstack/react-query'
import { carrosService } from '@/api/carros.service'
import { Carro} from '@/types/carro'
import { KEY } from './useCarros'

export function useEliminarCarro(){
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => carrosService.remove(id),
        onSuccess: () => qc.invalidateQueries({queryKey: KEY})
    })
}