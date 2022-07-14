# Calendly - NodeJS

En este proyecto debes incluir un nuevo endpoint que genere los espacios disponibles de un usuario según una configuración de disponibilidad, como en [Calendly](https://calendly.com/).

- [Instalación](#instalación)
- [Configuración](#configuración)
- [El reto](#el-reto)
- [Como enviar tu solución](#como-enviar-tu-solución)
- [Licencia](#licencia)

Vas a crear el Backend de una app de gestionar de calendarios como esta:

![App](https://i.imgur.com/xVHNwGc.png)

## Instalación

1. Hacer fork de este proyecto en tu espacio personal
1. Clonar el repositorio desde tu espacio personal en tu computadora
1. Instalar dependencias, con el comando `npm install`
1. Iniciar mongo con Docker, con el comando `docker-compose up mongo -d`
1. Cargar datos iniciales, con el comando `npm run seed:init`
1. Comprobar ambiente de desarrollo, con el comando `npm run dev`
1. Probar endpoints con Postman o Insomnia.

---

### Pruebas

1. Iniciar mongo con Docker, con el comando `docker-compose up mongo-e2e -d`
1. Cargar datos iniciales, con el comando `npm run e2e`

## Configuración

El proyecto ya viene con una configuración por defecto, de la siguiente manera:

```
.
├── README.md
├── dataset
├── docker-compose.yml
├── .e2e-example
├── makefile
├── node_modules
├── package-lock.json
├── package.json
├── scripts
└── src
  ├── app.js
  ├── index.js
  ├── config
  ├── database
  ├── dtos
  ├── middlewares
  ├── routes
  └── services
```

### Entidades

Debería existir tres entidades:

- User: Colección de usuarios
- Schedule: Colección de la disponibilidad de los usuarios
- Appointment: Colección las citas agendadas.

### Users

- \_id: mongoID
- name: string
- email: string
- password: string
- avatar: string

<details>
  <summary>Ver ejemplo de Doc</summary>
  
  ```json
  {
    "_id": "62cef7720cd70c04826278e5",
    "name":"Nicolas",
    "email":"nico@mail.com",
    "password":"changeme",
    "avatar":"https://api.lorem.space/image/face?w=480&h=480&r=9297"
  }
  ```
</details>

### Schedule

- \_id: mongoID
- title: string
- description: string
- duration: number
- margin: number
- timezone: string
- availability: []
- user: ref

<details>
  <summary>Ver ejemplo de Doc</summary>
  
  ```json
  {
    "_id": "62cd6b95f852bc242a318cba",
    "title": "Soporte",
    "description": "Un espacio para hablar sobre la experiencia con el sistema.",
    "duration": 15,
    "margin": 5,
    "timezone": "America/La_Paz",
    "availability": [
      {
        "day": "monday",
        "intervals": [
          {
            "startTime": "09:00",
            "endTime": "10:15",
          },
          {
            "startTime": "20:00",
            "endTime": "21:00",
          }
        ],
      },
      {
        "day": "friday",
        "intervals": [
          {
            "startTime": "13:00",
            "endTime": "14:00",
          },
        ],
      }
    ],
    "user": "62cd65afd0953f4adef923b3"
  }
  ```
</details>

### Appointment

- \_id: mongoID
- note: string
- email: string
- startDate: Date
- endDate: Dte
- user: ref

## El reto

La aplicación ya cuenta con endpoints para gestionar **Schedules**, **Users** y **Appointments**, tu reto es crear el endpoint `[POST] /availability` que debería retornar los espacios disponibles según un  **Schedule**, debe cumplir los siguientes requisitos:

### 1. Generar los espacios disponibles dado un Schedule

Por ejemplo, así se vería el **Schedule** de un usuario con espacios de 15 min **(duration)** y con espacio entre reunión a reunión de  5 min **(margin)** con disponibilidad de la siguiente manera:

- Los lunes de 9 am hasta 10:15 am y de 8 pm hasta 9 pm
- Los viernes un espacio entre 1 pm hasta 2 pm

Quiere decir que si un usuario solicita ver espacios disponibles para el día lunes, las disponibilidades deberían ser las siguientes:

- 09:00 AM - 09:15 AM
- 09:20 AM - 09:35 AM
- 09:40 AM - 09:55 AM
- 10:00 AM - 10:15 AM
- 20:00 PM - 20:15 PM
- 20:20 PM - 20:35 PM
- 20:40 PM - 20:55 PM

Y para el viernes:

- 13:00 PM - 13:15 PM
- 13:20 PM - 13:35 PM
- 13:40 PM - 13:55 PM

El documento del **Schedule** anterior sería así:

```json
{
  "_id": "62cd6b95f852bc242a318cba",
  "title": "Soporte",
  "description": "Un espacio para hablar sobre la experiencia con el sistema.",
  "duration": 15,
  "margin": 5,
  "timezone": "America/La_Paz",
  "availability": [
    {
      "day": "monday",
      "intervals": [
        {
          "startTime": "09:00",
          "endTime": "10:15"
        },
        {
          "startTime": "20:00",
          "endTime": "21:00"
        }
      ]
    },
    {
      "day": "friday",
      "intervals": [
        {
          "startTime": "13:00",
          "endTime": "14:00"
        }
      ]
    }
  ],
  "user": "62cd65afd0953f4adef923b3"
}
```

#### Input

Este endpoint debe recibir los siguientes paramentros de entrada:

- date: string => La fecha para la cual se quiere revisar disponibilidad, el formato de la fecha debería ser `yyyy-MM-dd`
- scheduleId: string => El id del **Schedule**
- timezone: string => El timezone del usuario

Ejemplo:

```json
{
  "date": "2022-07-18",
  "scheduleId": "62cd6b95f852bc242a318cbb",
  "timezone": "America/La_Paz"
}
```

#### Output

Este endpoint debería retornar un array de objetos con los siguientes atributos:

- startDate: Date
- endDate: Date
- status: "on" | "off"

Ejemplo:

```json
[
  {
    "startDate": "2022-07-18T14:00:00.000Z",
    "endDate": "2022-07-18T14:20:00.000Z",
    "status": "on"
  },
  {
    "startDate": "2022-07-18T14:25:00.000Z",
    "endDate": "2022-07-18T14:45:00.000Z",
    "status": "on"
  },
  {
    "startDate": "2022-07-18T14:50:00.000Z",
    "endDate": "2022-07-18T15:10:00.000Z",
    "status": "off"
  },
  {
    "startDate": "2022-07-18T15:15:00.000Z",
    "endDate": "2022-07-18T15:35:00.000Z",
    "status": "off"
  },
  {
    "startDate": "2022-07-18T15:40:00.000Z",
    "endDate": "2022-07-18T16:00:00.000Z",
    "status": "on"
  }
]
```

### 2. Validación de datos

- Debería retornar 400 (Bad Request) si se envía un body vacio
- Debería retornar 400 (Bad Request) si se envía una fecha inválida
- Debería retornar 400 (Bad Request) si se envía un timezone inválida
- Debería retornar 400 (Bad Request) si se envía un scheduleId que no cumple con el formato de un ID de mongo
- Debería retornar 404 (Not Found) si se envía un scheduleId válido, pero no existe el **Schedule**

### 3. Soporte de Timezones

Llego la hora de ser una empresa global y soportar [Timezones](https://www.monkeyuser.com/assets/images/2018/85-going-global.png), TODO: endpoint list

El sistema debe soportar que cada **Schedule** tenga un timezone configurado y que si el usuario hace la solicitud desde otro timezone el sistema debería "traducir" los espacios a la timezone del usuario, por ejemplo:

Para un **Schedule** con disponibilidad lunes de 9 am hasta 10:15 am, con **duration** de 15min, **margin** de 5min y **timezone** `America/La_Paz`, se debería responder la siguiente disponibilidad:

- 09:00 AM - 09:15 AM
- 09:20 AM - 09:35 AM
- 09:40 AM - 09:55 AM
- 10:00 AM - 10:15 AM

Pero si el usuario desde donde se envio el request tiene un timezone diferente por ejemplo `America/Bogota`, se debería responder la siguiente disponibilidad:

- 08:00 AM - 08:15 AM
- 08:20 AM - 08:35 AM
- 08:40 AM - 08:55 AM
- 09:00 AM - 09:15 AM

Recuerda que en body del endpoint te envían el timezone del usuario:

```json
{
  "date": "2022-07-18",
  "scheduleId": "62cd6b95f852bc242a318cbb",
  "timezone": "America/Bogota" 👈
}
```

### 4. Validar espacios ya ocupados

En endpoint debería mostrar el `off` los espacios que no estan disponibles, por ende debería hacerse un consulta de los **Appointments** para ver si un espacio ya esta ocupado, en caso de estar ocupado debería retonar el status como `off`.

Ejemplo:

```json
[
  {
    "startDate": "2022-07-18T14:00:00.000Z",
    "endDate": "2022-07-18T14:20:00.000Z",
    "status": "on"
  },
  {
    "startDate": "2022-07-18T14:25:00.000Z",
    "endDate": "2022-07-18T14:45:00.000Z",
    "status": "on"
  },
  {
    "startDate": "2022-07-18T14:50:00.000Z",
    "endDate": "2022-07-18T15:10:00.000Z",
    "status": "off"
  },
  {
    "startDate": "2022-07-18T15:15:00.000Z",
    "endDate": "2022-07-18T15:35:00.000Z",
    "status": "off"
  },
  {
    "startDate": "2022-07-18T15:40:00.000Z",
    "endDate": "2022-07-18T16:00:00.000Z",
    "status": "on"
  }
]
```

### Recursos

Para interactuar con la API puedes descargar el archivo de Postman o Insomnia.

![Insomnia](https://i.imgur.com/a6tjnhK.png)

### Scripts

- El comando `npm run start` inicia el servidor de node en modo producción
- El comando `npm run dev` inicia un servidor con livereload
- El comando `npm run e2e` se corren pruebas e2e para verificiar el correcto funcionamiento de los endpoints
- El comando `npm run seed:init` corre un carga de datos inicial


## Como enviar tu solución

Debes de hacer un "Fork" de este proyecto, revolver los problemas y crear un Pull Request hacia este repositorio.

## Licencia

Este proyecto se lanza bajo la licencia [MIT](https://opensource.org/licenses/MIT).

