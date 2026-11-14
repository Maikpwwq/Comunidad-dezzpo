# PLANING ESTRATÉGICO: ESTADO DE PRODUCTO Y DOCUMENTACIÓN DE FASE 5 (CONGELADA)
**Comunidad Dezzpo · Red Profesional de Contratistas y Acabados (Colombia)**  
**Documento de Gobernanza de Producto, Arquitectura y Compliance Legal**  
**Última Actualización:** 13 de Noviembre de 2026 · **Rama:** `master`

---

## 1. HISTORIAL DE RESOLUCIÓN: DE IDEAS A CÓDIGO EN PRODUCCIÓN

Las ideas originales de producto consignadas en las versiones preliminares de este documento fueron formalmente evaluadas, diseñadas e implementadas en el código base del repositorio a través de las Fases 1 a 4:

| Idea Original de Producto | Fase | Estado Técnico en Repositorio | Decisión de Arquitectura / Archivos Clave |
| :--- | :---: | :---: | :--- |
| **1. Fideicomiso / Pagos por Hitos** | **Fase 2** | **RESUELTO (Modelo D)** | **Escrow Lógico sin captación de fondos.** Contratos divididos en hitos porcentuales auditables con actas bilaterales de recibo (Ley 527/1999) e instrucción de pago directo entre las partes. Archivos: `src/services/contracts/milestoneService.ts`, `src/components/common/ContractMilestonesSection.tsx`. |
| **2. Bitácora de Obra Visual Compartible** | **Fase 2** | **RESUELTO** | **Feed fotográfico diario con compresión WebP y enlace público.** Hash HMAC URL-safe para compartir en WhatsApp (`/obra/@token`) con comparador Antes/Después y stripping EXIF/GPS. Archivos: `src/services/contracts/dailyLogService.ts`, `pages/(marketing)/obra/@token/+Page.tsx`. |
| **3. Moodboards de Clientes** | **Fase 2** | **RESUELTO** | **Entidad `InspirationBoard` unificada.** Permite a los clientes guardar paletas e imágenes en `/app/biblioteca`, vincularlas al publicar un requerimiento (`MoodboardSelector.tsx`) y visualizarlas en `/app/ver-requerimiento/@draftId`. |
| **4. Libros de Inspiración UGC + SEO** | **Fase 3** | **RESUELTO** | **Catálogo dinámico de inspiración.** Curación de proyectos por categoría y zona de Bogotá (`/inspiracion`) con tarjetas interactivas Antes/Después y handoff directo a contratación. Archivos: `src/services/inspiration/inspirationEditorialService.ts`. |
| **5. Gamificación y Reputación Líquida** | **Fase 1** | **RESUELTO** | **Motor de insignias 100% algorítmico y tarjeta digital QR.** Evaluación determinista de puntualidad, cero disputas y verificaciones; exportación de tarjeta de visita digital con código QR vectorial SVG. Archivos: `src/services/reputation/badgeEngine.ts`, `ComercianteBusinessCardModal.tsx`. |
| **6. Cotizador Inteligente Asistido** | **Fase 3** | **RESUELTO** | **Motor determinista paramétrico.** Wizard conversacional en `/cotizador` para 6 tipologías de espacio y 3 niveles de acabado con precios unitarios reales de Bogotá y aviso legal de no vinculación (Ley 1480/2011). Archivos: `src/services/estimator/estimatorEngine.ts`. |
| **7. Contrato VIP para Propiedad Horizontal** | **Fase 4** | **RESUELTO** | **Marco contractual B2B bajo Ley 675 de 2001.** Validación de NIT DIAN (módulo 11), desglose de partidas en áreas comunes, deslinde expreso de responsabilidad técnica de Dezzpo y modalidad de exportación impresa para Consejos de Administración. Archivos: `src/services/contracts/b2bPhContractService.ts`, `PhContractModal.tsx`. |
| **8. Catálogo de Estilos y AI Redesign** | **Fase 4** | **RESUELTO** | **12 Plantillas de Estilo arquitectónico (Plan B Determinista $0) y Estudio Asistido.** Mapeo de estilos en `/estilos` vinculados directamente al catálogo de ferreterías aliadas (`ListadoCategoriasTiendas.ts`), cuotas diarias (máx 3/día) y stripping EXIF. Archivos: `src/services/inspiration/architecturalStyles.ts`, `src/services/ai/aiRedesignService.ts`. |

---

## 2. DOCUMENTACIÓN DE FASE 5: CONGELADA (ESCROW FINANCIERO Y SPLIT PAYMENTS)

### 2.1 Declaración Formal de Estado
La **Fase 5 (Escrow Financiero Directo, Custodia de Fondos y Dispersión Automatizada mediante Split Payments de Pasarela)** se encuentra formalmente **CONGELADA POR DISEÑO REGULATORIO Y ESTRATÉGICO**.

Dezzpo **NO retiene, no custodia, no congela ni intermedia recursos dinerarios** pertenecientes a los clientes ni a los contratistas en cuentas propias de la plataforma o de sus fundadores.

---

### 2.2 Fundamentos Jurídicos y Penales de la Congelación

1. **Tipificación Penal de Captación Masiva y Habitual:**
   - De conformidad con el **Artículo 316 del Código Penal Colombiano** (modificado por la Ley 1357 de 2009), captar dineros del público de forma masiva y habitual sin previa autorización de la Superintendencia Financiera de Colombia (SFC) acarrea penas de **120 a 240 meses de prisión** y multas de hasta 50.000 SMLMV.
   - Retener saldos de obras civiles o contratos de remodelación en una cuenta bancaria de Dezzpo para "liberarlos por hitos" encuadra de forma inmediata en intermediación financiera no autorizada.

2. **Reserva Constitucional y Financiera:**
   - El **Artículo 335 de la Constitución Política de Colombia** consagra que las actividades financiera, bursátil y aseguradora son de interés público y solo pueden ser ejercidas previa autorización del Estado.
   - El Estatuto Orgánico del Sistema Financiero (EOSF, Decreto 663 de 1993) y el Decreto 2555 de 2010 reservan la administración de encargos fiduciarios a Sociedades Fiduciarias vigiladas por la SFC, requiriendo patrimonios técnicos superiores a $5.000 millones de COP y trámites de homologación de 18 a 24 meses.

---

### 2.3 Diagnóstico Societario y Comercial Actual

1. **Estado de Personería Jurídica:**
   - La plataforma no cuenta actualmente con Registro Único Tributario (RUT) empresarial ni sociedad formalmente constituida en Cámara de Comercio de Colombia.
   - El fundador se encuentra en proceso de estructuración de una personería jurídica extranjera (.inc) o corporación sin ánimo de lucro.
   - Los activos totales de Dezzpo existen y residen en este repositorio bajo la forma de marca, código fuente, matriz legal, arquitectura de datos y base de usuarios.

2. **Estado con Pasarelas de Pago (ePayco):**
   - Se han sostenido acercamientos exploratorios preliminares con ePayco, pero la cuenta corporativa de agregación / adquirencia multidestino (Split Payments) **no está habilitada ni activa**.
   - No es viable jurídicamente firmar contratos de split payments o corresponsalía digital antes de contar con la personería jurídica definitiva y el RUT homologado ante la DIAN.

---

### 2.4 Solución en Producción: Modelo D (Escrow Lógico sin Fondos)

Para entregar de inmediato el valor central de confianza sin incurrir en riesgos legales ni demoras burocráticas, Comunidad Dezzpo opera bajo el **Modelo D de Custodia**:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        MODELO D: ESCROW LÓGICO / PROCEDIMENTAL                         │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 1. Contrato con Hitos Auditables (suma 100% de valor acordado).                        │
│ 2. Bitácora fotográfica diaria con stripping de EXIF/GPS en el dispositivo del cliente.│
│ 3. Acta de Recibo Parcial con firma electrónica bilateral (Ley 527 de 1999).           │
│ 4. La plataforma CERTIFICA el cumplimiento técnico del entregable.                     │
│ 5. El CLIENTE transfiere directamente el dinero pactado al CONTRATISTA.                │
│ 6. CERO fondos tocan las cuentas de Dezzpo · 100% exento de riesgo de captación.      │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

El 90% del conflicto en una obra surge del desacuerdo sobre si el trabajo se terminó correctamente o no. Al resolver la certificación probatoria del hito, se elimina la fricción sin manipular dinero de terceros.

---

### 2.5 Requisitos y Condiciones para Descongelar Fase 5 a Futuro

La Fase 5 únicamente se descongelará y someterá a desarrollo de integración API cuando se cumplan **todos** los siguientes prerrequisitos:

1. **Constitución Corporativa:** Obtención del Certificado de Existencia y Representación Legal de la sociedad operadora (.inc o SAS) y expedición de RUT ante la DIAN con actividad económica habilitada.
2. **Dictamen Legal Favorable:** Emisión de concepto escrito por parte de un abogado financiero especialista en fintech que certifique el esquema contractual de "Mandato de Recaudo y Dispersión sin Representación".
3. **Homologación Técnica y Comercial con Proveedor Vigilado:** Firma de contrato comercial con una entidad vigilada por la SFC (ej. ePayco Split Payments, Wompi Marketplace de Bancolombia, o SEDPE autorizada bajo la Ley 1735 de 2014).
4. **Umbral de Viabilidad Transaccional:** Que el volumen operado en Modelo D supere los **$30.000.000 COP mensuales** o al menos 25 contratos activos al mes, garantizando que el margen de la plataforma absorba los costos fijos de comisiones de dispersión, validación KYB y conciliación contable.

---

### 2.6 Directrices Obligatorias de Copywriting y Cumplimiento

1. **Términos Prohibidos en Interfaz y Comunicaciones:**
   - ❌ *"Fideicomiso Dezzpo"*
   - ❌ *"Dinero protegido en nuestras cuentas"*
   - ❌ *"Depósito bancario en custodia"*
   - ❌ *"Fiducia mercantil"*
2. **Términos Aprobados y Obligatorios:**
   - ✅ *"Validación de hitos de obra"*
   - ✅ *"Aprobación bilateral de entregas"*
   - ✅ *"Control procedimental de pagos por avance"*
   - ✅ *"Bitácora técnica certificada"*
