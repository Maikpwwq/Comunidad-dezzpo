# ACTUALIZACIÓN PRIORITARIA — Actor En-Obra para los dos directorios de Dezzpo

Esta instrucción amplía y modifica el prompt maestro anterior. Tiene prioridad sobre cualquier disposición que entre en conflicto con ella.

## 1. Arquitectura: separar el Actor de la aplicación Dezzpo

El proyecto principal Comunidad-Dezzpo-PWA está desarrollado en TypeScript, React y Vite. Su `package.json` ya incluye `@playwright/test` en las dependencias de desarrollo.

Se autoriza expresamente desarrollar el scraper con Python.

Crea un proyecto independiente:

```text
Comunidad-Dezzpo-PWA/
├── src/
├── server/
├── scripts/
├── tests/
├── public/
├── actors/
│   └── enobra-dezzpo-scraper/
│       ├── .actor/
│       ├── src/
│       ├── tests/
│       ├── selectors/
│       ├── pyproject.toml
│       ├── uv.lock
│       ├── Dockerfile
│       └── README.md
├── package.json
└── pnpm-lock.yaml
```

No mezcles dependencias Python con las dependencias de Node.

No modifiques innecesariamente `package.json`, `pnpm-lock.yaml`, la configuración de Vite ni las dependencias de producción de Dezzpo.

El Actor debe tener su propio entorno, dependencias, pruebas y ciclo de despliegue.

### Stack

- Python 3.11+.
- Apify SDK oficial para Python.
- Crawlee para Python.
- PlaywrightCrawler.
- Chromium.
- Pydantic v2.
- `phonenumbers`.
- `dnspython` para comprobaciones DNS y MX.
- `httpx` o cliente HTTP equivalente para comprobaciones técnicas.
- `tldextract` o solución equivalente para identificar dominios registrables.
- `pytest`.

Utiliza `uv` para mantener dependencias reproducibles.

### Persistencia

Configura Crawlee con `ApifyStorageClient` para que las colas, Dataset y Key-Value Store se almacenen en la infraestructura de Apify.

No mezcles dos sistemas de colas independientes. El `PlaywrightCrawler` debe administrar las solicitudes y la concurrencia mediante su gestor de peticiones y almacenamiento configurado.

Utiliza:

- Request Queue persistente por sesión de rastreo.
- Key-Value Store persistente para los registros maestros.
- Dataset para materializar resultados y generar exportaciones.
- Estado persistente para reanudación y auditoría.

No supongas que el almacenamiento local de Crawlee es persistente en la nube. Verifica en una prueba real que el Actor utiliza el backend de Apify.

## 2. Comprensión de los dos directorios de destino

El Actor debe reconocer dos destinos independientes.

### A. Directorio de Tiendas

https://www.dezzpo.com/app/tiendas

Objetivo: encontrar empresas que comercializan, distribuyen, importan, fabrican o venden materiales, insumos, herramientas, maquinaria, equipos y productos relacionados con construcción, remodelación y acabados.

Es prioritario identificar:

- Establecimientos comerciales.
- Distribuidores.
- Importadores.
- Fabricantes.
- Comercializadores mayoristas y minoristas.
- Tiendas especializadas.
- Empresas con atención comercial al público.
- Empresas con presencia física y cobertura identificable.

### B. Directorio de Profesionales y Comerciantes

https://www.dezzpo.com/app/portal-servicios

Objetivo: identificar profesionales, contratistas, empresas especializadas y comerciantes que puedan complementar el directorio de servicios.

Reconoce las categorías y atributos existentes en el portal:

- Tipo de inmueble.
- Tamaño de operación.
- Zona de cobertura.
- Categorías de servicios.
- Especialidades profesionales.
- Actividades comerciales relacionadas con la prestación de servicios.

Incluye profesionales independientes, contratistas, empresas técnicas y comerciantes que presten servicios especializados.

### Auditoría obligatoria del código fuente de Dezzpo

Antes de establecer correspondencias, inspecciona el repositorio y localiza:

- Constantes de categorías de tiendas.
- Constantes de categorías de servicios.
- Tipos y esquemas de los perfiles.
- Validaciones de formularios.
- Modelos de datos.
- Campos requeridos y opcionales.
- Filtros empleados en ambas páginas.
- Identificadores internos de categorías.
- Estructura y relaciones de los registros almacenados.

Prioriza el esquema real de la aplicación sobre una lista de categorías copiada manualmente del HTML público.

No modifiques ninguna estructura de datos del producto.

Construye dos taxonomías de destino versionadas y separadas, basadas en los valores reales de Dezzpo.

## 3. Clasificación de proveedores

Conserva las cuatro clasificaciones originales:

- `comercio_insumos`
- `profesional_servicio`
- `mixto_revisar`
- `indeterminado`

No las sustituyas por una clasificación binaria.

Además, agrega:

```json
{
    "destinos_dezzpo": [],
    "categorias_tiendas_sugeridas": [],
    "categorias_servicios_sugeridas": [],
    "motivo_asignacion_destino": [],
    "confianza_asignacion": null
}
```

Valores permitidos para `destinos_dezzpo`:

- `tiendas`
- `portal_servicios`

Un mismo registro puede pertenecer a ambos destinos.

Reglas:

1. Un distribuidor o importador de materiales se propone para tiendas.
2. Un profesional cuya actividad es ejecutar trabajos en inmuebles se propone para portal de servicios.
3. Una empresa que comercializa productos y ofrece instalación puede corresponder a ambos.
4. Los casos mixtos requieren revisión humana.
5. Los indeterminados quedan pendientes.
6. No descartes registros por falta de información.
7. No asignes categorías sin evidencia.

El campo `tipo_registro` no debe confundirse con `destinos_dezzpo`.

## 4. Estrategia de selección: primero cobertura, después profundidad

No limites la extracción a los primeros proveedores ni a los mejor calificados por reseñas.

Utiliza dos etapas de selección:

### Etapa A: descubrimiento general

Recorre el universo de páginas permitido y registra cada proveedor identificado.

Extrae, como mínimo:

- ID o URL.
- Nombre.
- Categorías.
- Descripción disponible.
- Calificación.
- Número de reseñas.
- Ciudad o ubicación.
- URL del perfil.

Guarda los registros originales.

### Etapa B: extracción profunda

Visita las fichas individuales de los proveedores descubiertos para completar los datos faltantes.

La política predeterminada será `all`: visitar todos los perfiles públicos y permitidos que hayan sido descubiertos.

Cuando exista una limitación de recursos o de acceso, se podrá utilizar `prioritized`, en cuyo caso se visitarán primero los perfiles con afinidad potencial a cualquiera de los dos directorios.

En modo `prioritized`:

- Calcula afinidad preliminar con los campos del listado.
- Considera tanto comercios como profesionales.
- Incluye los registros mixtos y ambiguos para revisión.
- No utilices la cantidad de reseñas como único criterio de selección.
- Mantén los registros sin visita individual con su estado explícito.
- No declares esos registros como completos.

Nunca confundas una ficha incompleta en el listado con una empresa que carece de información. Puede disponer de información adicional en su perfil.

## 5. Auditoría técnica de sitios web empresariales

Implementa un módulo denominado `website_validation`.

Cuando un proveedor publique una página web, el Actor debe poder comprobar su accesibilidad y coherencia comercial.

Parámetro:

```json
{
    "validateCompanyWebsite": true,
    "maxWebsitePages": 2,
    "websiteValidationTimeoutSeconds": 20
}
```

La comprobación será independiente de los datos extraídos de En-Obra.

### A. Identificación del sitio

Comprueba:

- Formato de URL.
- Esquema HTTP/HTTPS.
- Resolución DNS.
- Certificado TLS cuando se utilice HTTPS.
- Estado HTTP.
- Redirecciones.
- URL final.
- Dominio registrable.
- Título HTML.
- Meta description.
- Nombre de empresa publicado.
- Actividad comercial.
- Información de contacto.
- Dirección publicada.
- Datos estructurados `Organization` o `LocalBusiness`, cuando existan.
- Enlaces a páginas de contacto o información empresarial.

Clasifica el tipo de presencia digital:

- `sitio_web_empresarial`
- `landing_page`
- `pagina_social`
- `directorio_tercero`
- `dominio_aparcado`
- `sitio_inaccesible`
- `url_invalida`
- `sin_sitio_web`

No clasifiques automáticamente una red social como sitio web corporativo.

### B. Validación de identidad

Compara los datos extraídos de En-Obra con los publicados en el sitio empresarial.

Contrasta:

1. Nombre empresarial y nombre comercial.
2. Actividad económica.
3. Productos o servicios.
4. Teléfono público.
5. Correo corporativo.
6. Ciudad y dirección.
7. Marcas distribuidas, cuando se publiquen.

Registra el resultado:

- `coincidencia_fuerte`
- `coincidencia_parcial`
- `posible_discrepancia`
- `sin_evidencia_suficiente`

La ausencia de un campo en la página web no implica que los datos de En-Obra sean incorrectos.

Una diferencia de marca comercial frente a razón social requiere análisis, no descarte automático.

### C. Validación del correo electrónico

Para cada correo público:

- Verifica sintaxis.
- Normaliza el dominio.
- Comprueba DNS.
- Comprueba si existen registros MX.
- Verifica si el dominio corresponde al sitio empresarial, cuando aplique.
- Conserva la página de procedencia.

No envíes correos de prueba.
No realices verificaciones SMTP de buzones.
No deduzcas direcciones de correo.
No afirmes que un buzón existe o recibe mensajes por el mero hecho de tener registros MX.

### D. Validación del teléfono

- Comprueba formato y normalización.
- Conserva el número original.
- Comprueba consistencia entre las fuentes.
- Distingue un teléfono corporativo, un número publicado en redes y un dato sin corroborar.
- No llames.
- No envíes mensajes.
- No pulses botones de revelar teléfono.

La normalización E.164 no significa que el teléfono esté activo ni que pertenezca legalmente a la empresa.

### E. Seguridad al consultar dominios externos

Los sitios web de los proveedores son entradas externas no confiables.

Implementa controles contra SSRF:

- Solo HTTP y HTTPS.
- Bloqueo de localhost, IP privadas, loopback, link-local y rangos reservados.
- Bloqueo de direcciones de metadatos cloud.
- Verificación DNS antes de conectar.
- Validación de las redirecciones y del destino de cada salto.
- Restricción a puertos web habituales.
- Límites de tamaño y tipos MIME.
- Timeouts.
- Protección contra cambios de IP entre resolución y conexión.
- No seguir enlaces hacia dominios arbitrarios.

Consulta y respeta robots.txt de cada dominio.

Limita el enriquecimiento a la página inicial y, si existe un enlace claramente identificado, a la página pública de contacto o información empresarial.

No realices un rastreo general de toda la web empresarial.

Si una web está bloqueada, deshabilitada o restringe el rastreo, conserva los datos de En-Obra y registra la limitación.

## 6. Esquema separado de validación

Agrega estos campos sin alterar los datos originales:

```json
{
    "validacion_web": {
        "url_normalizada": null,
        "url_final": null,
        "dominio": null,
        "tipo_sitio": null,
        "resuelve_dns": null,
        "https_valido": null,
        "estado_http": null,
        "titulo_pagina": null,
        "nombre_detectado": null,
        "actividad_detectada": null,
        "coincidencia_identidad": null,
        "evidencias": [],
        "fecha_validacion": null
    },
    "validacion_contacto": {
        "email_sintaxis_valida": null,
        "email_dominio_mx": null,
        "email_coincide_dominio_web": null,
        "telefono_formato_valido": null,
        "telefono_corrobora_fuente": null,
        "evidencias": []
    },
    "estado_verificacion": null
}
```

`estado_verificacion` puede adoptar:

- `corroboracion_fuerte`
- `corroboracion_parcial`
- `requiere_revision`
- `sin_verificar`

No utilices `empresa_verificada` para indicar únicamente que la web funciona.

La validación de identidad digital no equivale a una validación jurídica de existencia, matrícula mercantil o habilitación comercial.

## 7. Sistema de selección y priorización

El objetivo de Dezzpo es mantener directorios útiles, con buenos proveedores y atención comercial identificable, no simplemente acumular registros.

Por tanto, implementa cinco indicadores independientes.

### A. Afinidad con tiendas

`score_afinidad_tiendas` de 0 a 100.

Valora:

- Correspondencia con categorías de tiendas.
- Comercialización, distribución o importación.
- Productos, marcas y líneas de negocio documentadas.
- Evidencia de establecimiento o canal de venta.

### B. Afinidad con portal de servicios

`score_afinidad_servicios` de 0 a 100.

Valora:

- Correspondencia con categorías de servicios.
- Especialidades y trabajos documentados.
- Tipo de inmueble y ámbito de operación cuando exista.
- Cobertura geográfica publicada.

### C. Completitud del perfil

`score_completitud` de 0 a 100.

Valora la presencia y calidad de:

- Nombre.
- Descripción.
- Categorías y especialidades.
- Sitio web.
- Correo.
- Teléfono.
- Dirección.
- Ciudad.
- Redes sociales.
- Horarios.
- Zonas de cobertura.
- Información de operación.

Los campos no publicados no deben inventarse.

Diferencia entre campo ausente, no accesible, oculto y no aplicable.

### D. Consistencia de identidad

`score_coherencia_identidad` de 0 a 100.

Valora:

- Coincidencia de nombre comercial.
- Correspondencia de actividad.
- Coincidencia de teléfono y correo.
- Coincidencia geográfica.
- Evidencias de identidad empresarial desde el sitio web.

Registra también las discrepancias.

### E. Información de atención

`score_atencion_documentada` de 0 a 100.

Prioriza empresas con:

- Teléfono publicado.
- Correo público.
- WhatsApp público.
- Dirección identificable.
- Horarios de atención.
- Sitio web con información de servicio al cliente.
- Cobertura geográfica definida.

No interpretes la existencia de canales de contacto como prueba de respuesta efectiva, capacidad disponible o buena atención.

La disponibilidad real requiere verificación posterior y autorizada.

### F. Prioridad independiente por directorio

Genera:

```json
{
    "prioridad_tiendas": null,
    "prioridad_portal_servicios": null,
    "prioridad_revision": null,
    "motivos_prioridad": []
}
```

Valores de prioridad:

- `alta`
- `media`
- `baja`
- `revision`
- `no_aplica`

No combines todos los indicadores en un único puntaje que oculte sus diferencias.

Un proveedor puede tener alta afinidad comercial, pero información incompleta. Otro puede tener excelentes datos y poca afinidad con Dezzpo.

El sistema debe permitir identificar ambos casos.

Los registros mixtos e indeterminados requieren revisión manual.

La calificación y las reseñas de En-Obra serán señales adicionales de reputación, nunca prueba suficiente de confiabilidad. Conserva el promedio y el número de reseñas por separado.

## 8. Comparación con los registros existentes en Dezzpo

Es importante evitar que la extracción genere duplicados o incorpore negocios que ya están suficientemente representados en el catálogo.

Inspecciona los modelos de datos y filtros existentes para ambos directorios.

Implementa un comparador con el inventario existente de:

- Tiendas registradas.
- Profesionales y comerciantes registrados.

La comparación debe ser de solo lectura.

Fuentes posibles:

1. Un archivo de exportación CSV o JSON autorizado del catálogo existente.
2. Un mecanismo de consulta de solo lectura expresamente autorizado.
3. Un conjunto de datos de prueba anonimizado que represente el catálogo actual.

No uses credenciales de producción ni realices escrituras en Firebase o Supabase durante la extracción.

Genera:

```json
{
    "posible_duplicado": null,
    "registro_dezzpo_coincidente": null,
    "confianza_coincidencia": null,
    "motivos_coincidencia": [],
    "oportunidad_catalogo": null
}
```

Distingue:

- Registro nuevo.
- Posible duplicado.
- Duplicado confirmado.
- Misma empresa con otra sede.
- Empresa relacionada o perteneciente a la misma marca.
- Coincidencia no concluyente.

No descartes automáticamente dos establecimientos de una misma cadena: pueden ser sedes comerciales distintas.

### Oportunidad de incorporación

Considera:

- Si ya existe una tienda de la misma especialidad.
- Si existe otro proveedor de la misma marca.
- Si la empresa agrega cobertura geográfica.
- Si amplía la variedad de productos.
- Si aporta una especialidad no representada.
- Si ofrece un canal de atención más completo.

No presupongas que una categoría con una tienda existente ya está cubierta de forma suficiente.

El propósito es encontrar oportunidades reales para complementar los dos directorios.

## 9. Salida estructurada para Dezzpo

Mantén un registro maestro con los datos originales y las capas adicionales.

Genera tres exportaciones:

```text
output/
├── proveedores_maestro.jsonl
├── candidatos_tiendas.json
├── candidatos_tiendas.csv
├── candidatos_portal_servicios.json
├── candidatos_portal_servicios.csv
├── candidatos_mixtos_revision.json
├── auditoria_sitios_web.json
├── posibles_duplicados.json
└── informe_calidad.md
```

Los exportadores de cada directorio deben generar registros de candidatos con un contrato compatible con los modelos de datos que realmente utiliza Dezzpo.

No incluyas automáticamente todos los campos de En-Obra en un modelo de perfil de Dezzpo. Genera un mapeo explícito de campos de origen a campos de destino.

Todos los datos originales deben quedar disponibles en el registro maestro.

Ningún candidato debe publicarse o registrarse automáticamente.

La futura incorporación a Dezzpo tendrá su propio procedimiento de revisión y aprobación.

## 10. Nuevos parámetros del Actor

Incorpora al INPUT_SCHEMA:

| Parámetro                         | Tipo               | Predeterminado |
| --------------------------------- | ------------------ | -------------- |
| `detailStrategy`                  | enum               | `all`          |
| `validateCompanyWebsite`          | boolean            | `true`         |
| `maxWebsitePages`                 | integer            | `2`            |
| `websiteValidationTimeoutSeconds` | integer            | `20`           |
| `classifyProviders`               | boolean            | `true`         |
| `mapDezzpoCategories`             | boolean            | `true`         |
| `calculateScores`                 | boolean            | `true`         |
| `compareExistingCatalog`          | boolean            | `false`        |
| `existingStoresFile`              | file/key reference | null           |
| `existingServicesFile`            | file/key reference | null           |
| `exportByDestination`             | boolean            | `true`         |

Los nuevos módulos deben poder ejecutarse nuevamente sobre los registros persistidos sin tener que volver a extraer información de En-Obra.

Por ejemplo, permitir recalcular categorías y puntuaciones usando una nueva taxonomía de Dezzpo sin repetir el rastreo original.

## 11. Auditoría final ampliada

Además de las métricas del prompt original, presenta:

- Empresas potenciales para tiendas.
- Empresas potenciales para portal de servicios.
- Empresas mixtas.
- Coincidencias posibles con negocios existentes.
- Nuevas oportunidades por categoría.
- Empresas con sitio web accesible.
- Empresas con identidad digital coincidente.
- Sitios web inaccesibles.
- Correos con sintaxis válida.
- Dominios con registros MX.
- Teléfonos normalizables.
- Empresas con dirección contrastada.
- Empresas con información de horarios.
- Empresas con información de atención comercial publicada.
- Registros con alta completitud.
- Registros con alta afinidad comercial.
- Registros que requieren revisión.

Muestra separadamente el volumen total del universo extraído y el subconjunto que cumple condiciones para cada destino.

Incluye una muestra de al menos cinco registros de calidad alta y cinco que requieren revisión, con evidencias que expliquen la diferencia.

## 12. Ciclo obligatorio de revisión

Antes de declarar finalizado el proyecto:

1. Inspecciona el código fuente de Dezzpo.
2. Audita las taxonomías y modelos de datos reales.
3. Inspecciona En-Obra.
4. Construye y valida el Actor.
5. Ejecuta la prueba de humo.
6. Audita la integridad de los datos originales.
7. Comprueba la validación de sitios web.
8. Verifica la clasificación para ambos directorios.
9. Ejecuta el comparador contra un inventario autorizado de Dezzpo, si está disponible.
10. Simula interrupción y reanudación.
11. Audita posibles falsos positivos de clasificación y validación.
12. Corrige los problemas detectados y vuelve a probar.

**No alteres la aplicación Dezzpo, no publiques candidatos y no escribas en la base de datos de producción.**

La entrega principal es una base comercial enriquecida, organizada y priorizada, con evidencia de su procedencia y calidad.

**Criterio rector: seleccionar empresas que aporten cobertura, variedad, información verificable y canales de atención documentados, no simplemente acumular proveedores.**
