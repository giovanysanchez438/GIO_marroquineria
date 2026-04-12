# Guía de Despliegue: G·I·O Marroquinería en GitHub y Cloudflare Pages

Esta guía le mostrará paso a paso cómo desplegar su tienda en línea de G·I·O Marroquinería usando GitHub y Cloudflare Pages.

## Requisitos Previos

Antes de comenzar, asegúrese de tener:

- Una cuenta en [GitHub](https://github.com) (gratis)
- Una cuenta en [Cloudflare](https://www.cloudflare.com) (gratis)
- Un dominio propio (puede comprar uno en Cloudflare o usar uno existente)
- Git instalado en su computadora ([descargar](https://git-scm.com/downloads))
- Node.js instalado ([descargar](https://nodejs.org/))

## Paso 1: Preparar el Repositorio Local

### 1.1 Clonar o Descargar el Proyecto

Si aún no tiene el proyecto en su computadora:

```bash
# Opción A: Si tiene acceso al repositorio
git clone <url-del-repositorio>
cd gio-marroquineria

# Opción B: Si descargó el proyecto como ZIP
unzip gio-marroquineria.zip
cd gio-marroquineria
```

### 1.2 Instalar Dependencias

```bash
npm install
# o si usa pnpm
pnpm install
```

### 1.3 Verificar que Todo Funciona Localmente

```bash
npm run dev
# o si usa pnpm
pnpm dev
```

Debería ver un mensaje como: `Server running on http://localhost:3000/`

Abra su navegador en `http://localhost:3000` y verifique que el sitio se carga correctamente.

## Paso 2: Crear un Repositorio en GitHub

### 2.1 Crear Nuevo Repositorio

1. Vaya a [github.com/new](https://github.com/new)
2. Nombre del repositorio: `gio-marroquineria`
3. Descripción: "Tienda en línea de marroquinería G·I·O"
4. Seleccione **Public** (para que Cloudflare pueda acceder)
5. **NO** inicialice con README (ya tiene uno)
6. Haga clic en **Create repository**

### 2.2 Conectar Repositorio Local a GitHub

En su terminal, en la carpeta del proyecto:

```bash
# Inicializar git si no está inicializado
git init

# Agregar todos los archivos
git add .

# Hacer el primer commit
git commit -m "Inicial: G·I·O Marroquinería - Tienda en línea completa"

# Agregar el repositorio remoto (reemplace USERNAME con su usuario de GitHub)
git remote add origin https://github.com/USERNAME/gio-marroquineria.git

# Subir a GitHub
git branch -M main
git push -u origin main
```

**Nota:** Si le pide autenticación, use un [Personal Access Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) en lugar de su contraseña.

### 2.3 Verificar en GitHub

Vaya a `https://github.com/USERNAME/gio-marroquineria` y confirme que todos los archivos están allí.

## Paso 3: Configurar Cloudflare Pages

### 3.1 Conectar GitHub a Cloudflare

1. Vaya a [dash.cloudflare.com](https://dash.cloudflare.com)
2. En el menú lateral, haga clic en **Pages**
3. Haga clic en **Create a project**
4. Seleccione **Connect to Git**
5. Seleccione **GitHub** y autorize Cloudflare para acceder a su cuenta
6. Seleccione el repositorio `gio-marroquineria`
7. Haga clic en **Begin setup**

### 3.2 Configurar Build Settings

En la página de configuración:

| Campo | Valor |
|-------|-------|
| **Framework preset** | `None` (personalizado) |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |
| **Root directory** | `/` |

### 3.3 Configurar Variables de Entorno

Haga clic en **Environment variables** y agregue:

```
DATABASE_URL = <su-url-de-base-de-datos>
JWT_SECRET = <su-jwt-secret>
VITE_APP_ID = <su-app-id>
VITE_OAUTH_PORTAL_URL = <su-oauth-url>
```

**Nota:** Obtendrá estos valores del panel de administración de Manus.

### 3.4 Desplegar

Haga clic en **Save and Deploy**. Cloudflare comenzará a construir y desplegar su sitio.

Espere 2-5 minutos. Cuando termine, verá un enlace como: `https://gio-marroquineria.pages.dev`

## Paso 4: Conectar su Dominio Propio

### 4.1 Comprar Dominio (Opcional)

Si aún no tiene un dominio:

1. En Cloudflare, vaya a **Registrar**
2. Busque el dominio que desea (ej: `giomarroquineria.com`)
3. Agregue al carrito y complete la compra

### 4.2 Conectar Dominio a Cloudflare Pages

1. En Cloudflare Pages, abra su proyecto `gio-marroquineria`
2. Vaya a **Custom domains**
3. Haga clic en **Set up a custom domain**
4. Ingrese su dominio (ej: `giomarroquineria.com`)
5. Siga las instrucciones para verificar la propiedad del dominio

**Nota:** Si compró el dominio en Cloudflare, esto es automático.

### 4.3 Configurar SSL/TLS

1. En Cloudflare, vaya a **SSL/TLS**
2. Seleccione **Flexible** (recomendado para principiantes)
3. Esto encripta la conexión entre el usuario y Cloudflare

## Paso 5: Actualizar el Sitio

Cada vez que haga cambios en el código:

### 5.1 Desde su Computadora

```bash
# Hacer cambios en los archivos

# Agregar cambios a git
git add .

# Hacer commit
git commit -m "Descripción de los cambios"

# Subir a GitHub
git push origin main
```

### 5.2 Cloudflare Detectará los Cambios

Automáticamente, Cloudflare:
1. Detectará el nuevo push en GitHub
2. Ejecutará `npm run build`
3. Desplegará la nueva versión
4. Su sitio se actualizará en 2-5 minutos

## Paso 6: Configurar Dominio de Correo (Opcional)

Para que los correos de notificación de órdenes se vean profesionales:

1. En Cloudflare, vaya a **Email Routing**
2. Agregue una regla para recibir correos en su dominio
3. Configure el correo de destino donde desea recibir notificaciones

## Paso 7: Monitoreo y Mantenimiento

### Verificar Estado del Sitio

1. Vaya a su dominio (ej: `https://giomarroquineria.com`)
2. Verifique que todo carga correctamente
3. Pruebe el flujo de compra (carrito, checkout, WhatsApp)

### Ver Logs de Despliegue

1. En Cloudflare Pages, haga clic en su proyecto
2. Vaya a **Deployments**
3. Haga clic en el despliegue más reciente para ver los logs

### Actualizar Productos

Para agregar, editar o eliminar productos:

1. Inicie sesión en su sitio como administrador
2. Vaya a `/admin`
3. Use el panel de administración para gestionar productos
4. Los cambios se guardan en la base de datos automáticamente (no requieren nuevo despliegue)

## Solución de Problemas

### El sitio muestra error 404

**Causa:** Cloudflare no puede encontrar los archivos construidos.

**Solución:**
1. Verifique que el comando de construcción es correcto: `npm run build`
2. Verifique que el directorio de salida es: `dist`
3. Revise los logs de despliegue en Cloudflare

### El sitio carga pero se ve roto (sin estilos)

**Causa:** Los estilos CSS no se están cargando correctamente.

**Solución:**
1. Verifique que `VITE_*` variables de entorno están configuradas
2. Limpie el caché del navegador (Ctrl+Shift+Delete)
3. Intente en una ventana de incógnito

### Las órdenes no se envían a WhatsApp

**Causa:** El número de WhatsApp no está configurado correctamente.

**Solución:**
1. Verifique que el número en `Checkout.tsx` es: `573123344130`
2. Asegúrese de que el número tiene el formato: `57` + 10 dígitos
3. Pruebe manualmente: `https://wa.me/573123344130?text=Hola`

### La base de datos no se conecta

**Causa:** La variable `DATABASE_URL` no está configurada.

**Solución:**
1. En Cloudflare Pages, vaya a **Settings**
2. Haga clic en **Environment variables**
3. Agregue o actualice `DATABASE_URL` con la URL correcta
4. Redesplegue el sitio

## Checklist de Despliegue

Antes de considerar el sitio en producción, verifique:

- [ ] El repositorio está en GitHub
- [ ] Cloudflare Pages está conectado y desplegando
- [ ] El dominio personalizado está configurado
- [ ] SSL/TLS está habilitado
- [ ] Las variables de entorno están configuradas
- [ ] El sitio carga correctamente en el navegador
- [ ] El flujo de compra funciona (carrito → checkout → WhatsApp)
- [ ] Las notificaciones de órdenes se envían al dueño
- [ ] Los productos se muestran correctamente
- [ ] El panel de administración funciona

## Próximos Pasos

Una vez que el sitio esté en producción:

1. **Agregar más productos:** Use el panel de administración
2. **Integrar más métodos de pago:** Bold, Wompi, ePayco (ver `todo.md`)
3. **Configurar análisis:** Agregue Google Analytics en Cloudflare
4. **Optimizar SEO:** Agregue meta tags y sitemap
5. **Crear política de privacidad:** Agregue página legal

## Soporte

Si encuentra problemas:

1. Revise los logs en Cloudflare Pages
2. Verifique que todas las variables de entorno están configuradas
3. Intente reconstruir el proyecto localmente: `npm run build`
4. Consulte la documentación de [Cloudflare Pages](https://developers.cloudflare.com/pages/)

---

**Última actualización:** Abril 2026
**Versión del sitio:** 1.0.0
