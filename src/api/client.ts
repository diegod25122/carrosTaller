import axios from "axios"


//Creamos un cliente de axios configurado con:
//baseURL: La URL de la API, tomada de variables de entorno de Expo
//Headers: Indicar que el contenido es JSON

export const client = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    headers: {"Content-Type":"application/json",
        Accept: "application/json"
    }
})
