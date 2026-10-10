# Pre-Registro de Profesionales y Radar de Talento (TAREA 03)

> **Documento de Arquitectura, Privacidad, Seguridad y Operación de Moderación**  
> **Comunidad Dezzpo** · Octubre 2026 · Versión 1.0  
> **Cumplimiento Legal:** Ley 1581 de 2012 (Habeas Data Colombia) & Aviso de Privacidad Canónico `V1.1`

---

## 1. Visión y Objetivos del Sistema

El módulo de **Pre-Registro de Profesionales** ("Recomendar a un Profesional") resuelve la captura de oferta cualificada no registrada en Dezzpo a través de dos mecanismos complementarios:

1. **Recomendación Ciudadana ("Voz a Voz"):** Permite a propietarios y contratistas registrados recomendar maestros, técnicos, empresas y especialistas de confianza que aún no tienen cuenta en Dezzpo, directamente desde el marketplace de `/app/portal-servicios`.
2. **Radar de Talento y Banco de Contacto:** Un panel centralizado en `/admin/pre-registros` donde el equipo de operaciones modera, contrasta con fuentes públicas, contacta legalmente a los profesionales recomendados y facilita su alta en la plataforma.

```
┌─────────────────────────┐       ┌────────────────────────┐       ┌────────────────────────┐
│  Usuario Recomendador   │       │   Servidor Hono / API  │       │  Panel de Moderación   │
│  /app/portal-servicios  │──────▶│   HMAC, Rate Limit,    │──────▶│  /admin/pre-registros  │
│  PreRegistrationModal   │       │   Anti-Enumeración     │       │  PreRegDetailDialog    │
└─────────────────────────┘       └────────────────────────┘       └────────────────────────┘
            │                                                                   │
            ▼                                                                   ▼
┌─────────────────────────┐                                        ┌────────────────────────┐
│    Handoff WhatsApp     │                                        │  Contacto Habeas Data  │
│    ("Avísale tú")       │                                        │  Checklist de Fuentes  │
└─────────────────────────┘                                        └────────────────────────┘
```

---

## 2. Principios de Privacidad y Cumplimiento Legal (Habeas Data)

### 2.1 Consentimiento Canónico `V1.1`
- **Requisito Obligatorio:** En Colombia (Ley 1581 de 2012 y Decreto 1377 de 2013), el tratamiento de datos personales suministrados por terceros exige autorización expresa.
- **Versión Canónica:** Constante centralizada `CANONICAL_PRIVACY_NOTICE_VERSION = 'V1.1' as const` en `@config/preRegistration.config`.
- **Texto en UI:** Idéntico al formulario de registro de la plataforma:
  > *"He leído y acepto el Aviso de Privacidad y Autorización para el Tratamiento de Datos Personales. Autorizo el tratamiento de los datos para fines de contacto y validación profesional."*
- **Evidencia Persistida:** Se almacena `{ privacyNoticeVersion: 'V1.1', acceptedAt: Timestamp }`. El servidor rechaza cualquier envío con versiones obsoletas o ausentes (`HTTP 400`).

### 2.2 Política de Retención y Purga Automática (TTL)
- **Registros Aprobados en Radar:** Permanecen en radar activo hasta que el profesional se registra formalmente en la plataforma o solicita su supresión.
- **Registros Terminales (`rechazada`, `duplicada`, `retirada`, `suprimida`):** Se les asigna una fecha de expiración `purgeAt` calculada a **30 días** (`RETENTION_TTL_DAYS = 30`).
- **Política TTL en Firestore:** Configurada en `firestore.indexes.json` mediante field override de TTL sobre el campo `purgeAt`.

### 2.3 Privacidad del Recomendador y del Tercero
- El titular de los datos (el profesional recomendado) **nunca** recibe el nombre ni el ID del recomendador para prevenir conflictos interpersonales.
- Los datos de contacto del profesional (correo y teléfono) solo son accesibles para administradores autorizados. El usuario recomendador únicamente puede visualizar el estado de sus recomendaciones en su pestaña personal.

---

## 3. Modelo de Amenazas (STRIDE) y Mitigaciones

| Amenaza (STRIDE) | Vector Potencial | Mitigación Implementada |
| :--- | :--- | :--- |
| **Spoofing (Suplantación)** | Peticiones anónimas o con sesión caducada enviando recomendaciones masivas. | Verificación de token Firebase Auth en Hono (`authenticateRequest`). Solo usuarios con UID activo pueden recomendar. |
| **Tampering (Manipulación)** | Alteración de campos en tránsito (ej. forzar `status: 'aprobada'`, inyectar tags HTML). | Esquemas Zod 4 estrictos; sanitización NFC/XSS (`sanitizeText`); el estado `aprobada` está estrictamente prohibido en el endpoint de creación. |
| **Repudiation (Repudio)** | Administrador aprueba o rechaza sin registro de auditoría, o autor niega el envío. | Registro inmutable en documento `admin_meta/internal`: `{ adminId, action, timestamp, changedFields, reasonCode }` con timestamp de servidor. |
| **Information Disclosure (Fuga)** | Oráculo de enumeración de cuentas: atacante prueba teléfonos/correos para descubrir usuarios registrados. | El endpoint `check-early` **solo** contrasta nombres contra perfiles comerciales públicos ya indexados. Las coincidencias de correo y teléfono se marcan como señales internas **solo para el admin**. |
| **Denial of Service (DoS)** | Script automatizado bombardeando recomendaciones para saturar la cola de moderación. | Límite de tasa estricto (máx. 5 envíos en 24h y máx. 5 pendientes simultáneas por usuario); clave de idempotencia (`uuid`); interruptor de emergencia (`PRE_REGISTRATION_ENABLED`). |
| **Elevation of Privilege** | Usuario regular intenta llamar endpoints de moderación o escribir en Firestore. | Las reglas de Firestore niegan toda escritura directa en colecciones de pre-registro (`allow write: if false;`). Toda mutación se ejecuta exclusivamente mediante el servidor con Firebase Admin SDK. |

---

## 4. Arquitectura de Servidor y Colecciones Firestore

### 4.1 Colecciones en Firestore
```
firestore/
├── preRegistrations/{id}                     # Documento principal del pre-registro
│   ├── candidate                             # Datos del profesional recomendado
│   │   ├── displayName                       # Nombre profesional (2-100 caracteres)
│   │   ├── email                             # Correo normalizado (minúsculas, trim)
│   │   ├── phoneE164                         # Teléfono E.164 (+57...)
│   │   ├── description                       # Descripción de experiencia (15-300 caracteres)
│   │   ├── skillIds                          # Array de hasta 5 IDs de categorías oficiales
│   │   ├── address                           # Dirección o zona sugerida (opcional)
│   │   └── website                           # Sitio web o perfil social normalizado (opcional)
│   ├── consent                               # Evidencia legal { privacyNoticeVersion, acceptedAt }
│   ├── status                                # 'pendiente' | 'aprobada' | 'rechazada' | 'duplicada' | 'retirada' | 'suprimida'
│   ├── submittedBy                           # UID del usuario recomendador
│   ├── version                               # Contador de concurrencia optimista (entero)
│   ├── hasPossibleMatch                      # Booleano de coincidencia con usuario registrado (R9)
│   ├── matchedUserId                         # UID del usuario coincidente (si aplica)
│   ├── createdAt / updatedAt / purgeAt       # Marcas de tiempo ISO 8601
│   │
│   └── admin_meta/internal                   # Subcolección Solo-Admin (invisible para clientes)
│       ├── auditLog                          # Array de transiciones [{ adminId, action, timestamp, notes }]
│       ├── internalSignals                   # Señales de coincidencia con cuentas registradas
│       ├── verifiedSources                   # Checklist de fuentes externas consultadas
│       └── outreachNotes                     # Bitácora de contacto del moderador
│
└── preRegistrationReservations/{hash}        # Candados atómicos de unicidad (HMAC-SHA256)
    ├── preRegistrationId                     # ID del pre-registro poseedor del bloqueo
    ├── type                                  # 'phone' | 'email'
    └── createdAt                             # Marca de tiempo de la reserva
```

### 4.2 Reservas Atómicas con HMAC-SHA256 (`duplicateService.ts`)
Para evitar condiciones de carrera donde dos usuarios envían al mismo profesional de manera simultánea sin revelar PII en las claves de documentos:
- Los candados se generan derivando hashes deterministas:
  $$\text{key} = \text{HMAC-SHA256}(\text{HMAC\_SECRET}, \text{"phone:"} + \text{phoneE164})$$
  $$\text{key} = \text{HMAC-SHA256}(\text{HMAC\_SECRET}, \text{"email:"} + \text{normalizedEmail})$$
- Dentro de una transacción de Firestore (`adminFirestore.runTransaction`), se verifica si la reserva ya existe. Si existe, la transacción aborta con `DUPLICATE_RESERVATION` (`HTTP 409`).
- Cuando un pre-registro pasa a un estado terminal (`rechazada`, `retirada`, `suprimida`), las reservas se eliminan atómicamente liberando el candado.

### 4.3 Endpoints Hono (`server/api/preRegistration/handlers.ts`)
Los endpoints se registran en `pages/+server.ts` **antes** del catch-all `vike(app)`:

| Método | Ruta | Autenticación | Propósito |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/pre-registrations` | Usuario Auth | Envío de recomendación con idempotencia, límite de tasa y reserva HMAC. |
| `GET` | `/api/v1/pre-registrations/check-early` | Usuario Auth / Guest | Comprobación temprana de nombres contra perfiles públicos sin enumeración. |
| `POST` | `/api/v1/pre-registrations/:id/moderate` | Admin (`claims.admin`) | Moderación (aprobar, rechazar, duplicada, suprimir, actualizar radar). |
| `POST` | `/api/v1/pre-registrations/:id/withdraw` | Autor | Retiro voluntario de una recomendación pendiente propia (R12). |
| `GET` | `/api/v1/pre-registrations/my-submissions` | Autor | Listado de recomendaciones enviadas por el usuario actual. |

---

## 5. Máquina de Estados y Ciclo de Vida

```
                      ┌───────────────┐
                      │   PENDIENTE   │
                      └───────┬───────┘
          ┌──────────────┬────┴─────────┬──────────────┐
          ▼              ▼              ▼              ▼
    ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐
    │ APROBADA  │  │ RECHAZADA │  │ DUPLICADA │  │ RETIRADA  │
    │  (Radar)  │  │(Motivo cl)│  │(Ref a orig│  │ (Por autor│
    └─────┬─────┘  └───────────┘  └───────────┘  └───────────┘
          │
          ▼
    ┌───────────┐
    │ SUPRIMIDA │
    │ (Habeas D)│
    └───────────┘
```

### Tabla de Transiciones Permitidas (`ALLOWED_TRANSITIONS`)
- `pendiente` $\to$ `aprobada`, `rechazada`, `duplicada`, `retirada`.
- `aprobada` $\to$ `suprimida`.
- `rechazada`, `duplicada`, `retirada`, `suprimida` $\to$ **Estados terminales inmutables** (no admiten más transiciones).

### Concurrencia Optimista (`version`)
Cada documento contiene un entero secuencial `version`. Al solicitar una acción de moderación, el administrador debe enviar el `expectedVersion`. Si otro moderador actualizó el registro concurrentemente, la transacción detecta el desfase y responde con `HTTP 409 VERSION_CONFLICT`, previniendo sobreescrituras silenciosas.

---

## 6. Endurecimiento del Flujo de Tiendas y Ferreterías

Como parte de la Fase 2, se aplicaron las mismas garantías de seguridad al servicio de Tiendas (`src/services/tiendas/tiendaService.ts`):
1. **Bloqueo de Estado Aprobado Directo:** El método `createTienda` fuerza incondicionalmente `estado: 'pendiente'`. Solo administradores verificados pueden crear o transicionar tiendas a `aprobado`.
2. **Límite de Tasa:** Máximo 5 registros de tiendas por usuario en una ventana móvil de 24 horas (`TIENDAS_MAX_PER_USER_PER_DAY = 5`).
3. **Clave de Idempotencia:** Soporte para `idempotencyKey` para evitar registros duplicados por doble clic o reintentos de red.
4. **Historial de Auditoría Inmutable:** Cada cambio de estado (`creación`, `aprobación`, `rechazo`) agrega una entrada a `auditLog` con `{ userId, action, timestamp, reason }`.

---

## 7. Experiencia del Usuario Recomendador (`/app/portal-servicios`)

### 7.1 Puntos de Entrada
- **Botón Principal en Cabecera:** Botón primario azul con ícono `PersonAddAlt1` en la barra superior del catálogo de profesionales.
- **Llamado en Estado Vacío (Zero Results):** Si una búsqueda de servicios no arroja resultados, se presenta una tarjeta invitando a recomendar un profesional en esa área.

### 7.2 Modal Responsivo (`PreRegistrationModal.tsx`)
- **Diseño Adaptativo:** Modal centrado en escritorio y hoja a pantalla completa (`fullScreen`) en dispositivos móviles (`down('sm')`).
- **Comprobación Temprana con Debounce (300ms):** Al escribir el nombre del candidato, consulta `/api/v1/pre-registrations/check-early`. Si ya existe en el directorio público, alerta al usuario con un enlace directo a su perfil para evitar duplicados sin bloquear homónimos legítimos.
- **Contador Dinámico de Caracteres:** Campo de descripción con indicador visual entre 15 y 300 caracteres con feedback de colores.
- **Selector de Categorías Oficiales:** Autocompletado que consume el catálogo unificado de 94 categorías (`ListadoCategorias`).
- **Handoff a WhatsApp ("Avísale tú"):** Al enviar la recomendación con éxito, la pantalla de confirmación ofrece un botón directo que abre WhatsApp Web o la App con un mensaje pre-redactado invitando al profesional a registrarse.
- **Pestaña "Mis Recomendaciones":** Permite al usuario revisar sus recomendaciones pasadas y retirar (`withdraw`) voluntariamente aquellas que sigan en estado `pendiente`.

---

## 8. Workbench de Moderación Admin (`/admin/pre-registros`)

### 8.1 Indicadores KPI y Organización por Pestañas
Ubicado en `/admin/pre-registros`, ofrece:
- **4 Tarjetas KPI en Cabecera:** Pendientes de moderación, Aprobadas en Radar de Talento, Rechazadas y Duplicadas (calculadas eficientemente con `getCountFromServer`).
- **Pestañas Segmentadas:** Conteo en tiempo real sobre la pestaña "Pendientes".
- **Buscador y Paginación:** Reutilización directa de `SearchInput` y `PaginationBar` con 12 ítems por página.
- **Alerta de Coexistencia R9:** Switch para filtrar registros que tienen coincidencia con un usuario comerciante ya registrado.

### 8.2 Diálogo de Inspección y Verificación (`PreRegistrationDetailDialog.tsx`)
- **Checklist Obligatorio:** El botón "Aprobar y pasar a Radar" permanece deshabilitado hasta que el moderador marque la casilla obligatoria: *"He contrastado los datos con fuentes públicas o contacto directo"*.
- **Atajos de Contacto Seguros:** Botones de llamada (`tel:`), correo (`mailto:`) y WhatsApp (`wa.me`) con atributos de seguridad `rel="noopener noreferrer"` y `target="_blank"`.
- **Plantilla de Contacto Legal (Habeas Data):** Cuadro de texto con botón de 1-clic para copiar al portapapeles el mensaje institucional de primer contacto informando los derechos ARCO (Acceso, Rectificación, Cancelación y Oposición).
- **Motivos Cerrados de Rechazo:** Menú desplegable con los códigos oficiales definidos en `REJECTION_REASONS` (`datos_invalidos`, `no_contactable`, `oficio_no_aplica`, `perfil_existente`, `solicitud_titular`, `otro`).
- **Edición Previa a la Aprobación:** Permite al moderador corregir errores tipográficos en el nombre, teléfono o categorías antes de consolidar el registro en el radar.

---

## 9. Coexistencia con Registro Real de Comerciantes (R9)

Cuando un profesional que fue previamente recomendado decide crear su propia cuenta en Dezzpo:
1. Durante la ejecución de `setUser()` en `userService.ts`, se dispara en segundo plano la función no-bloqueante `checkAndFlagPreRegistrationMatch(userId, merchantData)`.
2. Si coincide el teléfono, correo o nombre normalizado, el pre-registro activo se marca con `hasPossibleMatch: true` y `matchedUserId: userId`.
3. **Cero Fricción:** El registro del profesional **nunca** se detiene ni se bloquea.
4. En el panel de administración, el registro aparece resaltado con un badge ámbar alertando al moderador que el profesional ya completó su registro formal.

---

## 10. Batería de Pruebas Automatizadas

El sistema cuenta con una cobertura integral de **81 pruebas automatizadas** distribuidas en 5 suites:

| Archivo de Suite | Tipo de Prueba | Casos | Enfoque Principal |
| :--- | :--- | :---: | :--- |
| `tests/unit/characterization/preRegistrationBaseline.test.ts` | Caracterización / Baseline | 11 | Endurecimiento de tiendas, idempotencia, rate limit y audit logs. |
| `tests/unit/features/preRegistration/domain.test.ts` | Dominio Puro / Schemas | 38 | Zod 4 schemas, sanitización XSS/NFC, E.164 Colombia, transiciones permitidas. |
| `tests/unit/features/preRegistration/PreRegistrationModal.test.tsx` | Componente UI / Recommender | 6 | Renderizado responsive, debounce, contador de texto, consentimiento y WhatsApp CTA. |
| `tests/unit/features/preRegistration/adminModeration.test.tsx` | Componente UI / Admin | 8 | Workbench de moderación, KPIs, checklist de fuentes, motivos cerrados y versión 409. |
| `tests/unit/features/preRegistration/adversarial.test.tsx` | Batería Adversarial | 18 | 10 categorías STRIDE: inyecciones, rate limits, candados HMAC, spoofing y anti-enumeración. |

Comando de ejecución:
```bash
npx vitest run tests/unit/characterization/preRegistrationBaseline.test.ts tests/unit/features/preRegistration/
```
