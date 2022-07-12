# Calendly - NodeJS

En este proyecto debes incluir un nuevo endpoint que genere los espacios disponibles de un usuario según una configuración de disponibilidad, como en [Calendly](https://calendly.com/).

- [Instalación](#instalación)
- [Configuración](#configuración)
- [El Reto](#el-reto)
- [Como enviar tu solución](#como-enviar-tu-solución)
- [Licencia](#licencia)
- [Credits](#credits)

## Instalación

1. Hacer fork de este proyecto en tu espacio personal
1. Clonar el repositorio desde tu espacio personal en tu computadora
1. Instalar dependencias, con el comando `npm install`
1. Iniciar la db con Mongo `docker-compose up mongo -d`
1. Comprobar ambiente de desarrollo, con el comando `npm run dev`

## Configuración

El proyecto ya viene con una configuración por defecto, de la siguiente manera:

```
.
├── README.md
├── dataset
├── docker-compose.yml
├── makefile
├── package-lock.json
├── package.json
└── src
  ├── config
  ├── dtos
  ├── entities
  ├── index.js
  ├── libs
  ├── middlewares
  ├── routes
  └── services
```

### Entidades

Debería existir tres entidades:

- User: Información del usuario
- Schedule: Informacion de la disponibilidad
- Appointment: Guardar las citas agendadas.

![diagram](https://i.imgur.com/ah02Rah.png)

## Funcionalidades

La aplicacion ya cuenta con endpoints para gestinar Schedules y Usuarios, debes crear endpoints que cumplan los siguientes requerimientos.

### 1. Generar los espacios disponibles dado un Schedule

[post] /schedules/check

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

Este endpoint debería retornar un array de objetos con los siguientes attributos:

- startDate: Date
- endDate: Date
- status: string

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

Entonces, así se vería el **Schedule** de un usuario con espacios de 20 min **(duration)** con espacio entre reunión a reunión de  5 min **(margin)** con disponibilidad de la siguiente manera:

- Los lunes de 10 am a 12 pm y de 8 pm a 10 pm
- Los viernes un espacio entre 1 pm a 2 pm

```json
{
  "_id": "62cd6b95f852bc242a318cba",
  "title": "Soporte",
  "description": "Un espacio para hablar sobre la experiencia con el sistema.",
  "duration": 20,
  "margin": 5,
  "timezone": "America/La_Paz",
  "availability": [
    {
      "day": "monday",
      "intervals": [
        {
          "startTime": "10:00",
          "endTime": "12:00",
          "_id": "62cd6b95f852bc242a318cbc"
        },
        {
          "startTime": "20:00",
          "endTime": "22:00",
          "_id": "62cdbc245f852bc242a318cbc"
        }
      ],
      "_id": "62cd6b95f852bc242a318cbb"
    },
    {
      "day": "friday",
      "intervals": [
        {
          "startTime": "13:00",
          "endTime": "14:00",
          "_id": "62cd6b952a352bc242a318cbc"
        },
      ],
      "_id": "62cd6b95f852bc242a318cbb"
    }
  ],
  "user": "62cd65afd0953f4adef923b3"
},
```

Quiere decir que si un usuario quiere seleccionar uno de esos espacios para el lunes, las disponibilidades deberían ser así:

- 10:00 AM - 10:20 AM
- 10:25 AM - 10:45 AM
- 10:50 AM - 11:10 AM
- 11:15 AM - 11:35 AM
- 11:40 AM - 12:00 PM
- 20:00 PM - 20:20 PM
- 20:25 PM - 20:45 PM
- 20:50 PM - 21:10 PM
- 21:15 PM - 21:35 PM
- 21:40 PM - 22:00 PM

Y los viernes :

- 13:00 PM - 13:20 PM
- 13:25 PM - 13:45 PM

### 2. Validar espacios ya ocupados

Debes guardar los espacios ya reservados en una entidad llamada **Appointments**

### Recursos

Para interactuar con la API puedes descargar el archivo de Insomia o Postman.

### Scripts

- El comando `npm run start` inicia el servidor de node en modo producción
- El comando `npm run dev` inicia un servidor con livereload
- El comando `npm run e2e` se corren pruebas e2e para verificiar el correcto funcionamiento de los endpoints.

### Cargar datos iniciales

Puedes llenar la DB de datos iniciales con usuarios y schedules manualmente pero hay una funcionalidad que carga conjunto de datos iniciarles corriendo el comando de `make import`.

Para que este comando funcione es necesario tener docker instalado y la funcionalidad make

```
sudo apt update
sudo apt install make
```

## El reto

En este momento tenemos que el sitio tiene un bajo puntaje según el reporte de Lighthouse lo cual hace que los usuarios se vayan del sitio, es decir hay un porcentaje de rebote muy alto, ya que el sitio se demora en cargar y no tiene buenas prácticas en SEO para que aparezca en motores de búsqueda, lo cual está afectando el negocio y el dinero invertido en campañas para atraer usuarios.

El objetivo es implementar los cambios necesario para que el puntaje de Lighthouse cumpla con los siguientes puntajes minimos:

- Performance: Mínimo 75% o más.
- Accessibility: Mínimo 80% o más.
- Best Practices: Mínimo 90% o más.
- SEO: Mínimo 90% o más.

Por ende en el repositorio se ha incluido el comando `npm run lhci` que dada la configuración en el archivo `lighthouserc.js` comprueba los puntajes.

Cuando corras el comando `npm run lhci` por primera vez se verá así:

![failed](https://i.imgur.com/VE4xYG3.png)

Además puedes ver un link al final para ver el reporte en modo HTML:

![report](https://i.imgur.com/hHfGWE6.png)

Se espera se hagan los ajustes necesarios para que el reporte de Lighthouse cumpla con los puntajes esperados.

> Si usas WSL2 o Linux puede que tengas que especificar en el path en donde está instalado Chrome en el archivo `lighthouserc.js` puedes configurar esa ubicación.

```js
module.exports = {
  ci: {
    collect: {
      startServerCommand: "npm run start",
      url: ["http://localhost:8080"],
      numberOfRuns: 3,
      // chromePath: "/bin/google-chrome", 👈
    },
    ...
  },
};

```

## Como enviar tu solución

Debes de hacer un "Fork" de este proyecto, revolver los problemas y crear un Pull Request hacia este repositorio.

## Licencia

Este proyecto se lanza bajo la licencia [MIT](https://opensource.org/licenses/MIT).

## Credits

- [Freebie: Oasis](https://tympanus.net/codrops/2018/04/20/freebie-oasis-jekyll-website-template/)
