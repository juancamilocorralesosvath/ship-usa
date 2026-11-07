# Prompt para Gemini Deep Research (ronda 2): competitividad pagando todos los impuestos

Rol: analista senior de comercio exterior colombiano y de e-commerce transfronterizo. Hoy es 16 de octubre de 2026.

## Contexto y decisión

Planeo una empresa que compra en EE. UU. a nombre de clientes en Colombia y envía los productos a Colombia por courier. Decidí que el modelo financiero parte de que el cliente **paga todos los impuestos de importación (IVA 19 % y arancel aplicable) desde el primer día**, sin contar con la exención de USD 200 como base. Necesito saber si, **pagando impuestos completos**, este servicio sigue siendo competitivo frente a las alternativas del cliente, y con qué margen. Decisión: seguir o no con el modelo, y a qué precio y comisión.

Hechos ya verificados (no los repitas, úsalos como base): hoy la exclusión de IVA y arancel para envíos hasta USD 200 FOB (tráfico postal/envíos urgentes, no comerciales, desde EE. UU.) sigue vigente tras la caída del Decreto 1474 de 2025 (Corte Constitucional C-079/2026, DIAN Concepto 1470/2026). La guía de la DIAN excluye alimentos, cosméticos, medicinas, bebidas alcohólicas y baterías del tráfico postal.

## Reglas de investigación (obligatorias)

1. Cada dato con **URL, publicador y fecha**. Sin cifras sin fuente.
2. Prefiere fuentes primarias (DIAN, MinCIT, Diario Oficial, sitios oficiales de couriers y tiendas, aranceles en el Arancel de Aduanas/TARIC de la DIAN). Los blogs de casilleros y servicios de compra son de baja confianza: úsalos solo para pistas y márcalos como "interesada".
3. Datos regulatorios críticos con dos fuentes, una oficial. Precios y tarifas con máximo 12 meses de antigüedad.
4. Si dos fuentes se contradicen, preséntalas ambas y di cuál es más confiable.
5. Si algo no está publicado, escribe "NO ENCONTRADO" y a quién preguntar. No rellenes ni estimes sin decirlo.
6. Responde en español.

## Preguntas a responder

### A. Cómo se calculan realmente los impuestos cuando se superan USD 200 (o cuando no aplica la exención)
- Fórmula exacta de arancel e IVA para tráfico postal / envíos urgentes: base gravable (valor + flete + seguro), orden de cálculo, tasa de cambio que usa la DIAN (TRM de qué fecha).
- Aranceles reales por categoría para: celulares, laptops y consolas, ropa y calzado, zapatillas deportivas, juguetes, repuestos de carro y moto, herramientas, libros, accesorios de electrónica. Para cada una: partida arancelaria típica, arancel con y sin TLC con EE. UU. (preferencia arancelaria, requisito de certificado de origen o declaración), y IVA aplicable (incluye bienes excluidos o con tarifa distinta como computadores y celulares en algunos rangos).
- ¿La partida 98.17 (envíos urgentes) con 10 % de arancel es la tarifa estándar para todo lo que exceda USD 200, o el courier debe aplicar la partida específica? Confirma con norma o concepto de la DIAN. Hay quejas de usuarios de que los couriers aplican 10 % general cuando correspondería menos: verifica si es cierto.
- Tasas o cobros adicionales del courier o de la DIAN al nacionalizar (manejo, bodegaje, gestión aduanera).

### B. Costo total puesto en Colombia, pagando impuestos completos
Calcula con fórmula transparente y fuente en cada insumo, para 6 casos (precio de compra en EE. UU. → costo total en Colombia con flete, arancel, IVA y comisión de compra por encargo típica del mercado):
1. Celular de USD 300
2. Laptop de USD 900
3. Zapatillas de USD 120
4. Consola de USD 450
5. Prenda de ropa de USD 60 (ejemplo bajo USD 200 con exención, como contraste)
6. Un pedido de 3 prendas por USD 220 (supera el umbral)
Para cada caso compara contra el **precio del mismo producto o equivalente en Colombia** (Mercado Libre Colombia, Amazon Colombia si existe oferta, Alkosto, Falabella, Éxito, tienda oficial de la marca) con URL y fecha del precio. Indica en qué casos el importar sale más barato y en cuáles más caro, con el margen porcentual.

### C. Competidores directos (compra por encargo / personal shopper a Colombia) y casilleros
- Para Encárguelo, PrimeBox, Global Shopaholics, TuloImportas, Aeropost, MyUS, Shipito, Mailamericas, Envíame y cualquier otro que encuentres: modelo (casillero vs compra por encargo), comisión, tarifa de flete, cómo manejan los impuestos (cobran impuestos completos, aplican la exención, usan una TRM propia), tiempo de entrega y cuánto cobran en total por los mismos 6 casos de la sección B si lo publican.
- Reseñas negativas recurrentes (Trustpilot, Google, Reddit, Facebook, X) con enlaces: retrasos, impuestos sorpresa, pérdidas, soporte, TRM inflada. Cuáles son las 5 quejas más repetidas.

### D. Márgenes y viabilidad
- Con las tarifas reales de flete (4-72, Servientrega, Coordinadora, DHL, otros) y pagando impuestos completos, ¿qué comisión necesita cobrar un servicio de compra por encargo para ser rentable, considerando: costo de flete por libra, costos de pago (pasarelas colombianas PSE/tarjeta, comisión de la tarjeta en EE. UU.), diferencia cambiaria y devoluciones? Da un rango con la fórmula, no solo un número.
- Benchmark: qué comisión o margen cobran servicios similares (porcentaje sobre el producto, tarifa fija por pedido).
- ¿Hay categorías donde el servicio queda claramente competitivo aun con impuestos completos (por ejemplo, productos que no se consiguen o cuestan mucho más en Colombia)? Lista con ejemplos y fuentes.

### E. ¿Hay diferencia real frente a la competencia?
Con todo lo anterior, responde: pagando impuestos completos, ¿hay un espacio de precio, servicio o categoría donde un nuevo servicio puede diferenciarse? Distingue: (1) donde gana por precio, (2) donde gana por acceso (productos que el cliente no puede comprar o recibir por su cuenta), (3) donde gana por experiencia (cálculo transparente de impuestos antes de pagar, sin TRM inflada, sin peso volumétrico abusivo). Basa cada punto en evidencia de las secciones B y C.

## Formato de salida (estricto)
1. **Resumen ejecutivo** (máx. 12 líneas): ¿sale caro o no pagando impuestos completos? ¿Hay diferenciación posible? Los 5 datos que más pesan.
2. **Hallazgos por sección** (A a E) con [n] por afirmación.
3. **Tabla de los 6 casos** con columnas: producto, precio EE. UU., flete, arancel, IVA, comisión, total en Colombia, precio local en Colombia, diferencia %, fuente de cada celda.
4. **Tabla de competidores**: modelo, comisión, flete, trato de impuestos, quejas principales, fuente.
5. **Contradicciones y datos no confirmados.**
6. **Vacíos** ("NO ENCONTRADO" y a quién preguntar).
7. **Fuentes numeradas**: [n] título, publicador, URL, fecha de publicación, fecha de acceso, tipo (primaria / secundaria / interesada).
