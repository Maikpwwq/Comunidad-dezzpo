/**
 * Legal Documents Data & Content Repository
 *
 * Serves in-app legal agreements and terms to ensure users remain on the platform.
 */

export interface LegalDocument {
    id: string
    title: string
    subtitle: string
    version: string
    lastUpdated: string
    pdfDownloadUrl?: string | undefined
    content: string
}

export const LEGAL_DOCUMENTS: LegalDocument[] = [
    {
        id: 'propietarios-terminos',
        title: 'Términos y Condiciones de Uso',
        subtitle: 'Acuerdo de Usuario — Propietarios y Residentes',
        version: 'V1.1',
        lastUpdated: '21 de Julio de 2026',
        pdfDownloadUrl: 'https://drive.google.com/file/d/1_bGEdb1nTqY0-NpixhWZQVR7vXpN0tJM/view?usp=sharing',
        content: `# Acuerdo de Usuario — Propietarios

**Comunidad Dezzpo**
_Actualizado V1.1: 21 de Julio del 2026_

---

## 1. Aceptación del Acuerdo

Gracias por utilizar Dezzpo. Este Acuerdo regula el uso de la plataforma digital Dezzpo (el "Servicio"), disponible a través de nuestro sitio web, la aplicación móvil Dezzpo y nuestros canales oficiales (en conjunto, las "Aplicaciones"), operada por **Michael Arias Fajardo / NIT 1024537835-7** (en adelante, "Dezzpo", "nosotros" o "la Plataforma").

Al registrarse, publicar un Requerimiento, o continuar usando cualquier parte del Servicio, usted (el "Propietario") declara haber leído y acepta este Acuerdo, así como nuestra Política de Privacidad y Aviso de Tratamiento de Datos Personales.

El Servicio está dirigido a usuarios ubicados en Colombia y se rige por la legislación colombiana. Debe ser mayor de edad y tener capacidad legal para contratar.

---

## 2. Definiciones

- **Comerciante Calificado**: Persona natural o jurídica, examinada por Dezzpo, que ofrece servicios de construcción, remodelación o mantenimiento a través de la Plataforma.
- **Propietario**: Usuario que publica Requerimientos, solicita Cotizaciones y contrata Comerciantes Calificados.
- **Requerimiento**: Publicación de un Propietario describiendo un proyecto o necesidad de servicio.
- **Cotización**: Oferta económica de un Comerciante Calificado en respuesta a un Requerimiento.
- **Inmueble**: Dirección de propiedad registrada por el Propietario en el módulo "Mis Inmuebles".
- **Destacado**: Distintivo de perfil que un Comerciante Calificado obtiene al aprobar el proceso de certificación de Dezzpo.

---

## 3. Naturaleza del Servicio

Dezzpo es un intermediario tecnológico. **No prestamos directamente los servicios de construcción, remodelación o mantenimiento publicados en la Plataforma, ni somos parte del contrato que usted celebre con el Comerciante Calificado que seleccione.** Nada en este Acuerdo crea relación laboral, de agencia o de sociedad entre Dezzpo y ninguna de las partes.

Es su responsabilidad exclusiva verificar la idoneidad, licencias, seguro de responsabilidad civil y capacidad técnica del Comerciante Calificado antes de contratarlo, así como acordar directamente el alcance, cronograma, garantías y forma de pago del proyecto. Le recomendamos formalizar un contrato de obra por escrito para proyectos de valor significativo.

---

## 4. Registro, Verificación e Inmuebles

Usted debe proporcionar información veraz, completa y actualizada al registrarse. Podemos solicitarle documentos de identidad y soporte de domicilio en cualquier momento con fines de prevención de fraude, y suspender el acceso si no los suministra.

A través de "Mis Inmuebles" puede registrar una o más direcciones de propiedad y marcar una como preferida, para agilizar la publicación de Requerimientos y solicitudes de cotización asociadas a cada predio.

---

## 5. Código de Conducta

Nuestra misión es conectar buenos Propietarios con buenos Comerciantes Calificados. Como Propietario, usted se compromete a:

- Actuar con cortesía y honestidad en todos sus tratos.
- Describir con precisión el alcance del Requerimiento publicado.
- Informar oportunamente sobre cambios, aplazamientos o cancelaciones.
- Cumplir las citas acordadas con los Comerciantes Calificados.
- Utilizar medios digitales trazables para los pagos del servicio.
- Nunca ejercer conducta abusiva, amenazante o discriminatoria hacia un Comerciante Calificado.

El incumplimiento reiterado de este Código puede resultar en la suspensión o cancelación de su cuenta.

---

## 6. Publicación de Requerimientos

Usted es el único responsable de la exactitud, legalidad y suficiencia de la información que publica. Solo puede publicar Requerimientos para proyectos genuinos, respecto de los cuales tenga la autoridad para contratar. Dezzpo no ejerce control editorial sobre el contenido publicado por los usuarios y, por tanto, no garantiza su exactitud ni asume responsabilidad por él.

Los Comerciantes Calificados aplican a los Requerimientos que les interesan; usted, como Propietario, decide libremente a cuál seleccionar. No garantizamos que reciba respuestas, ni que las que reciba sean adecuadas para su proyecto.

---

## 7. Modelo Económico y Tarifas

**7.1. Uso general.** Publicar Requerimientos, recibir Cotizaciones y comunicarse con Comerciantes Calificados a través de la Plataforma no tiene costo para el Propietario.

**7.2. Comisión de intermediación.** Cuando un contrato se paga a través de la pasarela de pagos integrada (ePayco), Dezzpo cobra una comisión de intermediación sobre el valor efectivamente pagado (actualmente entre el 8% y el 10%, según se informe vigente en la Plataforma al momento de la transacción). Esta comisión retribuye la gestión de intermediación, verificación de Comerciantes y soporte de la Plataforma.

**7.3. Paquete Usuario VIP.** Dezzpo ofrece un paquete de mantenimiento preventivo periódico bajo la modalidad "Usuario VIP". El valor base de este paquete **se determina únicamente después de una inspección técnica del Inmueble** y le será comunicado antes de solicitarle cualquier pago. Al solicitar la visita de inspección usted no adquiere ninguna obligación de pago; esta solo surge si acepta la propuesta resultante.

**7.4. Comerciantes Destacados.** Algunos perfiles muestran el distintivo "Destacado", obtenido por el Comerciante Calificado al aprobar nuestro proceso de certificación por competencias laborales. Este distintivo no es pagado por el Propietario ni constituye una recomendación o garantía de Dezzpo sobre la calidad del trabajo.

---

## 8. Procesamiento de Pagos

**8.1. Procesador autorizado.** Los pagos realizados a través de la Plataforma se procesan mediante ePayco, entidad autorizada para prestar servicios de procesamiento de pagos en Colombia.

**8.2. Dezzpo no custodia fondos.** Dezzpo actúa exclusivamente como facilitador tecnológico del pago. **No retenemos, administramos ni tenemos la custodia de los fondos del Propietario ni del Comerciante Calificado en ningún momento**; el dinero fluye directamente entre las partes a través del procesador de pagos. Dezzpo únicamente percibe la comisión de intermediación descrita en la Sección 7.2.

**8.3. Seguridad de los datos de pago.** No almacenamos los datos completos de su tarjeta (número, fecha de vencimiento, código de seguridad). Esta información se captura y tokeniza directamente por ePayco; nosotros conservamos únicamente referencias no sensibles necesarias para el seguimiento de su transacción (por ejemplo, los últimos 4 dígitos y el estado del pago).

**8.4. Reversión de pagos.** Conforme al artículo 51 de la Ley 1480 de 2011, si su pago corresponde a una operación fraudulenta, no solicitada, o si el servicio no fue prestado según lo acordado, usted puede solicitar la reversión del pago dentro de los cinco (5) días hábiles siguientes a que tenga noticia de la situación, presentando su reclamación ante Dezzpo o directamente ante ePayco.

---

## 9. Derecho de Retracto

Conforme al artículo 47 de la Ley 1480 de 2011, usted puede retractarse de los servicios pagados directamente a Dezzpo (por ejemplo, el Paquete Usuario VIP) dentro de los cinco (5) días hábiles siguientes a la celebración del contrato, **salvo que la prestación del servicio ya haya iniciado con su consentimiento expreso**, caso en el cual el derecho de retracto no aplica sobre la parte ya ejecutada.

Si ejerce este derecho, reintegraremos los valores pagados dentro de los quince (15) días calendario siguientes, conforme a la Ley 2439 de 2024.

Este derecho de retracto aplica a los pagos que usted realiza directamente a Dezzpo. El contrato de obra o servicio que celebre con un Comerciante Calificado es independiente y se rige por lo que acuerden entre ustedes.

---

## 10. Protección de Datos Personales

**10.1. Marco normativo.** Dezzpo trata sus datos personales conforme a la Ley 1581 de 2012, el Decreto 1074 de 2015 (Título 2, Capítulo 25) y demás normas que las desarrollen. Dezzpo actúa como Responsable del Tratamiento de los datos que usted proporciona.

**10.2. Autorización.** Al registrarse, usted otorga su autorización expresa para el tratamiento de sus datos personales conforme a nuestra Política de Privacidad y Aviso de Tratamiento de Datos, disponibles en la sección Legal de la Plataforma.

**10.3. Transferencia internacional.** Parte de nuestra infraestructura tecnológica (almacenamiento en la nube) puede procesar datos en servidores ubicados fuera de Colombia. Al aceptar este Acuerdo, usted autoriza esta transferencia y transmisión internacional, necesaria para la prestación del Servicio.

**10.4. Sus derechos.** Usted puede conocer, actualizar, rectificar y solicitar la supresión de sus datos personales, solicitar prueba de la autorización otorgada, ser informado sobre su uso, y presentar quejas ante la Superintendencia de Industria y Comercio, escribiendo a nuestro correo oficial de soporte legal.

---

## 11. Resolución de Disputas con Comerciantes

Si tiene una disputa con un Comerciante Calificado, debe dirigirla directamente a él. Le pedimos que también nos informe los detalles tan pronto como sea razonable, a través de nuestro soporte por correo electrónico.

Podemos investigar cualquier reclamación y, según el resultado, permitir que ambas partes continúen usando el Servicio, suspender temporalmente el acceso de cualquiera de ellas, o restringirlo de forma indefinida. Salvo lo aquí indicado, Dezzpo no interviene en la relación contractual entre usted y el Comerciante Calificado y no será responsable por las obligaciones derivadas de dicha relación.

---

## 12. Calificaciones y Verificación

Los Comerciantes Calificados son examinados antes de aparecer en la Plataforma. El sistema de calificaciones refleja las opiniones de Propietarios que efectivamente contrataron al Comerciante a través de Dezzpo. Le recomendamos revisar el perfil, calificaciones y evidencia de trabajos anteriores antes de contratar, y dejar su propia calificación al finalizar el proyecto.

---

## 13. Contenido del Usuario

Usted es responsable del contenido que publica y garantiza tener el derecho de hacerlo. Al publicar información, fotos o comentarios en la Plataforma, otorga a Dezzpo una licencia no exclusiva, transferible y libre de regalías para usar, reproducir y mostrar dicho contenido en relación con la operación y promoción del Servicio.

Nos reservamos el derecho de editar, remover o rechazar cualquier contenido que consideremos infringe este Acuerdo o la ley aplicable.

---

## 14. Mensajería

La función de mensajería le permite comunicarse con Comerciantes Calificados. No supervisamos activamente el contenido de estos mensajes, pero nos reservamos el derecho de removerlo si incumple este Acuerdo, y de reportarlo a las autoridades cuando corresponda. No comparta ni reutilice fuera de la Plataforma información personal intercambiada por este medio.

---

## 15. Propiedad Intelectual

El diseño, marca, software y demás contenido de la Plataforma (distinto del Contenido del Usuario) son de propiedad de Dezzpo o de sus licenciantes. Este Acuerdo le otorga únicamente una licencia limitada, no exclusiva e intransferible para usar el Servicio conforme a su finalidad.

---

## 16. Limitación de Responsabilidad e Indemnización

En la medida permitida por la ley colombiana, Dezzpo no será responsable por pérdidas indirectas, lucro cesante, o daños derivados de la relación contractual entre usted y un Comerciante Calificado.

**Ninguna disposición de este Acuerdo limita o excluye la responsabilidad de Dezzpo por dolo o culpa grave, conforme al artículo 1522 del Código Civil colombiano, ni excluye los derechos mínimos e irrenunciables reconocidos a los consumidores por la Ley 1480 de 2011.**

Usted acepta indemnizar a Dezzpo frente a reclamaciones de terceros que surjan de información falsa o inexacta que haya proporcionado, o del incumplimiento de este Acuerdo.

---

## 17. Suspensión y Terminación

Podemos suspender o cancelar su acceso al Servicio, con notificación previa cuando sea razonablemente posible, en caso de incumplimiento material de este Acuerdo. Usted puede cerrar su cuenta en cualquier momento contactándonos; esto no afecta los acuerdos ya celebrados con Comerciantes Calificados.

---

## 18. Modificaciones

Podemos actualizar este Acuerdo periódicamente. Le notificaremos los cambios sustanciales publicándolos en la Plataforma con al menos 14 días de anticipación a su entrada en vigencia. El uso continuado del Servicio después de esa fecha constituye su aceptación del Acuerdo modificado.

---

## 19. Ley Aplicable y Jurisdicción

Este Acuerdo se rige por las leyes de la República de Colombia. Cualquier controversia se someterá a la jurisdicción de los tribunales colombianos, con domicilio contractual en Bogotá D.C.

---

## 20. Contacto

Para preguntas sobre este Acuerdo, escríbanos a través de nuestros canales oficiales o del formulario de atención en la Plataforma.
`,
    },
    {
        id: 'comerciantes-terminos',
        title: 'Términos y Condiciones de Uso',
        subtitle: 'Acuerdo de Usuario — Comerciantes Calificados y Empresas de Servicios',
        version: 'V1.1',
        lastUpdated: '21 de Julio de 2026',
        pdfDownloadUrl: 'https://drive.google.com/file/d/1w7Da1cFH3_MjLy7CUZaV3QBHARpn_ogk/view?usp=sharing',
        content: `# Acuerdo de Usuario — Comerciantes Calificados y Empresas de Servicios

**Comunidad Dezzpo**
_Actualizado V1.1: 21 de Julio del 2026_

---

## 1. Aceptación del Acuerdo

Este Acuerdo regula el uso de la plataforma digital Dezzpo (el "Servicio") por parte de Comerciantes Calificados y Empresas de Servicios, disponible a través de nuestro sitio web, la aplicación móvil Dezzpo y nuestros canales oficiales, operada por **Michael Arias Fajardo / NIT 1024537835-7** (en adelante, "Dezzpo", "nosotros" o "la Plataforma").

Al registrarse, aplicar a un Requerimiento publicado, o continuar usando cualquier parte del Servicio, usted declara haber leído y acepta este Acuerdo, así como nuestra Política de Privacidad y Aviso de Tratamiento de Datos Personales.

Puede registrarse como persona natural ("Comerciante Calificado") o como persona jurídica ("Empresa de Servicios"); en ambos casos, este Acuerdo aplica y usted responde por el cumplimiento de sus empleados, colaboradores o subcontratistas involucrados en cualquier Proyecto.

El Servicio está dirigido a usuarios ubicados en Colombia y se rige por la legislación colombiana. Debe ser mayor de edad y tener capacidad legal para contratar.

---

## 2. Definiciones

- **Comerciante Calificado**: Persona natural, examinada por Dezzpo, que ofrece servicios de construcción, remodelación o mantenimiento a través de la Plataforma.
- **Empresa de Servicios**: Persona jurídica registrada bajo las mismas condiciones, que puede contar con empleados o subcontratistas.
- **Propietario**: Usuario que publica Requerimientos y contrata Comerciantes Calificados.
- **Requerimiento**: Publicación de un Propietario describiendo un proyecto o necesidad de servicio.
- **Cotización**: Oferta económica que usted presenta en respuesta a un Requerimiento.
- **Información del Propietario**: Datos de contacto y del proyecto que Dezzpo le suministra para elaborar una Cotización.
- **Destacado**: Distintivo de perfil que usted obtiene al aprobar el proceso de certificación de Dezzpo.

---

## 3. Naturaleza de la Relación: Independencia y Autonomía

**Dezzpo es un intermediario tecnológico. No existe relación laboral, de agencia, de representación ni de sociedad entre usted y Dezzpo, bajo ninguna circunstancia.** Usted presta sus servicios de forma autónoma e independiente, sin subordinación jurídica ni económica hacia Dezzpo.

En consecuencia:
- Usted decide libremente a qué Requerimientos aplicar; Dezzpo no le asigna trabajos ni exige que acepte ninguno.
- Usted define y negocia directamente con el Propietario el precio, alcance, cronograma y condiciones de cada Cotización.
- Usted utiliza sus propias herramientas, materiales y, cuando aplique, subcontratistas o empleados.
- Dezzpo no ejerce potestad disciplinaria sobre usted ni le imparte instrucciones sobre cómo ejecutar el trabajo.
- Su perfil puede reflejar métricas de servicio (tasa de respuesta, calificaciones, finalización de proyectos) con fines de visibilidad ante los Propietarios.

---

## 4. Registro y Verificación

Usted debe proporcionar documento de identidad, RUT (si aplica) y soporte de domicilio, verificados por Dezzpo con fines de prevención de fraude. Le solicitaremos evidencia de un seguro de responsabilidad civil vigente y, cuando el oficio lo requiera, de las licencias o certificaciones técnicas aplicables (por ejemplo, RETIE para instalaciones eléctricas, certificación de trabajo en alturas, o el registro SG-SST correspondiente). La validez de cualquier certificación reportada es su exclusiva responsabilidad.

---

## 5. Seguridad Social y Afiliaciones

Como trabajador independiente (o, si se registra como Empresa de Servicios, respecto de su propio personal), usted es el único responsable de afiliarse y realizar sus aportes al Sistema General de Seguridad Social (salud, pensión y riesgos laborales — ARL) conforme a la normativa vigente. **Dezzpo no gestiona, tramita ni paga estas afiliaciones en su nombre**.

---

## 6. Código de Conducta

Nuestra misión es conectar buenos Propietarios con buenos Comerciantes Calificados. Como Comerciante Calificado, usted se compromete a:

- Proporcionar Cotizaciones transparentes y precisas.
- Ejecutar el trabajo con estándares profesionales de calidad y seguridad.
- Respetar los tiempos y presupuestos acordados con el Propietario.
- Mantener una comunicación fluida y respetuosa.
- Utilizar los canales oficiales de Dezzpo para la trazabilidad del servicio.

---

## 7. Cotizaciones y Contratación

Al responder a un Requerimiento, usted presenta una Cotización binding con el alcance y valor propuestos. Una vez aceptada por el Propietario a través de la Plataforma, se genera una orden de servicio / contrato de intermediación.

---

## 8. Pagos, Membresías y Comisión

**8.1. Membresía.** El acceso al Servicio requiere una membresía con cuota periódica (mensual, trimestral o anual), cuyos valores se informan en la sección Suscripciones de la Plataforma.

**8.2. Comisión de intermediación.** Cuando un Proyecto se paga a través de la pasarela integrada (ePayco), Dezzpo cobra una comisión de intermediación (entre el 8% y el 10%). Esta comisión se adiciona al monto que paga el Propietario.

**8.3. Renovación.** Su membresía se renueva automáticamente según la frecuencia elegida, salvo que la cancele previamente en la Plataforma.

---

## 9. Garantías y Reclamaciones

Usted es el único responsable por la calidad, garantía y acabado de las obras ejecutadas. En caso de fallas o defectos manifestados por el Propietario, se compromete a atender la garantía conforme a la Ley 1480 de 2011 (Estatuto del Consumidor).

---

## 10. Beneficios de Membresía

Según su plan, su membresía puede incluir: perfil personalizado con portafolio, fotos y calificaciones; visibilidad prioritara en el directorio de requerimientos; insignias de certificación; alertas de proyectos en su zona; y acceso al programa de recompensas por referidos.

---

## 11. Certificación y Destacado

Los comerciantes que aprueben el proceso de evaluación de competencias técnicas recibirán el distintivo "Destacado / Profesional Certificado". Dezzpo se reserva el derecho de revocar este distintivo ante faltas graves o reclamaciones reiteradas.

---

## 12. Protección de Datos Personales

Dezzpo trata sus datos personales y los de los Propietarios bajo estricto cumplimiento de la Ley 1581 de 2012. La información de contacto proporcionada sobre un Propietario debe ser utilizada exclusivamente para fines de la cotización y ejecución del servicio solicitado.

---

## 13. Suspensión y Terminación

Dezzpo se reserva el derecho de suspender o desactivar perfiles que incurran en prácticas fraudulentas, cobros fuera de plataforma no autorizados, suplantación de identidad o incumplimientos graves de conducta.

---

## 14. Ley Aplicable y Jurisdicción

Este Acuerdo se rige por las leyes de la República de Colombia. Cualquier controversia se someterá a los tribunales ordinarios con domicilio en Bogotá D.C.
`,
    },
    {
        id: 'politica-tratamiento-datos',
        title: 'Política de Tratamiento de Datos',
        subtitle: 'Habeas Data y Protección de Datos Personales (Ley 1581 de 2012)',
        version: 'V1.1',
        lastUpdated: '21 de Julio de 2026',
        pdfDownloadUrl: 'https://drive.google.com/file/d/10I8CNmXfatwNigiICp7UP40WQyMENC_f/view?usp=sharing',
        content: `# Política de Tratamiento de Datos Personales

**Comunidad Dezzpo**
_Actualizado V1.1: 21 de Julio del 2026_

---

## 1. Objetivo

Establecer los criterios que Dezzpo aplica en la recolección, almacenamiento, uso, circulación y supresión de los datos personales de los usuarios de la Plataforma (Propietarios y Comerciantes Calificados), garantizando su autenticidad, confidencialidad e integridad.

## 2. Alcance

Esta Política aplica a los datos personales de personas naturales registradas en las bases de datos de Dezzpo a través del sitio web y la aplicación móvil, y debe ser observada por el equipo, contratistas y terceros que traten dicha información en nombre de Dezzpo.

## 3. Marco Normativo

- Constitución Política de Colombia, artículo 15 (derecho al habeas data).
- Ley Estatutaria 1581 de 2012, reglamentada hoy por el Decreto 1074 de 2015 (Título 2, Capítulo 25), que incorporó el antiguo Decreto 1377 de 2013.
- Sentencia C-748 de 2011 de la Corte Constitucional (control de constitucionalidad de la Ley 1581).

## 4. Responsable del Tratamiento

**Michael Arias / NIT 102457835-7 / domicilio — Calle 159 No 8c-45**, operador de la Plataforma Dezzpo.

Canal de contacto para ejercer sus derechos: **comunidad.dezzpo@gmail.com**.

## 5. Datos que Recolectamos y Finalidades del Tratamiento

Recolectamos los siguientes tipos de datos, según su rol en la Plataforma:

- **Datos de identificación:** nombre, documento de identidad, RUT, datos de contacto.
- **Datos de verificación:** soporte de domicilio, licencias o certificaciones profesionales (Comerciantes Calificados), seguro de responsabilidad civil.
- **Datos de ubicación:** direcciones de inmuebles registradas (Propietarios), zona de cobertura de servicio (Comerciantes Calificados).
- **Datos de transacciones:** historial de Requerimientos, Cotizaciones, contratos y pagos procesados a través de ePayco (no incluye datos completos de tarjeta, que son tokenizados directamente por el procesador de pagos).
- **Datos de uso:** mensajes dentro de la Plataforma, calificaciones, contenido de perfil.

Tratamos estos datos para:

- a) Registrar, autenticar y verificar la identidad de los usuarios.
- b) Publicar y gestionar Requerimientos, Cotizaciones y la contratación entre Propietarios y Comerciantes Calificados.
- c) Procesar pagos y comisiones a través de nuestra pasarela de pagos integrada.
- d) Mostrar perfiles públicos, calificaciones y distintivos de certificación ("Destacado").
- e) Enviar notificaciones relevantes (nuevos Requerimientos, mensajes, estado de solicitudes).
- f) Prevenir fraude y verificar el cumplimiento de nuestros Acuerdos de Usuario.
- g) Generar estadísticas internas para mejorar el Servicio.
- h) Realizar actividades de mercadeo sobre nuestros propios servicios (usted puede solicitar exclusión de estas comunicaciones en cualquier momento).
- i) Atender solicitudes, quejas y reclamos, y dar trámite al ejercicio de sus derechos de habeas data.
- j) Cumplir obligaciones legales y regulatorias aplicables.

## 6. Datos Sensibles

Solo recolectamos datos sensibles (por ejemplo, datos biométricos) cuando exista una finalidad específica, legítima y previamente informada, con su autorización expresa e independiente de cualquier otra autorización general. Usted nunca está obligado a responder preguntas sobre datos sensibles.

## 7. Datos de Menores de Edad

Dezzpo no está dirigido a menores de edad; el registro en la Plataforma requiere ser mayor de edad y tener capacidad legal para contratar, conforme a nuestros Acuerdos de Usuario.

## 8. Derechos de los Titulares

Usted tiene derecho a:

- (i) Acceder de forma gratuita a sus datos.
- (ii) Conocer, actualizar y rectificar su información.
- (iii) Solicitar prueba de la autorización otorgada.
- (iv) Presentar quejas ante la Superintendencia de Industria y Comercio.
- (v) Revocar la autorización y/o solicitar la supresión de sus datos, salvo que exista un deber legal o contractual que impida eliminarlos.
- (vi) Abstenerse de responder preguntas sobre datos sensibles.

Puede ejercer estos derechos escribiendo a **comunidad.dezzpo@gmail.com** o desde Ajustes > Privacidad en la Plataforma.

## 9. Principios Rectores

- **Legalidad:** el tratamiento se sujeta a lo dispuesto en la ley.
- **Finalidad:** el tratamiento obedece a una finalidad legítima, informada al Titular.
- **Libertad:** solo se ejerce con su consentimiento previo, expreso e informado.
- **Veracidad:** la información tratada debe ser veraz, completa y actualizada.
- **Transparencia:** usted puede solicitar información sobre la existencia de datos que le conciernan en cualquier momento.
- **Acceso y circulación restringida:** el tratamiento se limita a las personas autorizadas por usted o por la ley.
- **Seguridad:** aplicamos medidas técnicas, humanas y administrativas razonables para proteger sus datos.
- **Confidencialidad:** toda persona que intervenga en el tratamiento está obligada a guardar reserva, incluso después de finalizada su relación con Dezzpo.

## 10. Transferencia y Transmisión Internacional

Parte de nuestra infraestructura tecnológica (almacenamiento en la nube) puede procesar datos en servidores ubicados fuera de Colombia. Al aceptar el Aviso de Privacidad, usted autoriza esta transferencia y transmisión, necesaria para la prestación del Servicio.

## 11. Vigencia de las Bases de Datos

Conservamos sus datos mientras sean necesarios para las finalidades descritas, o mientras exista una relación contractual vigente. Puede solicitar su supresión en cualquier momento, salvo que exista un deber legal o contractual de conservarlos.

## 12. Vigencia y Actualización

Esta Política entra en vigencia a partir de su publicación y será revisada al menos una vez al año, o antes si cambian materialmente nuestras prácticas de tratamiento de datos.
`,
    },
    {
        id: 'aviso-privacidad',
        title: 'Aviso de Privacidad',
        subtitle: 'Autorización para el Tratamiento de Datos Personales',
        version: 'V1.1',
        lastUpdated: '21 de Julio de 2026',
        pdfDownloadUrl: undefined,
        content: `# Aviso de Privacidad y Autorización para el Tratamiento de Datos Personales

**Michael Arias**, identificada con NIT **1024537835-7**, con domicilio en **Calle 159 No 8c-45**, responsable del tratamiento de sus datos personales, le informa lo siguiente:

---

## 1. ¿Qué hacemos con sus datos?

Recolectamos, almacenamos, usamos y, cuando corresponda, transmitimos sus datos personales para:

- Registrarlo y verificar su identidad en la Plataforma Dezzpo.
- Gestionar la publicación y contratación de Requerimientos entre Propietarios y Comerciantes Calificados.
- Procesar pagos y comisiones a través de nuestra pasarela de pagos integrada.
- Mostrar su perfil, calificaciones y certificaciones dentro de la Plataforma.
- Enviarle notificaciones relevantes sobre su cuenta y actividad.
- Comunicaciones de mercadeo sobre nuestros propios servicios (opcional — puede solicitar exclusión en cualquier momento).
- Cumplir obligaciones legales aplicables.

Parte de nuestra infraestructura tecnológica puede procesar sus datos en servidores ubicados fuera de Colombia; al aceptar este Aviso, usted autoriza dicha transferencia.

Puede consultar el detalle completo en nuestra **Política de Tratamiento de Datos Personales**, disponible en **www.comunidad-dezzpo.vercel.app/legal**.

---

## 2. Sus derechos

Usted puede: acceder gratuitamente a sus datos; conocerlos, actualizarlos y rectificarlos; solicitar prueba de su autorización; presentar quejas ante la Superintendencia de Industria y Comercio; revocar su autorización o solicitar la supresión de sus datos (salvo deber legal o contractual que lo impida); y abstenerse de responder preguntas sobre datos sensibles.

---

## 3. ¿Cómo ejercer sus derechos?

Escríbanos a **comunidad.dezzpo@gmail.com** o desde Ajustes > Privacidad en la Plataforma.

---

## 4. Autorización

Al registrarme y usar la Plataforma, declaro que la información que suministro es veraz, completa y exacta, y autorizo de manera previa, expresa e informada el tratamiento de mis datos personales por parte de Dezzpo para las finalidades aquí descritas.
`,
    },
    {
        id: 'cookies',
        title: 'Política de Cookies',
        subtitle: 'Uso de Cookies y Tecnologías de Almacenamiento Local',
        version: 'V1.0',
        lastUpdated: '21 de Julio de 2026',
        pdfDownloadUrl: undefined,
        content: `# Política de Cookies

**Comunidad Dezzpo**
_Actualizado: 21 de Julio del 2026_

---

## 1. ¿Qué son las Cookies?

Las cookies son pequeños archivos de texto que los sitios web almacenan en su navegador o dispositivo para recordar información sobre sus preferencias, sesión y navegación.

---

## 2. Tipos de Cookies y Almacenamiento Utilizados por Dezzpo

En Dezzpo utilizamos únicamente tecnologías necesarias para garantizar la seguridad, el rendimiento y una experiencia de usuario fluida:

1. **Cookies de Sesión y Autenticación (Esenciales)**: Permiten mantener su sesión activa de forma segura mientras navega por la Plataforma (Firebase Auth / Zustand persist).
2. **Almacenamiento Local (localStorage y sessionStorage)**: Guardan preferencias temporales (como selecciones de formularios, filtros de búsqueda y código de referido en la sesión) para evitar la pérdida de datos durante la navegación.
3. **Cookies Analíticas y de Rendimiento**: Nos ayudan a comprender cómo interactúan los usuarios con la Plataforma para corregir errores y mejorar la velocidad de carga.

---

## 3. Control y Deshabilitación de Cookies

Usted puede configurar su navegador en cualquier momento para bloquear o eliminar las cookies. Tenga en cuenta que deshabilitar cookies esenciales puede afectar el inicio de sesión y el funcionamiento de ciertas secciones interactivas de la Plataforma.
`,
    },
]
