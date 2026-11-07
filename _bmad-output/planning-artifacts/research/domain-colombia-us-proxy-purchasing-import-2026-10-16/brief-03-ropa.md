# Prompt para Gemini Deep Research (ronda 3): ¿funciona la ropa pagando impuestos completos?

Rol: analista de retail y comercio exterior colombiano. Hoy es 16 de octubre de 2026.

## Contexto y decisión

Estudio un servicio que compra en EE. UU. a nombre de clientes en Colombia y envía por courier, con el cliente pagando **impuestos completos** (arancel + IVA 19 %), más una comisión de compra por encargo del 10 %. Quiero saber si la **ropa, calzado y accesorios de moda** pueden ser una categoría central. Modelo propio ya calculado: costo puesto en Colombia ≈ 1,409 × precio en EE. UU. + 1,309 × flete (con arancel 10 % partida 98.17). Eso implica que el precio local en Colombia debería ser al menos ~1,55 a 1,75 veces el precio de EE. UU. para que el cliente ahorre. Necesito evidencia para saber si eso ocurre en moda, y en qué marcas, categorías y condiciones.

## Reglas (obligatorias)
1. Cada dato con **URL específica de la página del producto o documento**, publicador y fecha. No uses páginas de inicio como fuente. Si no puedes dar URL específica, escribe "NO VERIFICABLE".
2. Para precios: **mismo producto exacto** (mismo modelo/SKU/referencia) en la tienda de EE. UU. y en la tienda de Colombia, con fecha de captura y precio en USD y COP. Nada de "productos equivalentes". Indica la TRM usada.
3. Regulatorio: fuente oficial (DIAN, Decreto 1165/2019, MinCIT, Arancel de Aduanas). Dos fuentes para lo crítico.
4. Si no hay datos publicados, escribe "NO ENCONTRADO" y a quién preguntar. No estimes sin decirlo.
5. Responde en español.

## Preguntas

### A. Arancel real de la ropa por courier
- ¿Qué arancel pagan realmente prendas, calzado y accesorios que entran por tráfico postal / envíos urgentes cuando superan USD 200: el 10 % de la partida 98.17 o el arancel específico (35 % según el Decreto 2598 de 2022 para confecciones, calzado y marroquinería)? Cita la norma exacta (artículo y parágrafo) y cualquier concepto de la DIAN que lo aclare.
- ¿Existen preferencias arancelarias del TLC Colombia–EE. UU. para ropa y calzado de origen estadounidense o de otros orígenes? (Muchas prendas "de marca americana" se fabrican en Asia: ¿qué cuenta como origen?)
- Para envíos hasta USD 200 FOB: confirma que la ropa tiene exención de arancel y que el IVA tiene exención cuando no es comercial. ¿Hay restricciones específicas para textiles (etiquetado, marcación de origen, registro de importadores textiles)?
- Etiquetado y requisitos técnicos de confecciones y calzado (reglamentos técnicos de SIC) que apliquen a envíos de personas naturales.

### B. Diferencias de precio reales (lo más importante)
Para **10 marcas** populares en Colombia, mide el precio del **mismo artículo exacto** en la tienda oficial de EE. UU. y en Colombia (tienda oficial o retailer principal). Marcas sugeridas: Nike, Adidas, Levi's, Ralph Lauren, Tommy Hilfiger, Calvin Klein, The North Face, Lululemon, Carhartt, Gap/Old Navy, más cualquiera que encuentres con mayor brecha. Por marca, 3 artículos (camiseta, jean/pantalón, calzado o chaqueta). Tabla: marca, artículo exacto, precio EE. UU. (lista y en oferta si hay), precio Colombia, relación Colombia/EE. UU. (veces), URLs, fecha.
- Identifica las marcas o tiendas **que no existen o casi no existen en Colombia** (Lululemon, Aritzia, Carhartt, American Eagle, Abercrombie, Hollister, Vans, etc.): ¿se venden oficialmente aquí? ¿A qué precio?
- Cuánto bajan los precios en rebajas de EE. UU. (Black Friday, outlets, clearance): rango típico de descuento y calendario. Compara con las rebajas en Colombia.

### C. Costo del flete para ropa
- Con las tarifas actuales de 4-72, Servientrega, Coordinadora, DHL y otros: costo de enviar 1, 3, 6 y 10 prendas (peso típico: camiseta 0,4 lb, jean 1,5 lb, chaqueta 2 a 3 lb, zapatillas 3 lb en caja). Cuánto cuesta cada prenda adicional (consolidación).
- Peso volumétrico para ropa y calzado: ¿lo aplican los couriers de verdad? Ejemplos y reglas publicadas.

### D. Fricción y riesgos propios de la moda
- Tasa de devoluciones de moda online y cómo manejan devoluciones los servicios de compra por encargo a Colombia (tallas, cambios). Quién asume el costo.
- Quejas típicas de clientes de moda importada (tallas, calidad, retrasos, cobros) con enlaces.
- Restricciones de tiendas de EE. UU. para envío o venta a Colombia en ropa (bloqueos por país, tarjetas, límites por cantidad).

### E. Mercado y comprador
- Tamaño y crecimiento del mercado de moda online en Colombia y de las compras internacionales de ropa por colombianos (fuentes: DIAN, Cámara Colombiana de Comercio Electrónico, Euromonitor, Statista, DANE, Fedesarrollo). Cuántos envíos urgentes llegan de EE. UU. al año y qué categorías dominan, si lo publican.
- Perfil del comprador de moda importada por casillero o compra por encargo (edad, ciudad, ticket promedio, frecuencia), con fuente.

### F. Veredicto
Con la evidencia anterior, responde: ¿en qué segmentos de moda el costo puesto (impuestos completos + 10 % de comisión + flete) queda por debajo del precio en Colombia? Define por segmento: marca no disponible localmente / ropa en rebaja en EE. UU. / marca disponible a precio local alto / otros. ¿Qué tamaño de pedido (número de prendas) hace viable el flete? ¿Cuál es el ticket mínimo y el precio local mínimo relativo para que valga la pena?

## Formato de salida (estricto)
1. **Resumen ejecutivo** (máx. 12 líneas): ¿funciona la ropa? ¿en qué segmento?
2. **Hallazgos A a F** con [n] por afirmación.
3. **Tabla de 10 marcas** (sección B) y **tabla de flete por número de prendas** (C).
4. **Contradicciones y datos no confirmados.**
5. **Vacíos** ("NO ENCONTRADO" y a quién preguntar).
6. **Fuentes numeradas** con URL específica, publicador, fecha de publicación, fecha de acceso y tipo (primaria / secundaria / interesada).
