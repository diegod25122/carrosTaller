//Hook para obtener un solo carro por id (pantalla de detalle)
//queryKey ['carros', id]: empieza con KEY, asi que cuando agregar/editar/eliminar
//invalidan KEY, este detalle tambien se refresca
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { carrosService } from '@/api/carros.service'
import { Carro } from '@/types/carro'
import { KEY } from './useCarros'

export function useCarro(id: string){
    const qc = useQueryClient()
    return useQuery({
        queryKey: [...KEY, id],
        queryFn: () => carrosService.getById(id),
        //Si la lista ya esta en cache, mostramos ese carro al instante sin esperar el GET
        initialData: () => qc.getQueryData<Carro[]>(KEY)?.find(carro => carro.id === id),
        staleTime: 1000*60*5
    })
}
