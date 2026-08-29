# Manual de Arquitectura: Automatización en Facebook & Meta Graph API v19.0+

> **Comunidad Dezzpo** — Sistema de Intercepción Quirúrgica B2C/B2B, Control de Cuotas y Prevención de Baneos.

---

## 1. Visión General y Objetivos del Sistema

El módulo de automatización en redes sociales de Dezzpo (`src/services/social/`) permite interceptar demanda insatisfecha (propietarios buscando servicios para el hogar) y oferta calificada (maestros y contratistas buscando obras) en grupos públicos y páginas de Facebook, bajo una restricción no negociable: **Cero riesgo de baneo por spam y control quirúrgico de cuotas de la API de Meta**.

```
                           ┌────────────────────────────┐
                           │   Meta Graph API v19.0+    │
                           └──────────────┬─────────────┘
                                          │
                  ┌───────────────────────┴───────────────────────┐
                  ▼                                               ▼
     [VÍA 1: PUSH EN TIEMPO REAL]                    [VÍA 2: PULL PERIÓDICO]
     Meta Webhooks (/api/v1/meta/webhook)            AutonomousWorker (Cron/Serverless)
                  │                                               │
                  └───────────────────────┬───────────────────────┘
                                          ▼
                         ┌─────────────────────────────────┐
                         │   Circuit Breaker Engine (80%)  │
                         │   • Headers X-App-Usage         │
                         │   • Kill Switch Error 368       │
                         └────────────────┬────────────────┘
                                          ▼
                         ┌─────────────────────────────────┐
                         │      Intent Classifier          │
                         │   • DEMAND vs SUPPLY vs NEUTRAL │
                         │   • 92 Categorías + 20 Zonas    │
                         └────────────────┬────────────────┘
                                          ▼
                         ┌─────────────────────────────────┐
                         │    Dynamic Copy Rotation        │
                         │   • Rotación aleatoria          │
                         │   • Tagging (@autor)            │
                         │   • Inyección UTM única         │
                         └────────────────┬────────────────┘
                                          ▼
                         ┌─────────────────────────────────┐
                         │   DispatchQueue (Anti-Spam)     │
                         │   • Jitter humano (45s - 120s)  │
                         │   • Máx 12 comentarios / hora   │
                         │   • Quiet Hours (11pm - 6am)    │
                         └────────────────┬────────────────┘
                                          ▼
                         ┌─────────────────────────────────┐
                         │   Cloud Firestore & Admin KPI   │
                         │   • socialInterceptionLogs      │
                         │   • Panel /admin/dashboard      │
                         └─────────────────────────────────┘
```

---

## 2. Procedimiento de Emisión Anti-Baneo y Leyes de Seguridad

### A. Circuit Breaker Quota Engine (`circuitBreaker.ts`)
Para evitar sobrepasar los límites de llamadas de Meta (*Rate Limits*), el cliente HTTP inspecciona las cabeceras `X-App-Usage` y `X-Business-Usecase-Usage` en cada respuesta:
1. **Regla del 80% (Ceiling Threshold)**: Si cualquiera de las métricas (`call_count`, `total_cputime`, `total_time`) alcanza o supera el **80%**, el circuito transiciona inmediatamente a estado **`OPEN`** y suspende temporalmente las peticiones salientes.
2. **Backoff Exponencial con Jitter**:
   - Intento 1: Pausa de 5 minutos ($\pm 10\%$).
   - Intento 2: Pausa de 10 minutos ($\pm 10\%$).
   - Intento 3: Pausa de 20 minutos ($\pm 10\%$).
   - Máximo: 60 minutos.
3. **Kill Switch Permanente (Error 368)**:
   Si Meta responde con código de error nativo `368` (*"Your account is temporarily restricted from posting or commenting"*), el circuito pasa de forma irrevocable a estado **`HALTED`**, apagando todas las colas para proteger la cuenta y emitiendo una alerta crítica.

### B. Cola de Despacho Humanizada (`dispatchQueue.ts`)
Meta penaliza las ráfagas concurrentes de comentarios inmediatos (*Bursting*):
* **Prohibido**: `Promise.all` o envíos simultáneos.
* **Secuenciamiento FIFO**: Cada comentario se encola y procesa en serie.
* **Jitter Humano**: Pausa aleatoria calculada dinámicamente entre **45 y 120 segundos** entre cada comentario individual.
* **Límite Horario Rodante**: Máximo **12 comentarios por hora** en producción.
* **Horario de Silencio (Quiet Hours)**: Pausa automática de despachos entre las **11:00 PM y las 06:00 AM** (hora Bogotá).

---

## 3. Taxonomía de Expresiones Regulares & 92 Categorías de Dezzpo

El clasificador de intenciones (`src/services/social/intentParser.ts`) analiza el texto de cada publicación extrayendo intención, oficio y localidad geográfica:

### A. Detección de Oferta / Contratistas (`SUPPLY`)
Identifica maestros y contratistas ofreciendo servicios para invitarlos a crear su vitrina digital:
* **Patrones regex**: `/ofrezco (mis )?servicios/i`, `/maestro de (obra|construcción|acabados)/i`, `/somos contratistas/i`, `/plomería (disponible|a domicilio|garantizada)/i`, `/electricista (certificado|instalador)/i`, `/pintor profesional/i`, `/se realizan trabajos/i`, `/hacemos (estuco|pintura|enchape|drywall|carpintería)/i`, `/taller de (ornamentación|cerrajería|soldadura)/i`, `/disponible para (trabajar|obras|contratos)/i`.

### B. Detección de Demanda / Clientes (`DEMAND`)
Identifica propietarios y administradores con necesidades de reparación o construcción:
* **Patrones regex**: `/(busco|solicito|necesito|requiero) (un )?(maestro|plomero|electricista|pintor|remodelador|albañil|contratista|carpintero|cerrajero|soldador|vidriero)/i`, `/alguien que (haga|sepa|repare|instale|pinte|enchape|impermeabilice|suelde)/i`, `/cotización (para|de|urgente)/i`, `/recomienden un buen.../i`, `/cuánto cobran por.../i`, `/urgente (fuga|corto circuito|destape|gotera|cerradura)/i`, `/filtración|humedad|gotera en (techo|pared|teja|cubierta)/i`.

### C. Mapeo del Catálogo Completo (92 Categorías)
| Especialidad Detectada | Palabras Clave Vinculadas en Regex |
| :--- | :--- |
| **Plomería & Gas** | `plomería`, `tubo`, `fuga`, `grifo`, `inodoro`, `destape`, `sifón`, `hidráulico`, `calentador`, `gasodoméstico`, `estufa a gas` |
| **Electricidad & HVAC** | `electricidad`, `corto`, `breaker`, `cableado`, `tomacorriente`, `trifásica`, `iluminación`, `tablero`, `aire acondicionado`, `refrigeración` |
| **Pintura & Techos** | `pintura`, `estuco`, `fachada`, `vinilo`, `impermeabilización`, `gotera`, `humedad`, `techo`, `cubierta`, `teja` |
| **Maestro & Drywall** | `maestro de obra`, `acabados`, `drywall`, `cielo raso`, `superboard`, `obra blanca`, `estructura` |
| **Remodelación & Baños** | `remodelación`, `diseño`, `apartamento`, `cocina integral`, `baño`, `ampliación`, `obra civil` |
| **Albañilería & Pisos** | `albañil`, `mampostería`, `bloque`, `cemento`, `viga`, `enchape`, `porcelanato`, `baldosa`, `piso laminado` |
| **Carpintería & Muebles** | `carpintería`, `ebanistería`, `closet`, `madera`, `puerta de madera`, `muebles modulares` |
| **Cerrajería** | `cerrajería`, `chapa`, `cerradura`, `candado`, `apertura de puerta` |
| **Ornamentación & Metal** | `ornamentación`, `soldador`, `soldadura`, `reja`, `portón metálico`, `estructura metálica` |
| **Vidriería & Aluminio** | `vidrios`, `vidriería`, `ventanas aluminio`, `espejo`, `división de baño` |
| **Ingeniería & Estudios** | `topografía`, `peritaje`, `avalúo`, `geotecnia`, `estudios de suelo`, `diseño 3D`, `planos` |
| **Fumigación** | `fumigación`, `control de plagas`, `desinfección`, `sanitización` |

### D. Cobertura Geográfica (20 Localidades de Bogotá + Municipios Sabana)
Suba, Usaquén, Chapinero, Engativá, Kennedy, Bosa, Fontibón, Teusaquillo, Barrios Unidos, Puente Aranda, Tunjuelito, Ciudad Bolívar, San Cristóbal, Santa Fe, La Candelaria, Los Mártires, Antonio Nariño, Usme, Sumapaz, Chía, Soacha, Cajicá, Zipaquirá, Madrid, Mosquera, Funza, Cota, Facatativá, La Calera, Sopó.

---

## 4. Ingestión Dual: Webhooks en Tiempo Real vs Autonomous Worker

| Característica | Webhooks en Tiempo Real (Push) | Autonomous Worker (Pull) |
| :--- | :--- | :--- |
| **Activador** | Evento HTTP `POST /api/v1/meta/webhook` emitido por Meta en $< 500$ ms. | Cron en segundo plano (Serverless o Cloud Function cada 15-30 min). |
| **Consumo de Cuota** | **0 peticiones GET de sondeo**. Máxima eficiencia de cuota. | Consume cuota de sondeo (`/feed?since=...`). |
| **Verificación** | Firma `X-Hub-Signature-256` con `META_APP_SECRET`. | Token Bearer del Usuario del Sistema. |
| **Uso Principal** | Respuestas inmediatas a publicaciones en Páginas y Grupos con Webhook activado. | Barrido de respaldo de publicaciones históricas o no notificadas. |

---

## 5. Trazabilidad UTM y Medición de Impacto

Cada enlace generado por el interceptor lleva un identificador criptográfico único para medir la efectividad en Google Analytics 4 y en el Panel de Administrador:

* **Para Propietarios / Demanda**:
  ```
  https://dezzpo.com/?utm_source=facebook_group&utm_medium=group_interception&utm_campaign=demand_homeowners&utm_content=CLI-CONF-CON-CON-15&utm_term=plomero
  ```
* **Para Contratistas / Oferta**:
  ```
  https://dezzpo.com/?utm_source=facebook_group&utm_medium=group_interception&utm_campaign=contractor_acquisition&utm_content=MAES-EXP-INT-URL-01&utm_term=electricista
  ```

### Dimensiones de Medición en GA4 y Admin Dashboard
1. **CTR por Ángulo de Copy**: Comparativa de conversión entre `CONFIANZA` vs `RAPIDEZ`.
2. **CTR por Nivel de Intención**: `INTRIGA` vs `BENEFICIO` vs `CONVERSIÓN DIRECTA`.
3. **Registro de Conversión**: Tasa de usuarios que tras hacer clic en el enlace completaron su registro o publicaron un requerimiento en Dezzpo.

---

## 6. Telemetría en el Panel de Control del Administrador (`/admin/dashboard`)

El panel de administración incluye el módulo en vivo **Automatización Social & Meta Graph API v19.0+**, exponiendo:
1. **Estado de Circuito**: Indicador de salud en tiempo real (`CLOSED` 🟢 / `OPEN` 🔴) ante el umbral del 80% de cuota.
2. **Total de Intercepciones**: Conteo de publicaciones clasificadas (`DEMAND` vs `SUPPLY`).
3. **Comentarios Despachados**: Contador de mensajes emitidos bajo la política FIFO con Jitter.
4. **Consumo de Cuota**: Porcentaje de llamadas consumidas frente al límite de Meta.
5. **Tabla de Auditoría en Vivo**: Historial con Autor, Intención, Oficio detectado, Copy ID y Estado de Despacho.

---

## 7. Herramientas MCP para el Entorno de Desarrollo (IDE)

Para probar y simular la lógica sin arriesgar la cuenta de producción ni consumir llamadas a Meta:

| MCP Tool | Propósito |
| :--- | :--- |
| `mcpSimulateFacebookScan(samplePosts)` | Simula el escaneo completo de posts de prueba clasificando intención, oficio y copy inyectado. |
| `mcpSimulateRateLimitScenario(callCountPercent)` | Fuerza un escenario de rate-limit (ej. 85%) para verificar que el Circuit Breaker se dispare a `OPEN`. |
| `mcpPreviewCopyInjection(authorName, intent, trade)` | Previsualiza el comentario formateado con etiquetado dinámico y URL UTM. |
| `mcpControlWorker(action)` | Consulta el estado del worker (`status`), lo inicia (`start`), pausa (`pause`) o reinicia (`reset`). |

---

## 8. Inventario de Credenciales y Variables de Entorno

```bash
META_APP_ID=965094149947204
META_APP_SECRET=********************************
META_PAGE_ACCESS_TOKEN=********************************
META_PAGE_ID=375828669832688
META_COMMERCIAL_PORTFOLIO_ID=350306805830712
META_ADVERTISING_ACCOUNT_ID=836577536843754
META_WEBHOOK_VERIFY_TOKEN=********************************
```
