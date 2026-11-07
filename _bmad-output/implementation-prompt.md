Implementa la v1 de una web de encargos desde EE. UU. para Colombia, siguiendo el plan aprobado en `/home/juan-camilo/Desktop/personal/dev/bring-from-usa/PLAN.md`. Léelo completo antes de empezar: es la fuente de verdad y no debes cambiar su alcance.

## Contexto
- Proyecto: `/home/juan-camilo/Desktop/personal/dev/bring-from-usa`. La raíz ya tiene `_bmad/`, `_bmad-output/` y un `.pptx`: no los toques. Crea la app en la subcarpeta `web/`.
- Es para un círculo de conocidos: le encargan productos a Juan Camilo y a su papá, que los traen cuando viajan a EE. UU. Sin pagos en línea, sin cuentas de cliente, sin chatbot (solo dejar previsto `custom_requests.channel`).
- Toda la interfaz en español, mobile-first (los clientes llegan desde WhatsApp).
- Herramientas instaladas: Node 24, npm 11, Supabase CLI 3, Docker funcionando.

## Stack obligatorio
Next.js (App Router, TypeScript, Tailwind, ESLint), Supabase (Postgres con RLS, Storage, Auth solo para el panel con magic link y lista blanca `ADMIN_EMAILS`), Resend para el email de "nuevo pedido", Vercel Cron diario para sincronizar el catálogo, zod para validar.

## Orden de trabajo
1. Crear la app en `web/` con create-next-app e instalar dependencias (`@supabase/supabase-js`, `@supabase/ssr`, `zod`, `resend`).
2. `supabase init` en `web/`, migración `supabase/migrations/0001_init.sql` con las tablas, estados y políticas RLS del plan, bucket privado `request-photos`, y `supabase/seed.sql` con un viaje publicado y unos 8 productos de ejemplo (4 de ropa, 4 de tecnología) para que el sitio funcione sin llaves.
3. Catálogo: `lib/catalog/types.ts` (interfaz `CatalogProvider` y `NormalizedProduct`), `lib/catalog/providers/bestbuy.ts` (recomendaciones trending / most viewed de Best Buy con `BESTBUY_API_KEY`; si falta la llave, omitir sin fallar), `lib/catalog/providers/shopify.ts` (lee `https://<dominio>/products.json?limit=250` de las fuentes habilitadas en `catalog_sources`, tolerando tiendas que no respondan) y `app/api/cron/sync-catalog/route.ts` protegido con `CRON_SECRET`, que hace upsert por `(source, external_id)`. El sitio nunca llama a las APIs en vivo, solo lee la base. Verifica la API de Best Buy en su documentación oficial antes de escribir el cliente; no inventes endpoints.
4. Páginas públicas: `/`, `/catalogo`, `/producto/[id]`, `/encargo` (carrito en localStorage + contacto + viaje opcional), `/encargo-personalizado` (nombre del producto, marca, referencia, variante, link opcional, descripción, cantidad, presupuesto opcional, hasta 3 fotos, contacto), `/encargo/[code]/gracias`. Mostrar "Precio en EE. UU.: USD X · el precio final te lo cotizamos".
5. Server actions en `app/actions/orders.ts`: validación con zod, honeypot anti-spam, código de pedido corto y legible, subida de fotos con URL firmada creada en el servidor, email con Resend (si falta `RESEND_API_KEY`, registrar en consola).
6. Panel `/admin` protegido: pedidos (lista, detalle, cambiar estado, total cotizado en COP, ver fotos con URL firmada, botón `wa.me` con texto prellenado), viajes (CRUD y publicar), productos manuales (CRUD, activar/desactivar), fuentes Shopify (agregar dominio, probar, activar) y botón "sincronizar ahora".
7. `.env.example` con todas las variables del plan y un `web/README.md` corto en español: cómo correr local, qué cuentas debe crear el usuario (Supabase, Best Buy, Resend, Vercel) y cómo desplegar.

## Reglas
- No crees cuentas, no despliegues, no hagas commits ni push, y no pongas llaves reales en archivos. Si falta una llave, el código debe degradar con un mensaje claro.
- No agregues funcionalidades fuera del plan. Si algo del plan no se puede hacer como está escrito (por ejemplo, la API de Best Buy funciona distinto), detente en ese punto, explica la diferencia y propón el ajuste mínimo.
- Mantén el código simple y legible; no sobre-abstraigas.

## Verificación antes de terminar
1. `npm run lint`, `npx tsc --noEmit` y `npm run build` en `web/` sin errores.
2. `supabase start`, aplicar migración y seed, `npm run dev`: el catálogo muestra los productos del seed.
3. Llamar al cron local con el secreto; si no hay llaves, confirmar que termina sin error.
4. En el navegador, en vista móvil: hacer un pedido de catálogo con 2 productos y un encargo personalizado con una foto; ver la página de gracias.
5. En el panel: ver ambos pedidos y la foto, cambiar estado y total, y comprobar el enlace de WhatsApp.
6. Con la llave anónima de Supabase, comprobar que no se pueden leer pedidos ni fotos.

Al final, reporta qué quedó hecho, qué verificaste y con qué resultado, qué no pudiste verificar y qué debe hacer el usuario (cuentas y llaves).
