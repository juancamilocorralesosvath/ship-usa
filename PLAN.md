# Plan: web de encargos desde EE. UU. (v1 de nicho)

## Context
Después de investigar el modelo grande (compra por encargo con DIAN, ventanas, márgenes), Juan Camilo lo simplifica: una web para **conocidos**, donde le encargan productos que él o su papá traen **cuando viajan** a EE. UU. (fechas de viaje de cada uno, a veces coinciden). Se deja de lado lo regulatorio por ahora (decisión del usuario; nota: el equipaje de viajero tiene sus propias reglas en la DIAN, revisar antes de crecer).

Resultado esperado de la v1:
- Catálogo de **tecnología** (en tendencia, API Best Buy) y **ropa** (catálogos públicos de tiendas Shopify + carga manual).
- Pedido sin cuenta (nombre, WhatsApp, ciudad), sin pago en línea: los pedidos llegan a un panel y por email; se cotiza y cobra por fuera (Nequi/transferencia).
- Flujo **"No encuentro lo que busco"**: formulario con nombre del producto, marca, referencia, variante, link opcional, descripción y fotos. Diseñado para que en v2/v3 un chatbot cree el mismo registro.
- Viajes visibles: próximo viaje y fecha límite para encargar.

Decisiones del usuario: Best Buy para tecnología; ropa por API (no necesita ser tendencia); sin cuentas de cliente; cotizar y cobrar por fuera; Next.js + Supabase.

El repositorio está vacío (solo `_bmad/` y `_bmad-output/`): es un proyecto nuevo, no hay código a reutilizar.

## Stack
- Next.js (App Router, TypeScript, Tailwind), desplegado en Vercel.
- Supabase: Postgres (con RLS), Storage (fotos de encargos), Auth solo para el panel admin (magic link a una lista blanca de emails: Juan Camilo y su papá).
- Resend para el email de "nuevo pedido". WhatsApp sin API en v1: el panel abre `wa.me/<numero>?text=...` para contactar al cliente.
- Vercel Cron (diario) para sincronizar el catálogo.

## Fuentes de catálogo
Patrón: un proveedor por fuente que devuelve productos normalizados; el cron los guarda en `products`. El sitio solo lee de la base (nunca llama a las APIs en vivo).

- `lib/catalog/types.ts`: `CatalogProvider { id; fetchProducts(): Promise<NormalizedProduct[]> }`, `NormalizedProduct { source, externalId, category, title, brand, imageUrl, priceUsd, productUrl, isTrending }`.
- `lib/catalog/providers/bestbuy.ts`: endpoints de recomendaciones de Best Buy (trending / most viewed) por categorías de tecnología, con `BESTBUY_API_KEY`. Confirmar en developer.bestbuy.com el formato de autenticación y que el uso no comercial/personal está permitido (una fuente dice que el uso comercial requiere acuerdo de partner).
- `lib/catalog/providers/shopify.ts`: lee `https://<tienda>/products.json?limit=250` (público, sin clave) de una lista de tiendas de ropa de EE. UU. guardada en `catalog_sources`. No todas las tiendas lo exponen: cada tienda se prueba antes de activarla. Mapea título, `vendor`, primera imagen, precio de la primera variante y `handle` → URL.
- Productos manuales: creados desde el panel (`source = 'manual'`), para ropa de outlet o cosas puntuales.
- Más adelante (fuera de v1): catálogos de afiliados (Impact, Rakuten) si se aprueba una cuenta.

## Modelo de datos (`supabase/migrations/0001_init.sql`)
- `products`: id, source, external_id (único por source), category (`ropa` | `tecnologia`), title, brand, image_url, price_usd, product_url, is_trending, active, synced_at.
- `catalog_sources`: id, kind (`shopify`), domain, brand_name, enabled, last_sync_status.
- `trips`: id, traveler (`papa` | `juan_camilo`), departs_on, returns_on, order_cutoff, notes, published.
- `orders`: id, code (corto, legible), status (`nuevo` → `cotizado` → `confirmado` → `comprado` → `en_camino` → `entregado` | `cancelado`), customer_name, whatsapp, city, notes, trip_id (opcional), quoted_total_cop, created_at.
- `order_items`: id, order_id, product_id (opcional), quantity, variant (talla/color), notes.
- `custom_requests`: id, order_id, product_name, brand, reference, variant, link, description, quantity, budget_cop (opcional), photo_paths[], channel (`form` | `chat`, para el chatbot futuro).

RLS: anónimo puede leer `products` activos y `trips` publicados, e insertar en `orders`/`order_items`/`custom_requests` (vía server actions); nada público puede leer pedidos. Bucket `request-photos` privado; subida con URL firmada creada en el servidor. Panel usa sesión de admin.

## Páginas
Públicas (español, mobile-first, porque llegarán desde WhatsApp):
- `/` — próximo viaje y fecha límite, accesos a Ropa y Tecnología, botón "No encuentro lo que busco".
- `/catalogo?categoria=...&q=...` — grilla con búsqueda y filtro.
- `/producto/[id]` — detalle, "Precio en EE. UU.: USD X · el precio final te lo cotizamos", variante, cantidad, "Agregar al encargo".
- `/encargo` — carrito (localStorage) + datos de contacto + viaje (opcional) → crea el pedido.
- `/encargo-personalizado` — formulario del producto que no está (hasta 3 fotos) + contacto.
- `/encargo/[code]/gracias` — confirmación con el código del pedido.

Panel (`/admin`, protegido):
- Pedidos: lista, detalle, cambiar estado, poner total cotizado, botón WhatsApp al cliente, ver fotos.
- Viajes: crear/editar/publicar.
- Productos: alta manual, activar/desactivar; fuentes Shopify: agregar dominio, probar, activar; botón "sincronizar ahora".

## Archivos clave a crear
- `app/(public)/...` y `app/admin/...` (páginas arriba).
- `app/actions/orders.ts` (crear pedido y encargo personalizado, validación con zod, honeypot anti-spam, email con Resend).
- `app/api/cron/sync-catalog/route.ts` (protegido con `CRON_SECRET`), `vercel.json` con el cron diario.
- `lib/supabase/{server,client,admin}.ts`, `lib/catalog/*`, `lib/notify/email.ts`.
- `supabase/migrations/0001_init.sql`, `supabase/seed.sql` (viaje y productos de ejemplo).
- `.env.example` (Supabase, BESTBUY_API_KEY, RESEND_API_KEY, ADMIN_EMAILS, CRON_SECRET, NOTIFY_EMAILS).

## Lo que debe hacer el usuario (no puedo crear cuentas)
Crear proyecto en Supabase, llave de Best Buy, cuenta de Resend y proyecto en Vercel, y pegar las llaves en `.env.local`.

## Fuera de v1
Pagos en línea, cuentas de clientes, chatbot (la tabla `custom_requests.channel` ya lo prevé), seguimiento público del pedido, temas regulatorios, más categorías.

## Verificación
1. `npm run lint`, `npm run typecheck`, `npm run build` sin errores.
2. Supabase local (`supabase start`) con migración y seed; `npm run dev`.
3. Llamar al cron local con el secreto: aparecen productos de Best Buy y de una tienda Shopify de prueba; sin llaves, el seed muestra el catálogo igual.
4. En el navegador (vista móvil): pedido de catálogo con 2 productos y pedido personalizado con foto; ver página de gracias.
5. En el panel: llegan ambos pedidos, se ven las fotos, se cambia el estado y el total, el botón de WhatsApp abre el texto correcto; llega el email (o se registra en consola sin llave de Resend).
6. Con la llave anónima, confirmar que no se pueden leer pedidos ni fotos (prueba de RLS).
