# 🔍 Informe de Auditoría de Riesgos y Descubrimiento — Fase 0 Testing

> **Proyecto**: Comunidad Dezzpo (Marketplace PWA)  
> **Fecha**: 7 de Agosto, 2026  
> **Autor**: Test Architect / Senior QA Engineer  
> **Estado**: COMPLETADO (Entregable de Fase 0)

---

## 1. Mapeo de Arquitectura y Amenazas de Datos (STRIDE Analysis)

### 1.1 Exposición Horizontal en Firestore (`firestore.rules`)
Se identificaron las siguientes brechas de seguridad en las reglas actuales que requieren mitigación en la Fase 4:

| Colección | Regla Actual | Riesgo Detectado | Mitigación Planificada (Fase 4) |
|---|---|---|---|
| `/quotations` | `allow read: if isAuthenticated();` | **Alto (Filtración de Competencia)**: Cualquier comerciante autenticado podría consultar las ofertas y precios enviados por otros comerciantes. | Restringir lectura solo al propietario emisor de la cotización (`comercianteId`) o al cliente dueño del proyecto (`clientId`) o Admin. |
| `/certificationRequests` | `allow read: if isAuthenticated();` | **Medio**: Cualquier usuario puede listar solicitudes de certificación de otros profesionales. | Restringir lectura a `isOwner(comercianteId)` o `isAdmin()`. |
| `/inspectionRequests` | `allow read: if isAuthenticated();` | **Medio**: Exposición de solicitudes de inspección técnica en inmuebles de propietarios. | Restringir lectura a `isOwner(propietarioId)` o `isAdmin()`. |
| `/referrals` & `/referralRedemptions` | `allow read: if isAuthenticated();` | **Bajo-Medio**: Exposición de historial de puntos y cupones de terceros. | Restringir lectura a `isOwner(referrerId)` / `isOwner(userId)` o `isAdmin()`. |

---

## 2. Resguardo de Cloud Storage (`storage.rules`)

Basado en la inspección real de las carpetas en la consola de Firebase (`site/`, `html/`, `profiles/`, imágenes raíz), se ha creado y desplegado el archivo `storage.rules` en la raíz del proyecto con la siguiente matriz de permisos:

```
gs://app-comunidad-dezzpo.appspot.com
├── /site/* (Logos, iconos, categorías) ──► Read: Público | Write: Admin Only
├── /html/* (Imágenes de inicio)        ──► Read: Público | Write: Admin Only
├── /profiles/{userId}/* (Portafolios)   ──► Read: Público | Write: Owner(userId) o Admin (Max 10MB, contentType image/*)
├── /verifications/{userId}/* (Documentos)► Read: Owner(userId) o Admin | Write: Owner(userId) o Admin (Max 10MB)
└── Catch-all (Cualquier otra ruta)    ──► Read: Deny | Write: Deny
```

**Resultado de Fase 0**: El bucket de producción queda protegido contra borrados accidentales, subida de archivos maliciosos (ej. ejecutable .exe / scripts) y cuotas descontroladas, limitando todas las subidas a imágenes y 10MB máximo.

---

## 3. Auditoría de Endpoints API y Flujos Monetarios (`server/api/`)

1. **Endpoint `POST /api/v1/payment/signature`**:
   - **Firma Cryptográfica**: `md5(P_CUST_ID^P_KEY^INVOICE^AMOUNT^CURRENCY)` generada 100% server-side. La clave privada `VITE_APP_EPAYCO_PRIVATE_KEY` nunca se transmite al cliente.
   - **Formato de Factura**: `DEZZPO-{contractId}-{paymentStage}` previene colisiones en la pasarela.
   - **Riesgo Identificado**: Validar que el parámetro `amount` enviado por el cliente coincida exactamente con el monto del contrato o anticipo registrado en Firestore antes de firmar.

2. **Endpoint `POST /api/chat` (RAG Chatbot)**:
   - **Integración**: Gemini 2.5 Flash + Supabase Vector Store (`match_dezzpo_documents`).
   - **Riesgo Identificado**: Rate limits en tier gratuito (5 RPM). Se requiere mock para pruebas unitarias.

---

## 4. Estado de Preparación para la Fase 1 (Infraestructura de Testing)

- **Vitest & RTL**: Instalados en `package.json` pero faltan dependencias requeridas (`fast-check`, `@stryker-mutator/*`, `@firebase/rules-unit-testing`).
- **Firebase Emulators**: Requiere habilitar puertos para `firestore` (8080) y `storage` (9199) en `firebase.json`.
- **Scripts de NPM**: Deben ser añadidos a `package.json` en la Fase 1.

---

**Aprobado por**: Test Architect  
**Siguiente Paso**: Proceder con la **Fase 1: Infraestructura de Testing y Emuladores Locales**.
