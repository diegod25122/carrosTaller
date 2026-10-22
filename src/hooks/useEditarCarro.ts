import {useQuery, useQueryClient, useMutation} from '@tanstack/react-query'
import { carrosService } from '@/api/carros.service'
import { Carro} from '@/types/carro'
import { KEY } from './useCarros'


//hook para editar un carro
//recibe el carro comleto (con id)y lama a carrosService.update() para actualizarlo
//onSuccess: invalida la query 'carros' para refrescar la lista automaticamente
export function useEditarCarro(){
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (carro: Carro) => carrosService.update(carro),
        onSuccess: () => qc.invalidateQueries({queryKey: KEY})
    })
}