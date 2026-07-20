# 💿 Deezer Manager - Cliente Frontend

Este repositorio contiene la aplicación del lado del cliente (**Frontend**) para **Deezer Manager**. Es una aplicación web moderna que permite a los usuarios buscar artistas mediante la **API de Deezer**, explorar discografías, escuchar fragmentos de canciones y calificar sus álbumes favoritos.

La aplicación cuenta con soporte **Offline-First**, permitiendo al usuario navegar, escuchar canciones cacheadas y calificar álbumes sin conexión a internet. Los cambios se guardan localmente y se sincronizan automáticamente con el servidor cuando la conexión se restablece.

---

## 🌟 Características Principales

### 1. Autenticación y Persistencia

- Pantalla de inicio de sesión integrada con usuarios preconfigurados.
- Almacenamiento local seguro del token de sesión (`token_seguridad`) y correo (`correo_activo`) en `localStorage`.
- Redirección automática desde el `<head>` si ya existe una sesión activa para evitar parpadeos visuales.

### 2. Integración con la API de Deezer (JSONP)

- Búsqueda de artistas en tiempo real y despliegue de perfiles con estadísticas y discografías completas.
- Uso de peticiones **JSONP** dinámicas (creando elementos `<script>` en el DOM) para evitar problemas de CORS con la API externa de Deezer.

### 3. Modo Offline-First & Service Worker

- Registro de un **Service Worker** (`sw.js`) que almacena en caché los recursos estáticos esenciales.
- Estrategia **Network-First con Fallback a Caché** para garantizar acceso a la última versión si hay red, o servir la versión cacheada local en caso de desconexión.
- Indicador visual dinámico del estado de conexión (cambia de `En línea` a `Modo Offline` en rojo) que valida la conexión mediante peticiones rápidas de latido.

### 4. Sincronización Automática en Segundo Plano

- Los cambios realizados sin conexión (como calificaciones de estrellas) se guardan localmente marcados con `sincronizado = false`.
- En cuanto el navegador detecta el evento `online` (retorno de internet), inicia un proceso de sincronización en segundo plano con el servidor para actualizar los registros remotos.

### 5. Reproductor de Audio Global e Inteligente

- Barra flotante de reproducción multimedia inyectada de manera dinámica en el DOM.
- **Rehidratación de estado**: Utiliza `sessionStorage` para registrar la pista y el segundo exacto de reproducción. Al actualizar la página o cambiar de vista, la reproducción continúa sin interrupciones.

### 6. Personalización de Temas

- Alternancia de tema **Modo Claro** / **Modo Oscuro** con persistencia en `localStorage.tema`.

---

## 📁 Estructura del Repositorio

```
Proyecto_web_2/
├── css/
│   ├── style.css             # Estilos globales y variables de temas
│   └── style_caja_de_artista.css # Estilos para las tarjetas de artistas y álbumes
├── html/
│   ├── buscador.html         # Vista principal de búsqueda e integración de Deezer
│   └── favoritos.html        # Vista de álbumes favoritos y gestión de calificaciones
├── js/
│   ├── api.js                # Lógica de consulta a Deezer (JSONP) y renderizado
│   ├── botones_laterales.js    # Barra lateral y validación de red
│   ├── datos_locales.js      # Lectura y escritura en LocalStorage
│   ├── gestor_sesion.js      # Control de sesión activa
│   ├── inicio_sesion.js      # Lógica de login
│   ├── player.js             # Reproductor de audio flotante y rehidratación
│   ├── servicio_favoritos.js    # Visualización e interacción en la vista favoritos
│   ├── sidebar.js            # Comportamiento del menú y cambio de temas
│   └── sincronizador.js      # Sincronización local-servidor en segundo plano
├── offline/
│   └── offline.html          # Fallback offline si la página no está en caché
├── index.html                # Punto de entrada (Login)
└── sw.js                     # Service Worker
```

---

## 🚀 Ejecución y Despliegue

### 1. Ejecutar en Local (Desarrollo)

Debido a que el Service Worker y el almacenamiento local requieren contextos seguros, se recomienda utilizar la extensión **Live Server** de VS Code:

1. Abra este repositorio (`Proyecto_web_2`) en VS Code.
2. Asegúrese de tener instalada la extensión **Live Server**.
3. Haga clic en **Go Live** en la esquina inferior derecha.

### 2. Despliegue en GitHub Pages

La aplicación se encuentra desplegada públicamente mediante GitHub Pages en el siguiente enlace:
👉 **[https://djgarcia-24.github.io/Proyecto_web_2/
](https://djgarcia-24.github.io/Proyecto_web_2/)**

---

## 🚀 Servidor en Producción (Render)

El backend está desplegado de forma activa en la plataforma **Render**:
👉 **[https://servidor-proyecto-web-2.onrender.com](https://servidor-proyecto-web-2.onrender.com)**

El código fuente de este servidor backend se encuentra en su respectivo repositorio independiente:
👉 **[Repositorio GitHub - Servidor Backend](https://github.com/djgarcia-24/Servidor-Proyecto-Web-2-)**

---

## 🔑 Usuarios y Credenciales de Prueba

El servidor cuenta con tres cuentas de prueba preconfiguradas cuyos datos de favoritos y calificaciones se guardan en memoria de manera independiente.

| Correo Electrónico    | Contraseña | Token de Sesión (Bearer) |
| :-------------------- | :--------- | :----------------------- |
| `admin@correo.com`    | `123`      | `111`                    |
| `david@correo.com`    | `456`      | `222`                    |
| `invitado@correo.com` | `789`      | `333`                    |

---

## 🔗 Configuración de Conexión Local

Por defecto, la constante `URL_SERVIDOR` en [inicio_sesion.js](js/inicio_sesion.js) apunta al servidor en producción en Render.

Si desea levantar el servidor en su máquina local para pruebas de desarrollo, modifique dicha variable en [inicio_sesion.js](js/inicio_sesion.js) a:

```javascript
const URL_SERVIDOR = "http://localhost:3000";
```
