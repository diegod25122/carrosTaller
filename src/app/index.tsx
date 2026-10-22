import { useRef, useState } from "react";
import {View, Text, TextInput, FlatList, Alert, Platform, Pressable, StyleSheet} from "react-native"
import { useForm, useStore } from "@tanstack/react-form";
import { router } from "expo-router";

import {Carro} from "../types/carro"
import { useCarros, useAgregarCarro } from "@/hooks/useCarros";
import { useEditarCarro } from "@/hooks/useEditarCarro";
import { useEliminarCarro } from "@/hooks/useEliminarCarro";
import { Patiotuerca } from "@/constants/patiotuerca";
import { TarjetaCarro, BotonTarjeta } from "@/components/tarjeta-carro";
import { Icono } from "@/components/icono";

//Valores del formulario: todos son string porque los TextInput trabajan con texto
const valoresVacios = {marca: '', modelo: '', anio: '', color: '', precio: '', kilometraje: ''}
type ValoresFormulario = typeof valoresVacios
type NombreCampo = keyof ValoresFormulario

const ANIO_MIN = 1900
const ANIO_MAX = new Date().getFullYear() + 1

//Validaciones por campo: retornan el mensaje de error, o undefined si el valor es valido
const validaciones: Record<NombreCampo, (valor: string) => string | undefined> = {
  marca: (valor) => !valor.trim() ? 'La marca es obligatoria' : undefined,
  modelo: (valor) => !valor.trim() ? 'El modelo es obligatorio' : undefined,
  color: (valor) => {
    if (!valor.trim()) return 'El color es obligatorio'
    //Solo letras (incluye tildes y ñ) y espacios, para colores como "Azul marino"
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ\s]+$/.test(valor.trim())) return 'El color solo puede contener letras'
    return undefined
  },
  anio: (valor) => {
    if (!valor.trim()) return 'El año es obligatorio'
    const anio = Number(valor)
    if (!Number.isInteger(anio) || anio < ANIO_MIN || anio > ANIO_MAX) {
      return `El año debe estar entre ${ANIO_MIN} y ${ANIO_MAX}`
    }
    return undefined
  },
  precio: (valor) => {
    if (!valor.trim()) return 'El precio es obligatorio'
    if (!(Number(valor) > 0)) return 'El precio debe ser un número mayor que 0'
    return undefined
  },
  kilometraje: (valor) => {
    if (!valor.trim()) return 'El kilometraje es obligatorio'
    if (!(Number(valor) > 0)) return 'El kilometraje debe ser un número mayor que 0'
    return undefined
  }
}

//true si todos los campos pasan su validacion (se usa para habilitar/deshabilitar el boton)
const esValido = (valores: ValoresFormulario) =>
  (Object.keys(validaciones) as NombreCampo[]).every(campo => !validaciones[campo](valores[campo]))

//Lista de campos para dibujar el formulario sin repetir el mismo bloque 6 veces
const campos: {nombre: NombreCampo, label: string, placeholder: string, numerico?: boolean}[] = [
  {nombre: 'marca', label: 'Marca', placeholder: 'Ej. Chevrolet'},
  {nombre: 'modelo', label: 'Modelo', placeholder: 'Ej. Sail'},
  {nombre: 'anio', label: 'Año', placeholder: `Ej. ${ANIO_MAX - 1}`, numerico: true},
  {nombre: 'color', label: 'Color', placeholder: 'Ej. Rojo'},
  {nombre: 'precio', label: 'Precio (USD)', placeholder: 'Ej. 15000', numerico: true},
  {nombre: 'kilometraje', label: 'Kilometraje (km)', placeholder: 'Ej. 45000', numerico: true},
]

export default function App(){
  //Si tiene un id, el formulario esta editando ese carro. Si es null, esta agregando uno nuevo
  const [editandoId, setEditandoId] = useState<string | null>(null)
  //Campo que tiene el foco, para pintar su borde de rojo
  const [campoEnFoco, setCampoEnFoco] = useState<NombreCampo | null>(null)
  //Referencia a la lista para poder hacer scroll hasta el formulario al editar
  const listaRef = useRef<FlatList<Carro>>(null)

  //GET de tanStack Query para manejar la carga, el cache y los estados
  const {data: carros = [], isLoading, error} = useCarros()

  //Mutations: cada una tiene sus propios estados (isPending, isSuccess, isError)
  const agregar = useAgregarCarro()
  const editar = useEditarCarro()
  const eliminar = useEliminarCarro()

  //reset() borra el estado de exito/error para que no queden mensajes viejos en pantalla
  const limpiarMensajes = () => {
    agregar.reset(); editar.reset(); eliminar.reset()
  }

  //TanStack Form: maneja los valores del formulario, la validacion y el envio
  const form = useForm({
    defaultValues: valoresVacios,
    //onSubmit solo se ejecuta si todos los campos son validos
    onSubmit: async ({value}) => {
      limpiarMensajes()
      const datos = {
        marca: value.marca.trim(),
        modelo: value.modelo.trim(),
        color: value.color.trim(),
        precio: value.precio,
        anio: Number(value.anio),
        kilometraje: Number(value.kilometraje)
      }
      //mutateAsync retorna una promesa: mientras no termine, isSubmitting sigue en true
      try {
        if (editandoId) {
          await editar.mutateAsync({id: editandoId, ...datos})
        } else {
          await agregar.mutateAsync(datos)
        }
        limpiarFormulario()
      } catch {
        //No hacemos nada: el error ya se muestra con isError debajo del boton
      }
    }
  })

  //Estado del formulario para el boton: si se esta enviando y si hay algun campo invalido
  const enviando = useStore(form.store, (state) => state.isSubmitting)
  const invalido = useStore(form.store, (state) => !esValido(state.values))

  const limpiarFormulario = () => {
    form.reset(valoresVacios)
    setEditandoId(null)
  }

  //Precarga los datos actuales del carro en el formulario
  //?? '' usa texto vacio si el campo no viene (carros viejos de MockAPI sin ese campo)
  //keepDefaultValues: sin esto, reset cambia los defaultValues y en el siguiente render
  //useForm los vuelve a poner en valoresVacios, dejando el formulario en blanco
  const empezarEdicion = (carro: Carro) => {
    limpiarMensajes()
    form.reset({
      marca: carro.marca ?? '',
      modelo: carro.modelo ?? '',
      anio: String(carro.anio ?? ''),
      color: carro.color ?? '',
      precio: String(carro.precio ?? ''),
      kilometraje: String(carro.kilometraje ?? '')
    }, {keepDefaultValues: true})
    setEditandoId(carro.id)
    //Sube al formulario para que se vea lo que se esta editando
    listaRef.current?.scrollToOffset({offset: 0, animated: true})
  }

  //Pide confirmacion antes de borrar
  //Alert.alert con botones no funciona en web, ahi usamos window.confirm
  const confirmarEliminar = (carro: Carro) => {
    const mensaje = `¿Seguro que quieres eliminar ${carro.marca} ${carro.modelo}?`
    const borrar = () => { limpiarMensajes(); eliminar.mutate(carro.id) }

    if (Platform.OS === 'web') {
      if (window.confirm(mensaje)) borrar()
      return
    }
    Alert.alert('Eliminar carro', mensaje, [
      {text: 'Cancelar', style: 'cancel'},
      {text: 'Eliminar', style: 'destructive', onPress: borrar}
    ])
  }

  if(isLoading) return <Text> Cargando...</Text>
  if(error) return <Text>Error: {error.message}</Text>

  const botonDeshabilitado = invalido || enviando

  //Formulario dentro de una tarjeta blanca. Va como cabecera de la FlatList
  //para que toda la pantalla (formulario + lista) haga scroll junta
  const formulario = (
    <View>
      <View style={styles.tarjeta}>
        <Text style={styles.titulo}>{editandoId ? 'Editar carro' : 'Agregar carro'}</Text>
        <Text style={styles.subtitulo}>
          {editandoId ? 'Modifica los datos y guarda los cambios' : 'Completa los datos del vehículo'}
        </Text>

        {/* Un form.Field por cada campo, con su validacion al escribir (onChange) y al salir (onBlur) */}
        {campos.map(campo => (
          <form.Field
            key={campo.nombre}
            name={campo.nombre}
            validators={{
              onChange: ({value}) => validaciones[campo.nombre](value),
              onBlur: ({value}) => validaciones[campo.nombre](value)
            }}
          >
            {(field) => {
              const mostrarError = field.state.meta.isTouched && field.state.meta.errors.length > 0
              const enFoco = campoEnFoco === campo.nombre
              return (
                <View style={styles.campo}>
                  {/* Label con icono rojo en un circulo suave */}
                  <View style={styles.labelFila}>
                    <View style={[styles.labelIcono, enFoco && {backgroundColor: Patiotuerca.rojo}]}>
                      <Icono nombre={campo.nombre} color={enFoco ? '#FFFFFF' : Patiotuerca.rojo} size={14}/>
                    </View>
                    <Text style={[styles.label, enFoco && {color: Patiotuerca.rojo}]}>{campo.label}</Text>
                  </View>
                  <TextInput
                    value={field.state.value}
                    onChangeText={field.handleChange}
                    onFocus={() => setCampoEnFoco(campo.nombre)}
                    onBlur={() => { setCampoEnFoco(null); field.handleBlur() }}
                    placeholder={campo.placeholder}
                    placeholderTextColor={Patiotuerca.textoSecundario}
                    keyboardType={campo.numerico ? 'numeric' : 'default'}
                    selectionColor={Patiotuerca.rojo}
                    //Borde neutro que pasa a rojo al hacer foco o si hay error
                    style={[styles.input, (enFoco || mostrarError) && styles.inputActivo]}
                  />
                  {/* Mensaje de error bajo el campo, solo si el usuario ya lo toco */}
                  {mostrarError && <Text style={styles.error}>{field.state.meta.errors.join(', ')}</Text>}
                </View>
              )
            }}
          </form.Field>
        ))}

        {/* Boton principal: deshabilitado si algun campo es invalido o si se esta enviando */}
        <Pressable
          onPress={() => form.handleSubmit()}
          disabled={botonDeshabilitado}
          style={({pressed}) => [
            styles.boton,
            pressed && styles.botonPresionado,
            botonDeshabilitado && styles.botonDeshabilitado
          ]}
        >
          <Icono nombre={editandoId ? 'editar' : 'agregar'} color="#FFFFFF" size={20}/>
          <Text style={styles.botonTexto}>
            {enviando ? 'Guardando...' : editandoId ? 'Guardar cambios' : 'Agregar carro'}
          </Text>
        </Pressable>

        {editandoId && (
          <Pressable
            onPress={limpiarFormulario}
            style={({pressed}) => [styles.botonSecundario, pressed && {borderColor: Patiotuerca.rojoSuave}]}
          >
            <Text style={styles.botonSecundarioTexto}>Cancelar edición</Text>
          </Pressable>
        )}
      </View>

      {/* Mensajes de exito o error de cada mutation */}
      {agregar.isSuccess && <Text style={styles.exito}>✓ Carro agregado correctamente</Text>}
      {editar.isSuccess && <Text style={styles.exito}>✓ Carro actualizado correctamente</Text>}
      {eliminar.isSuccess && <Text style={styles.exito}>✓ Carro eliminado correctamente</Text>}
      {agregar.isError && <Text style={styles.alerta}>Error al agregar: {agregar.error.message}</Text>}
      {editar.isError && <Text style={styles.alerta}>Error al editar: {editar.error.message}</Text>}
      {eliminar.isError && <Text style={styles.alerta}>Error al eliminar: {eliminar.error.message}</Text>}

      {/* Encabezado de la lista con contador en un chip rojo */}
      <View style={styles.seccion}>
        <View style={styles.seccionBarra}/>
        <Text style={styles.titulo}>Carros registrados</Text>
        <Text style={styles.contador}>{carros.length}</Text>
      </View>
    </View>
  )

  return (
    <View style={styles.pantalla}>
      <FlatList
        ref={listaRef}
        data={carros}
        keyExtractor={item => item.id}
        ListHeaderComponent={formulario}
        //Permite tocar el boton aunque el teclado este abierto
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32}}
        renderItem = {({item}) => {
          //variables guarda el id que se esta eliminando, asi solo ese boton muestra "Eliminando..."
          const eliminando = eliminar.isPending && eliminar.variables === item.id
          //Resalta el carro que se esta editando para saber cual es
          const enEdicion = item.id === editandoId
          return (
            //Tocar la tarjeta abre la pantalla de detalle
            <TarjetaCarro
              carro={item}
              onPress={() => router.push({pathname: '/carro/[id]', params: {id: item.id}})}
              resaltada={enEdicion}
              etiqueta="Editando"
            >
              <BotonTarjeta titulo="Editar" onPress={() => empezarEdicion(item)} disabled={eliminando}/>
              <BotonTarjeta titulo={eliminando ? 'Eliminando...' : 'Eliminar'} variante="primario"
                onPress={() => confirmarEliminar(item)} disabled={eliminando}/>
            </TarjetaCarro>
          )
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  pantalla: {flex: 1, backgroundColor: Patiotuerca.fondo},
  tarjeta: {
    backgroundColor: Patiotuerca.superficie,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Patiotuerca.borde,
    //Franja roja superior como acento de marca
    borderTopWidth: 4,
    borderTopColor: Patiotuerca.rojo,
    padding: 16,
    //Sombra sutil (iOS usa shadow*, Android usa elevation)
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 2},
    elevation: 2
  },
  titulo: {fontSize: 20, fontWeight: 'bold', color: Patiotuerca.texto},
  subtitulo: {fontSize: 14, color: Patiotuerca.textoSecundario, marginTop: 2, marginBottom: 16},
  campo: {marginBottom: 14},
  labelFila: {flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6},
  labelIcono: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: Patiotuerca.rojoFondo,
    alignItems: 'center', justifyContent: 'center'
  },
  label: {fontSize: 14, fontWeight: '600', color: Patiotuerca.texto},
  seccion: {flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 24, marginBottom: 12},
  seccionBarra: {width: 4, height: 22, borderRadius: 2, backgroundColor: Patiotuerca.rojo},
  contador: {
    backgroundColor: Patiotuerca.rojo, color: '#FFFFFF',
    fontWeight: 'bold', fontSize: 13,
    paddingHorizontal: 10, paddingVertical: 2, borderRadius: 999, overflow: 'hidden'
  },
  input: {
    backgroundColor: Patiotuerca.superficie,
    borderWidth: 1,
    borderColor: Patiotuerca.borde,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: Patiotuerca.texto
  },
  inputActivo: {borderColor: Patiotuerca.rojo},
  error: {color: Patiotuerca.rojo, fontSize: 12, marginTop: 4},
  boton: {
    backgroundColor: Patiotuerca.rojo,
    borderRadius: 10,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 4
  },
  botonPresionado: {backgroundColor: Patiotuerca.rojoActivo},
  botonDeshabilitado: {backgroundColor: Patiotuerca.rojoFondo},
  botonTexto: {color: '#FFFFFF', fontWeight: 'bold', fontSize: 16},
  botonSecundario: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Patiotuerca.borde,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10
  },
  botonSecundarioTexto: {color: Patiotuerca.texto, fontWeight: 'bold', fontSize: 15},
  exito: {
    marginTop: 12,
    padding: 10,
    borderRadius: 8,
    backgroundColor: Patiotuerca.superficie,
    borderWidth: 1,
    borderColor: Patiotuerca.borde,
    color: Patiotuerca.texto
  },
  alerta: {
    marginTop: 12,
    padding: 10,
    borderRadius: 8,
    backgroundColor: Patiotuerca.rojoFondo,
    color: Patiotuerca.texto
  }
})
