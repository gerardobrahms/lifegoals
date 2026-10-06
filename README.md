# LifeGoals

Aplicacion web en **Angular 18** y **Firestore** para administrar metas personales.
Permite leer, agregar y eliminar documentos de la coleccion `metas`.

La imagen de Docker se construye sola con un Workflow de GitHub Actions, se publica
en Docker Hub y desde ahi se despliega en Render.

## Requisitos

- Node.js 20.x
- Angular CLI 18.x (`npm install -g @angular/cli@18`)
- Un proyecto de Firebase con Firestore habilitado

## 1. Configurar Firestore

En la consola de Firebase, dentro de Firestore, crea la coleccion `metas` con un
unico campo de texto llamado `meta`.

Despues copia las keys del proyecto desde **Configuracion del proyecto, Tus apps,
App web** y pegalas en los dos archivos de ambiente.

- `src/environments/environment.ts` (produccion)
- `src/environments/environment.development.ts` (desarrollo)

```ts
export const environment = {
  production: true,
  firebase: {
    apiKey: '...',
    authDomain: '...',
    projectId: '...',
    storageBucket: '...',
    messagingSenderId: '...',
    appId: '...'
  }
};
```

Estas keys no son secretas, son identificadores publicos del proyecto. Lo que
realmente protege la base son las reglas de seguridad de Firestore.

Para que el ejercicio funcione sin autenticacion, las reglas tienen que permitir
lectura y escritura en `metas`.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /metas/{documento} {
      allow read, write: if true;
    }
  }
}
```

## 2. Correr en local

```bash
npm install
npm start
```

La aplicacion queda en `http://localhost:4200`.

## 3. Pruebas unitarias

```bash
npm test -- --watch=false --browsers=ChromeHeadless
```

Cubren el servicio de Firestore, el mapeo del id del documento y las operaciones
de alta, baja y lectura del componente `home`.

## 4. Compilar para produccion

```bash
npm run build
```

La salida queda en `dist/lifegoals/browser`.

## 5. Imagen de Docker

El `Dockerfile` usa dos etapas. La primera compila con `node:20-alpine` y la
segunda copia solo los archivos estaticos a `nginx:1.27-alpine`, asi que la imagen
final no incluye Node ni `node_modules`.

```bash
docker build -t lifegoals .
docker run --rm -p 8080:8080 lifegoals
```

nginx escucha en el puerto que llegue en la variable `PORT`, que es como Render
asigna el puerto en tiempo de ejecucion.

## 6. Workflow de GitHub Actions

`.github/workflows/docker-image.yml` construye y publica la imagen en cada push a
`master`. Antes de que funcione hay que cargar dos secrets en el repositorio,
desde **Settings, Secrets and variables, Actions**.

| Secret | Valor |
| --- | --- |
| `DOCKERHUB_USERNAME` | usuario de Docker Hub |
| `DOCKERHUB_TOKEN` | Access Token creado en Docker Hub, en Account Settings, Personal access tokens |

La imagen se publica como `USUARIO/lifegoals:latest` y tambien con el hash del
commit, para poder volver a una version anterior sin reconstruir.

## 7. Despliegue en Render

1. En Render, **New, Web Service** y despues **Existing image**.
2. Imagen, `USUARIO/lifegoals:latest`.
3. Instance type, Free.
4. Crear el servicio. Render expone el puerto por la variable `PORT` y el
   contenedor ya la respeta.

Cada vez que el Workflow publique una imagen nueva basta con usar **Manual Deploy,
Deploy latest reference** en Render, o activar el deploy automatico por webhook.

## Estructura

```
src/app
  app.module.ts                  modulo raiz, importa FormsModule y AngularFire
  app-routing.module.ts          rutas home y about
  app.component.*                menu de navegacion y router-outlet
  models/meta.model.ts           clase Meta
  services/meta-service.service.ts  lectura, alta y baja sobre la coleccion metas
  home/                          listado, alta y baja de metas
  about/                         datos de contacto
```
