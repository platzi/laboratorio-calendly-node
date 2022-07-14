# Calendly - NodeJS

En este proyecto debes incluir un nuevo endpoint que genere los espacios disponibles de un usuario según una configuración de disponibilidad, como en [Calendly](https://calendly.com/).

- [Instalación](#instalación)
- [Configuración](#configuración)
- [Funcionalidades](#funcionalidades)
- [Como enviar tu solución](#como-enviar-tu-solución)
- [Licencia](#licencia)
- [Credits](#credits)

## Instalación

1. Hacer fork de este proyecto en tu espacio personal
1. Clonar el repositorio desde tu espacio personal en tu computadora
1. Instalar dependencias, con el comando `npm install`
1. Iniciar mongo con Docker, con el comando `docker-compose up mongo -d`
1. Cargar datos iniciales, con el comando `npm run seed:init`
1. Comprobar ambiente de desarrollo, con el comando `npm run dev`
1. Probar endpoints con Postman o Insomnia.

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

![diagram](https://i.imgur.com/ah02Rah.png)

## Funcionalidades

La aplicacion ya cuenta con endpoints para gestionar **Schedules** y **Users**, tu trabajo es crear los endpoints que cumplan los siguientes requerimientos.

### 1. Generar los espacios disponibles dado un Schedule

Este endpoint debería retornar los espacios disponibles según un  **Schedule**.

[POST] /schedules/check

Por ejemplo, así se vería el **Schedule** de un usuario con espacios de 20 min **(duration)** con espacio entre reunión a reunión de  5 min **(margin)** con disponibilidad de la siguiente manera:

- Los lunes de 9 am a 10:15 am y de 8 pm a 9 pm
- Los viernes un espacio entre 1 pm a 2 pm

Quiere decir que si un usuario quiere seleccionar uno de esos espacios para el lunes, las disponibilidades deberían ser las siguientes:

- 09:00 AM - 09:15 AM
- 09:20 AM - 09:35 AM
- 09:40 AM - 09:55 AM
- 10:00 AM - 10:15 AM
- 20:00 PM - 20:15 PM
- 20:20 PM - 20:35 PM
- 20:40 PM - 20:55 PM

Y los viernes:

- 13:00 PM - 13:15 PM
- 13:20 PM - 13:35 PM
- 13:40 PM - 13:55 PM


El documento del **Schedule** anterior sería algo así:

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
},
```


#### Input

Este endpoint debe recibir los siguientes paramentros de entrada:

- date: string
- scheduleId: string
- timezone: string

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

´´´json
[
  {
    "startDate":"2022-07-18T14:00:00.000Z",
    "endDate":"2022-07-18T14:20:00.000Z",
    "status":"on"
  },
  {
    "startDate":"2022-07-18T14:25:00.000Z",
    "endDate":"2022-07-18T14:45:00.000Z",
    "status":"on"
  },
  {
    "startDate":"2022-07-18T14:50:00.000Z",
    "endDate":"2022-07-18T15:10:00.000Z",
    "status":"off"
  },
  {
    "startDate":"2022-07-18T15:15:00.000Z",
    "endDate":"2022-07-18T15:35:00.000Z",
    "status":"off"
  },
  {
    "startDate":"2022-07-18T15:40:00.000Z",
    "endDate":"2022-07-18T16:00:00.000Z",
    "status":"on"
  }
]
´´´

### 2. Validar espacios ya ocupados

En mismo endpoint de `[POST] /schedules/check` debería hacerse un consulta a los **Appointments** para ver si un espacio ya esta ocupado, en caso de estar ocupado debería retonar el status como `off`.

Ejemplo:

´´´json
[
  {
    "startDate":"2022-07-18T14:00:00.000Z",
    "endDate":"2022-07-18T14:20:00.000Z",
    "status":"on"
  },
  {
    "startDate":"2022-07-18T14:25:00.000Z",
    "endDate":"2022-07-18T14:45:00.000Z",
    "status":"on"
  },
  {
    "startDate":"2022-07-18T14:50:00.000Z",
    "endDate":"2022-07-18T15:10:00.000Z",
    "status":"off"
  },
  {
    "startDate":"2022-07-18T15:15:00.000Z",
    "endDate":"2022-07-18T15:35:00.000Z",
    "status":"off"
  },
  {
    "startDate":"2022-07-18T15:40:00.000Z",
    "endDate":"2022-07-18T16:00:00.000Z",
    "status":"on"
  }
]
´´´

### Recursos

Para interactuar con la API puedes descargar el archivo de Postman o Insomnia.

### Scripts

- El comando `npm run start` inicia el servidor de node en modo producción
- El comando `npm run dev` inicia un servidor con livereload
- El comando `npm run e2e` se corren pruebas e2e para verificiar el correcto funcionamiento de los endpoints.
- El comando `npm run seed:init` corre un carga de datos inicial.

## Como enviar tu solución

Debes de hacer un "Fork" de este proyecto, revolver los problemas y crear un Pull Request hacia este repositorio.

## Licencia

Este proyecto se lanza bajo la licencia [MIT](https://opensource.org/licenses/MIT).

## Credits

- [Freebie: Oasis](https://tympanus.net/codrops/2018/04/20/freebie-oasis-jekyll-website-template/)
