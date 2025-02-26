
# Prueba Técnica - Angular

Este es un proyecto en Angular desarrollado para una prueba técnica. A continuación, se detallan los pasos para la instalación y ejecución del proyecto.

## Instalación

Para instalar las dependencias del proyecto, ejecuta el siguiente comando en la terminal:

```sh
npm i
```

## Ejecución

Para iniciar el proyecto en modo de desarrollo, utiliza el siguiente comando:

```sh
npm start
```

## Configuración del Backend

Las URLs del backend están definidas en los archivos de entorno (`environment.ts` y `environment.prod.ts`). Dentro de estos archivos, encontrarás la propiedad `api` con la URL correspondiente al backend.

Además, hay una propiedad llamada `delay` que se utiliza para simular un pequeño retraso en las peticiones HTTP, haciendo la prueba más realista.

### Archivo `environment.ts` de ejemplo:

```typescript
export const environment = {
  production: false,
  api: 'https://localhost:7070/api/v1/',
  delay: 3000,
};
```

### Modulo de usuarios
Muestra solo los usuarios registrados en el sistema
![Modulo de usuarios](/public/readme/Modulousuarios.png){width=200}

### Modulo de datos

Muestra la opción de poder obtener los datos de la pagina de la CENACE, como tambíen la tabla con filtros para los datos, así como un buscador
![Modulo de datos](/public/readme/Modulodedatos.png){width=200}