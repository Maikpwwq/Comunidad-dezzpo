# Comunidad Dezzpo — Base de Conocimiento Central

> Este archivo es el System of Record de conocimiento RAG para el Chatbot oficial de Comunidad Dezzpo.
> Cada sección encabezada por `##` se indexa como un vector semántico independiente en Supabase (`dezzpo_documents`).
> Para re-indexar la memoria, ejecuta: `npx tsx scripts/seed-knowledge.ts`

---

## Información General y Canales de Contacto

- **Nombre Oficial:** Comunidad Dezzpo Inc.
- **Sitio Web Principal:** https://dezzpo.com
- **Dominio de Despliegue:** https://comunidad-dezzpo.vercel.app
- **Teléfono / WhatsApp Oficial:** +57 320 484 2897
- **Enlace de WhatsApp Directo:** https://wa.me/573204842897
- **Correo Electrónico de Soporte:** comunidad.dezzpo@gmail.com
- **Dirección Física:** Calle 159 No. 8c-45, Piso 5, Bogotá, Colombia
- **Ubicación en Google Maps:** https://maps.google.com/?q=Calle+159+No+8c-45+Bogota
- **Horario de Atención:** Lunes a Viernes, 8:00 AM - 6:00 PM (Hora Colombia, UTC-5)
- **Año de Fundación:** 2022
- **Copyright:** © 2026 Comunidad Dezzpo Inc. Todos los derechos reservados.

---

## ¿Qué es Comunidad Dezzpo?

Comunidad Dezzpo es la red profesional digital líder en Colombia especializada en el sector de hábitat, construcción, mantenimiento residencial y propiedad horizontal. Opera con una arquitectura tipo LinkedIn pero verticalizada y diseñada a la medida de la industria inmobiliaria y de reformas.

**Propósito Central:**
Conectar a propietarios, residentes, administradores de conjuntos residenciales y empresas con comerciantes, maestros de obra, técnicos y empresas de ingeniería verificadas. Proporciona herramientas completas de contratación segura, contratos inteligentes con anticipos protegidos (ePayco), calificaciones transparentes, directorio de proveedores de insumos y perfiles profesionales con micrositio público.

**Misión:**
Trabajamos para las personas, destacándonos por la calidad del servicio al cliente, el crecimiento continuo del ser y la gestión tecnológica. Somos una Comunidad de Comerciantes Calificados en mantenimiento general doméstico, obras y acabados, brindando gestión oportuna del talento humano adecuado.

**Visión:**
Ser la marca colombiana posicionada y referente de consulta indispensable para la gestión en proyectos de mantenimiento, hábitat y propiedad horizontal, ofreciendo una propuesta de valor de alta confianza para comerciantes y propietarios.

**Política Integral HSEQ:**
Propendemos por mitigar el impacto ambiental y garantizar la seguridad laboral. Usamos controles, técnicas y productos de alta calidad, asegurando la satisfacción del cliente y el cumplimiento estricto de las normas de Seguridad y Salud en el Trabajo (SST y ARL en Colombia).

---

## Catálogo Oficial de 92 Especialidades y Servicios

Comunidad Dezzpo cuenta con una taxonomía oficial de 92 especialidades técnicas de construcción, mantenimiento, ingeniería y hábitat:

1. **Ingeniería y Estudios Técnicos Especializados:** Cálculos y Diseños de Ingeniería (estructural NSR-10, hidrosanitario, eléctrico RETIE), Topografía y Agrimensura, Estudios de Suelos y Geotecnia, Energía Solar y Fotovoltaica, Peritajes Técnicos y Avalúos Estructurales, Diseño 3D y Renders Arquitectónicos.
2. **Obra Civil y Acabados:** Construcción Civil, Albañilería, Oficial de Obra, Mampostería, Drywall y Superboard, Cielos Rasos, Estuco y Pintura Arquitectónica, Enchapes, Porcelanatos, Cerámicas, Pisos Laminados, Pulido y Cristalizado de Pisos.
3. **Instalaciones Técnicas y Redes:** Plomería y Redes Hidrosanitarias, Detección de Fugas con Geófono, Electricidad Residencial e Industrial, Tableros y Acometidas Eléctricas, Redes de Gas y Calentadores (instalación y mantenimiento), Aire Acondicionado y Climatización (HVAC), Cableado Estructurado y Redes de Voz y Datos.
4. **Carpintería, Cerrajería y Metalmecánica:** Carpintería Fina y Muebles Modulares, Closets y Cocinas Integrales, Cerrajería Tradicional y Digital, Puertas Automáticas y Motores Vehiculares, Ornamentación y Forja Artística, Perfiles de Hierro y Estructuras Metálicas, Vidrios y Aluminio Arquitectónico, Vidrio Templado y Fachadas Flotantes.
5. **Techos, Impermeabilización y Aislamiento:** Impermeabilización de Terrazas, Cubiertas y Techos Termoacústicos, Mantenimiento de Tejas y Canales, Aislamiento Acústico y Térmico.
6. **Mantenimiento y Administración de Propiedad Horizontal:** Administración de PH, Mantenimiento de Bombas Eyectoras y de Presión, Mantenimiento de Plantas Eléctricas, Piscinas y Zonas Húmedas, Jardinería y Paisajismo, Fumigación y Control de Plagas Certificado, Aseo y Desinfección Profesional, Mantenimiento de Ascensores.
7. **Seguridad y Automatización:** Cámaras de Seguridad y CCTV, Alarmas y Sensores, Control de Acceso Biométrico y Vehicular, Domótica y Smart Home, Redes Contra Incendio y Extintores.

---

## Selección de Categorías y Sugerencias de Nuevas Especialidades

- **Bandeja de Selección (Chips):** Los comerciantes pueden seleccionar hasta 4 especialidades principales para destacar en su perfil público y en los resultados del directorio (`/app/ajustes`).
- **Motor de Búsqueda Dinámico:** Búsqueda en tiempo real con normalización de tildes y sinónimos técnicos.
- **Sugerencia de Nuevas Categorías:** Si un profesional ofrece un servicio técnico no listado, puede enviar una propuesta formal mediante el modal *"Sugerir nueva categoría"*. El sistema evalúa duplicados y envía la solicitud a la colección `suggestedCategories` para revisión y aprobación administrativa.

---

## Registro y Autenticación con Teléfono Celular (SMS OTP)

Comunidad Dezzpo ofrece un sistema de registro e inicio de sesión moderno y sin fricción mediante **número de teléfono celular**:

1. **Sin Contraseña Obligatoria:** El usuario solo ingresa su número móvil de Colombia (+57).
2. **Código de Verificación SMS OTP:** Recibe un código numérico seguro de 6 dígitos que se autoverifica al instante.
3. **Vinculación Inteligente de Cuentas (`findUserByPhone`):** Si un usuario ya se había registrado previamente con Google o correo electrónico y luego inicia sesión con su número celular, la plataforma detecta automáticamente su perfil existente en Firestore y vincula la sesión sin duplicar cuentas ni perder su historial o contratos.
4. **Métodos de Acceso Soportados:** Teléfono Celular (+57 OTP), Cuenta de Google (SSO) y Correo Electrónico con Contraseña.

URLs de Acceso:
- **Registro:** https://dezzpo.com/registro
- **Ingreso:** https://dezzpo.com/ingreso

---

## Directorio de Tiendas, Ferreterías y Proveedores de Materiales

El Directorio de Tiendas de Comunidad Dezzpo (`/tiendas` y `/app/tiendas`) conecta a comerciantes, constructores y propietarios con los mejores proveedores locales de materiales, herramientas, equipos y suministros.

**Funcionalidades del Directorio:**
- Directorio geolocalizado en Bogotá y municipios de la Sabana.
- Filtros por categoría especializada de insumos, zona o palabra clave.
- Ficha completa de cada tienda con dirección, horarios de atención, teléfonos de contacto directo, WhatsApp y botón de ubicación en Google Maps.
- Indicador de tienda verificada por el equipo de Comunidad Dezzpo.

URLs de Acceso:
- **Directorio Público de Tiendas:** https://dezzpo.com/tiendas
- **Directorio dentro de la App:** https://dezzpo.com/app/tiendas

---

## Categorías Especializadas de Tiendas y Suministros

El directorio de proveedores clasifica a las tiendas en 17 categorías especializadas (`ListadoCategoriasTiendas.ts`):

1. **Ferreterías General:** Herramientas manuales, tornillería, chazos, fijaciones y suministros generales.
2. **Venta de Pinturas e Insumos:** Vinilos, esmaltes, estuco plástico, brochas, rodillos y diluyentes.
3. **Perfilería y Aluminio:** Perfiles extruidos, rieles y accesorios para ventanería.
4. **Vidrios y Cristalería:** Vidrio templado, laminado, espejos y herrajes de sujeción.
5. **Alquiler y Venta de Andamios:** Andamios tubulares, multidireccionales, trompos y cortadoras de ladrillo.
6. **Servicio Técnico de Herramientas:** Mantenimiento y repuestos para taladros, pulidoras y rotomartillos.
7. **Cerrajería (Insumos y Chapas):** Cerraduras de alta seguridad, cilindros, candados y duplicados.
8. **Tubería y Accesorios PVC:** Tubería sanitaria, de presión, conduit y pegantes PVC.
9. **Materiales y Equipos Eléctricos:** Cableado THHN, breakers, tableros de distribución y tomacorrientes.
10. **Iluminación y Lámparas:** Paneles LED, reflectores para intemperie, lámparas colgantes y tiras LED.
11. **Gases Industriales y Soldadura:** Oxígeno, argón, electrodos, caretas fotosensibles e inversores.
12. **Cerámicas, Porcelanatos y Pisos:** Baldosas, pisos laminados, SPC, pegantes (Pegacor) y boquillas.
13. **Inoxidables:** Láminas, tubos y accesorios en acero inoxidable 304 y 316.
14. **Mallas Metálicas:** Malla eslabonada, ondulada, electrosoldada y concertinas de seguridad.
15. **Puertas y Portones:** Puertas en madera maciza, metálicas, cortafuego y de seguridad.
16. **Transmisión de Potencia:** Rodamientos, poleas, correas industriales, cadenas y piñones.
17. **Depósitos de Materiales:** Cemento, arena, gravilla, ladrillo tolete, bloque estructural y drywall.

---

## Publicación y Registro de Tiendas para Proveedores

Cualquier fabricante, distribuidor mayorista, depósito de materiales o ferretería local puede registrar su negocio en Comunidad Dezzpo:

1. **Formulario de Registro:** Desde `/app/tiendas` hacer clic en *"Registrar Tienda"*.
2. **Datos Requeridos:** Nombre comercial, razón social, NIT o documento, categoría especializada, dirección exacta, barrio, localidad/municipio, teléfonos de contacto, WhatsApp, horario y catálogo o fotos del establecimiento.
3. **Flujo de Moderación:** La tienda se crea con estado `pendiente` y es evaluada por el equipo administrativo en `/admin/tiendas`. Una vez verificada su autenticidad, pasa a estado `aprobado` y se publica inmediatamente en el directorio nacional.

---

## Cómo Funciona — Para Propietarios y Administradores

1. **Registro Gratuito:** Crea tu cuenta con número de celular (+57), Google o correo en https://dezzpo.com/registro.
2. **Publica tu Proyecto:** Ingresa a https://dezzpo.com/presupuestos o https://dezzpo.com/app/nuevo-proyecto y describe tu requerimiento en 4 sencillos pasos.
3. **Recibe Propuestas:** Comerciantes y empresas calificadas de tu zona recibirán tu proyecto y te enviarán cotizaciones formales.
4. **Compara y Elige:** Revisa perfiles, experiencia, fotos de trabajos anteriores, insignia de certificación Dezzpo y calificaciones de otros propietarios.
5. **Contrato y Anticipo Seguro:** Acepta la propuesta y paga el anticipo convenido mediante ePayco para blindar el inicio de la obra.
6. **Calificación Final:** Al terminar el trabajo, califica al comerciante en cumplimiento, calidad y soporte.

---

## Cómo Funciona — Para Comerciantes y Contratistas

1. **Registro Gratuito:** Regístrate como Comerciante Calificado en https://dezzpo.com/registro seleccionando tu rol.
2. **Completa tu Perfil Profesional:** Agrega tus especialidades (hasta 4 categorías), años de experiencia, zona de cobertura, portafolio de fotos y datos de contacto.
3. **Obtén tu Micrositio Comercial:** Recibe tu URL personalizada (ej: `dezzpo.com/app/perfil/Tu-Nombre-Comercial`) para compartir como tarjeta de presentación digital.
4. **Postúlate a Requerimientos:** Revisa las solicitudes de trabajo publicadas por propietarios en `/app/directorio-requerimientos` y envía cotizaciones competitivas.
5. **Solicita Certificación Dezzpo:** Agenda tu visita técnica presencial para obtener la insignia de validación de habilidades y estatus destacado.
6. **Cobra Anticipos con ePayco:** Establece requerimientos de anticipo (Upfront Deposits) para compra de materiales sin arriesgar tu liquidez operativa.

---

## Micrositios de Perfil Comercial y Tarjeta de Presentación Digital

Cada usuario y comerciante en Comunidad Dezzpo cuenta con un micrositio público indexable y accesible mediante múltiples estrategias de URL:

**Estructura de URLs Disponibles:**
- **URL Comercial Canónica (Recomendada):** `https://dezzpo.com/app/perfil/[nombre-comercial-slug]` (Ej: `https://dezzpo.com/app/perfil/Dezzpo-Profesionales-Calificados`).
- **URL por Razón Social:** `https://dezzpo.com/app/perfil/Comunidad-Dezzpo`.
- **URL con Vanity Prefix:** `https://dezzpo.com/app/perfil/@Dezzpo-Profesionales-Calificados`.
- **URL Técnica por UID:** `https://dezzpo.com/app/perfil/pbEr6iR3LjOOsYISvBEkZfwdXlx2`.

**Tarjeta Interactiva "Mi Micrositio Dezzpo":**
Dentro de la sección *Datos de contacto* de cada perfil, se incluye un componente interactivo que muestra la URL amigable y un botón de copiado en 1 clic para compartir por WhatsApp, correo o redes sociales como tarjeta de presentación profesional.

---

## Certificación Dezzpo de Habilidades Técnicas

La Certificación Dezzpo es el sello de confianza y validación técnica presencial que distingue a los mejores comerciantes de la plataforma:

1. **Solicitud en Línea:** El comerciante selecciona la especialidad a certificar y agenda la fecha de visita desde `/app/certificaciones`.
2. **Inversión:** Tasa de inspección técnica fijada en `$290.000 COP` por especialidad (pago seguro vía ePayco).
3. **Visita Técnica en Terreno:** Un evaluador calificado inspecciona: diplomas o certificaciones SENA/universitarias, dotación, herramientas especializadas, protocolos de seguridad y destreza en obra.
4. **Otorgamiento de Insignia:** Tras la aprobación administrativa, el comerciante recibe la insignia verificada en su perfil y pasa a estatus `profileTier: 'destacado'`, multiplicando su visibilidad y preferencia de contratación.

---

## Sistema de Calificaciones y Reputación Profesional

El sistema de reputación de Comunidad Dezzpo es 100% transparente y se basa en tres criterios objetivos calificados por el propietario:

1. **Cumplimiento de Tiempos:** Entrega del servicio en las fechas y horarios acordados.
2. **Calidad y Competencia Técnica:** Cumplimiento de normas técnicas de construcción y suficiente personal idóneo.
3. **Soporte y Documentación:** Entrega oportuna de cuentas de cobro, facturas, garantías y soportes.

El promedio se refleja en el perfil público mediante estrellas (1 a 5) y comentarios verificados.

---

## Contratos Inteligentes, Pagos Seguros y Anticipos (Upfront Deposits)

Comunidad Dezzpo elimina la informalidad y los incumplimientos en la contratación de obras mediante contratos vinculados a la pasarela de pagos ePayco:

**Ciclo de Vida del Contrato:**
`pending_payment` $\rightarrow$ `active` $\rightarrow$ `completed` (o `disputed` en caso de mediación).

**Arquitectura de Anticipos (Upfront Deposits):**
- El comerciante puede exigir un anticipo porcentual o fijo al enviar su cotización.
- Al aceptar la oferta, el propietario paga el monto del anticipo con tarjeta de crédito, débito, PSE, Nequi o Daviplata a través de ePayco.
- El pago del anticipo activa formalmente el contrato y genera una orden de trabajo con soporte legal para ambas partes.

---

## Clasificación, Categorías y Niveles de Usuarios

La plataforma clasifica a los usuarios según su tamaño y experiencia (`/clasificacion-usuarios`):

**Comerciantes Calificados:**
- **Clasificación:** Persona Natural, Emergente, PyME de Servicios, Gacela, Tractora, Escalable.
- **Categoría (Membresía):** Hierro I-III, Bronce, Plata, Oro, Platino, Diamante, Black Diamond.
- **Gradación:** Aprendiz, Oficial, Maestro Constructor, Gran Maestro.

**Propietarios y Clientes:**
- **Clasificación:** Hogar, Negocio, Propiedad Horizontal, Inmobiliaria, Aliado.
- **Categoría:** Básico, Plus, Premium, VIP, Black.
- **Gradación:** Miembro Activo, Vecino Confiable, Referente Comunitario, Embajador Dezzpo.

---

## Programa de Referidos "Voz a Voz"

El programa de recompensas de Comunidad Dezzpo (`/app/invitar-amigos`) premia a los miembros que hacen crecer la comunidad:

- **+50 Puntos:** Cuando un amigo o colega se registra usando tu enlace o código de referido.
- **+200 Puntos:** Cuando tu referido completa su primer contrato formal en la plataforma.
- **Canje de Puntos:** Los puntos acumulados se canjean por cupones de descuento, saldo en membresías y beneficios del catálogo de recompensas (`src/config/referrals.config.ts`).

---

## Presupuestos y Solicitud de Servicios (Flujo de Requerimientos)

La página de Presupuestos (https://dezzpo.com/presupuestos) es el canal guiado para solicitar cotizaciones sin costo:

1. **Paso 1:** Selecciona el tipo de proyecto (mantenimiento, remodelación, obra civil o ingeniería).
2. **Paso 2:** Selecciona la categoría del profesional requerido.
3. **Paso 3:** En el formulario de nuevo proyecto (`/app/nuevo-proyecto`), define alcance, fotos del área y ubicación.
4. **Paso 4:** Programa la fecha y franja horaria preferida para la visita o recepción de ofertas.

---

## Asesorías Comunitarias y Foro Técnico

En la sección de Asesorías (https://dezzpo.com/asesorias), propietarios y profesionales interactúan en un foro técnico abierto:
- Publicar dudas sobre reparaciones, materiales, normas de construcción o propiedad horizontal.
- Respuestas de comerciantes y expertos de la comunidad.
- Votación comunitaria de respuestas más útiles.

---

## Blog Especializado y Contenido Inbound

El Blog de Comunidad Dezzpo (https://dezzpo.com/blog) ofrece guías prácticas, manuales de remodelación, normatividad de propiedad horizontal y consejos de seguridad laboral clasificados en tres pestañas:
- **Para Propietarios:** Guías de mantenimiento y selección de contratistas.
- **Para Comerciantes:** Estrategias de precios, marketing y certificación.
- **General:** Tendencias del sector y normatividad colombiana.

---

## Cobertura Geográfica (Bogotá y Sabana de Cundinamarca)

Comunidad Dezzpo ofrece cobertura completa centralizada en `ListadoZonas.ts`:

- **20 Localidades de Bogotá:** Usaquén, Chapinero, Santa Fe, San Cristóbal, Usme, Tunjuelito, Bosa, Kennedy, Fontibón, Engativá, Suba, Barrios Unidos, Teusaquillo, Los Mártires, Antonio Nariño, Puente Aranda, La Candelaria, Rafael Uribe Uribe, Ciudad Bolívar, Sumapaz.
- **11 Municipios Metropolitanos de la Sabana:** Soacha, Chía, Cajicá, Zipaquirá, Cota, Funza, Mosquera, Madrid, Facatativá, La Calera, Sopó.

---

## Tarifas, Membresías y Estructura de Precios

Configuradas centralizadamente en `src/config/pricing.config.ts`:
- **Registro y Uso Básico:** 100% Gratuito para Propietarios y Comerciantes.
- **Membresía Anual Comerciante Destacado:** `$150.000 COP / año`.
- **Certificación de Validación Técnica:** `$290.000 COP` por especialidad (incluye visita presencial y sello verificado).
- **Inspección Técnica de Inmuebles para Propietarios VIP+:** Formulario in-app en `/app/suscripciones`.

---

## Documentos Legales y Políticas de Uso

Los documentos oficiales de Comunidad Dezzpo se encuentran disponibles para consulta pública en https://dezzpo.com/legal:

1. **Términos y Condiciones de Uso — Propietarios:** Normas de publicación de proyectos, pagos y garantías.
2. **Términos y Condiciones de Uso — Comerciantes Calificados:** Obligaciones de calidad, cumplimiento y seguridad social.
3. **Política de Tratamiento de Datos Personales y Privacidad (Ley 1581 de 2012 de Colombia):** Custodia y protección de datos.
4. **Política de Cookies y Seguridad de la Información:** Estándares de navegación segura y protección contra fraudes.

---

## Preguntas Frecuentes (FAQ)

### ¿Cuánto cuesta registrarse en Dezzpo?
El registro es 100% gratuito tanto para propietarios como para comerciantes y técnicos. No existen cobros ocultos por crear tu cuenta ni por cotizar proyectos.

### ¿Puedo registrarme solo con mi número de celular?
Sí. Puedes registrarte e iniciar sesión directamente con tu número móvil de Colombia (+57) recibiendo un código SMS de 6 dígitos, sin necesidad de ingresar contraseña.

### ¿Cómo encuentro tiendas de materiales o ferreterías cerca de mi obra?
Ingresa a https://dezzpo.com/tiendas para explorar el directorio con más de 17 categorías especializadas (pinturas, tubería PVC, perfiles de hierro, impermeabilizantes, maderas, mallas, etc.) filtrando por tu localidad o municipio.

### ¿Cómo comparto mi perfil comercial con mis clientes?
Entra a tu perfil en `/app/perfil` y en la sección *Datos de contacto* copia tu enlace comercial canónico (ej: `https://dezzpo.com/app/perfil/Tu-Nombre-Comercial`) para enviarlo por WhatsApp o redes sociales.

### ¿Cómo solicito la certificación de habilidades Dezzpo?
Desde tu cuenta en `/app/certificaciones`, selecciona tu especialidad y agenda la fecha de visita técnica presencial. Al aprobarla, tu perfil exhibirá la insignia oficial de validación técnica.

### ¿Cómo gano puntos con el programa de referidos?
Comparte tu código de invitación desde `/app/invitar-amigos`. Ganarás +50 puntos por cada usuario nuevo que se registre y +200 puntos adicionales cuando tu referido complete su primer contrato en la plataforma.
