# G·I·O Marroquinería - TODO

## Base de Datos y Backend
- [x] Esquema de productos (products table)
- [x] Esquema de órdenes (orders table)
- [x] Esquema de items de orden (order_items table)
- [x] Migración SQL ejecutada
- [x] Seed de 8 productos iniciales
- [x] tRPC: listar productos con filtros por categoría
- [x] tRPC: obtener producto por ID
- [x] tRPC: crear/editar/eliminar producto (admin)
- [x] tRPC: crear orden
- [x] tRPC: obtener órdenes (admin)
- [x] Notificación automática al dueño en nueva compra
- [x] Endpoint de upload de imágenes

## Frontend - Diseño y Navegación
- [x] Paleta de colores: crema, azul marino, dorado (index.css)
- [x] Tipografía: serif elegante para títulos, sans-serif para cuerpo
- [x] Navbar con logo G·I·O Marroquinería, menú categorías, ícono carrito
- [x] Footer con información de contacto y redes sociales
- [ ] Verificar diseño responsive en todas las páginas

## Frontend - Páginas
- [x] Página principal (Home): hero banner, categorías, productos destacados
- [x] Catálogo de productos con filtros por categoría
- [x] Página de detalle de producto con galería
- [x] Carrito de compras con resumen y totales
- [x] Checkout con formulario de datos del comprador
- [x] Página de confirmación de orden
- [x] Panel de administración (gestión de productos)

## Integración de Pagos
- [x] Botón de WhatsApp con número +573123344130
- [x] Flujo de checkout con resumen para enviar por WhatsApp
- [x] Notificación automática al dueño de nueva orden
- [x] Tests de integración WhatsApp (7 tests)
- [ ] Integrar Bold (links de pago con tarjeta) - Etapa 2
- [ ] Integrar Wompi o ePayco - Etapa 3
- [ ] Integrar Stripe para pagos internacionales - Etapa 4

## Documentación
- [x] Guía de despliegue en GitHub y Cloudflare Pages (DEPLOYMENT_GUIDE.md)

## Tests
- [x] Tests de procedimientos tRPC de productos (17 tests)
- [x] Tests de creación de órdenes
- [x] Tests de roles admin (bloqueo a no-admin)
- [x] Tests de integración WhatsApp (7 tests)
- [x] Tests de autenticación (logout)

## Galería de Múltiples Fotos (EN PROGRESO)
- [ ] Actualizar componente ProductDetail con galería interactiva
- [ ] Agregar controles de navegación (anterior/siguiente)
- [ ] Agregar miniaturas de fotos
- [ ] Implementar zoom en fotos
- [ ] Actualizar panel admin para subir múltiples fotos
- [ ] Tests para galería de fotos
