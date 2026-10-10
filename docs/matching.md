# Motor de Compatibilidad Difusa y Taxonomía · Dezzpo

> **Nota de Generación:** Este archivo es generado automáticamente desde `src/config/matching.config.ts`. No lo edites manualmente. Ejecuta `pnpm exec tsx scripts/generate-matching-docs.ts` o la suite de tests anti-deriva.

**Versión de la Matriz:** `1.0.0`  
**Umbral Mostrar:** $\ge 0.50$  
**Umbral Degradar:** $[0.25, 0.50)$  
**Umbral Ocultar:** $< 0.25$  

---

## 1. Matriz Base de Compatibilidad (20 Pares)

Valores base $\mu_{\text{base}}(s, p) \in [0.00, 1.00]$ que definen la pertenencia difusa entre la estructura operativa del comerciante y el tipo de inmueble:

| Estructura del Comerciante | Hogar | Negocio | Propiedad Horizontal | Inmobiliaria | Aliado Estratégico |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Persona Natural** | **1.00** (Núcleo) | 0.35 | 0.10 | 0.00 | 0.00 |
| **Microempresa** | **1.00** (Núcleo) | **1.00** (Núcleo) | **0.90** (Núcleo) | 0.40 | 0.10 |
| **PyME de Servicios** | 0.40 | **0.90** (Núcleo) | **1.00** (Núcleo) | **0.90** (Núcleo) | 0.40 |
| **Empresa** | 0.05 | 0.15 | 0.45 | **0.95** (Núcleo) | **1.00** (Núcleo) |

### Núcleo Duro (9 Pares con Score $\ge 0.90$)
Son los pares contractuales donde la estructura del comerciante y el tipo de inmueble tienen compatibilidad natural y garantizada:

1. **Persona Natural** $\times$ **Hogar**: score `1.00` $\implies$ **Mostrar**
2. **Microempresa** $\times$ **Hogar**: score `1.00` $\implies$ **Mostrar**
3. **Microempresa** $\times$ **Negocio**: score `1.00` $\implies$ **Mostrar**
4. **Microempresa** $\times$ **Propiedad Horizontal**: score `0.90` $\implies$ **Mostrar**
5. **PyME de Servicios** $\times$ **Negocio**: score `0.90` $\implies$ **Mostrar**
6. **PyME de Servicios** $\times$ **Propiedad Horizontal**: score `1.00` $\implies$ **Mostrar**
7. **PyME de Servicios** $\times$ **Inmobiliaria**: score `0.90` $\implies$ **Mostrar**
8. **Empresa** $\times$ **Inmobiliaria**: score `0.95` $\implies$ **Mostrar**
9. **Empresa** $\times$ **Aliado Estratégico**: score `1.00` $\implies$ **Mostrar**

---

## 2. Invariantes del Motor (I1 – I7)

- **I1 (Dominio Válido):** Score siempre acotado a $[0.00, 1.00]$ y redondeado a 2 decimales, sin `NaN`.
- **I2 (Determinismo y Paridad):** Idéntico comportamiento en cliente y servidor para la misma tupla de entrada.
- **I3 (Estabilidad del Núcleo):** Ningún refinamiento (formalidad, zona) baja un par del núcleo fuera de «mostrar» ni eleva uno no núcleo a «mostrar».
- **I4 (Invarianza Geográfica de Visibilidad):** La señal de zona modula orden y priorización intra-banda, pero **jamás** altera qué perfiles son visibles.
- **I5 (Resiliencia ante Datos Faltantes):** Estructura o inmueble no especificado $\implies$ pertenencia neutra $0.50$ (visible, nunca oculto).
- **I6 (Unimodalidad):** Cada fila y cada columna sube monótonamente hasta su ápice y luego desciende, sin fluctuaciones locales secundarias.
- **I7 (Trazabilidad y Explicabilidad):** Cada evaluación retorna reglas técnicas aplicadas y explicación en español colombiano.

---

## 3. Tabla de Formalidad por Categoría (94 Especialidades)

| Clave | Especialidad | Rol Técnico | Exigencia de Formalidad |
| :---: | :--- | :--- | :---: |
| **0** | Acabados en muros | Afinadores de muros y acabados | 🟡 Media |
| **1** | Administración PH | Administradores PH | 🔴 Alta |
| **2** | Aires Acondicionados | Técnicos de aires Acondicionados | 🟡 Media |
| **3** | Aislamiento acústico | Aisladores acústicos | 🟡 Media |
| **4** | Albañilería | Albañiles | 🟢 Baja |
| **5** | Alfombras | Alfombristas | 🟢 Baja |
| **6** | Arquitectura | Arquitectos | 🔴 Alta |
| **7** | Armarios y closets | Técnicos de armarios y closets | 🟢 Baja |
| **8** | Artesanías y manualidades  | Artesanos | 🟢 Baja |
| **9** | Asistencia toderos | Toderos | 🟢 Baja |
| **10** | Ascensores | Toderos | 🔴 Alta |
| **11** | Aseo Hogar y Oficina | Aseadores | 🟡 Media |
| **12** | Automatización | Técnico en automatización | 🟡 Media |
| **13** | Calentadores | Técnicos de calentadores | 🟢 Baja |
| **14** | Camaras de seguridad | Técnicos de camaras de seguridad | 🟡 Media |
| **15** | Canales y bajantes | Técnicos de canales y bajantes | 🟡 Media |
| **16** | Carpintería | Carpinteros | 🟢 Baja |
| **17** | Carpintería en aluminio | Carpinteros del aluminio | 🟡 Media |
| **18** | Cerrajería | Cerrajeros | 🟢 Baja |
| **19** | Chimeneas | Técnicos de chimeneas | 🟢 Baja |
| **20** | Cocinas integrales | Técnicos de Cocinas integrales | 🟡 Media |
| **21** | Construcción civil | Constructora civil | 🔴 Alta |
| **22** | Control de acceso | Integradores Control de acceso | 🔴 Alta |
| **23** | Control de plagas | Controladores de plagas | 🔴 Alta |
| **24** | Cortinas | Técnicos de Cortinas | 🟢 Baja |
| **25** | Cubiertas y Techos | Técnicos de cubiertas y techos | 🔴 Alta |
| **26** | Diseño e impresión | Centros de diseño grafico | 🟡 Media |
| **27** | Domótica | Técnico en domótica | 🟡 Media |
| **28** | Destape drenajes | Técnico en drenajes | 🟢 Baja |
| **29** | Inundaciones | Técnico en inundaciones | 🟡 Media |
| **30** | Electrodomésticos línea blanca | Técnico en electrodomésticos línea blanca | 🟢 Baja |
| **31** | Electrodomésticos línea marrón | Técnico en electrodomésticos línea marrón | 🟢 Baja |
| **32** | Ensamblado de muebles | Técnico en ensamblaje de muebles | 🟢 Baja |
| **33** | Estudios de suelos | Geólogos | 🔴 Alta |
| **34** | Ferreterías | Ferreteros | 🟡 Media |
| **35** | Gasodomésticos | Técnicos en gasodomésticos | 🔴 Alta |
| **36** | Iluminación | Técnicos en iluminación | 🟡 Media |
| **37** | Impermeabilización | Técnicos en impermeabilizaciones | 🔴 Alta |
| **38** | Instalación de adoquín | Instaladores de Adoquín | 🟡 Media |
| **39** | Instalación de cerámica | Instaladores de cerámica | 🟢 Baja |
| **40** | Instalación pisos deck | Técnicos de pisos deck | 🟡 Media |
| **41** | Instalación pisos PVC | Técnicos de pisos PVC | 🟡 Media |
| **42** | Instalación de parques | Técnicos de parques | 🔴 Alta |
| **43** | Instalación de pisos laminados | Técnicos de pisos laminados | 🟢 Baja |
| **44** | Instalación de porcelanatos | Instaladores de porcelanatos | 🟡 Media |
| **45** | Instalación de soportes y bases para TV | Instaladores de soportes y bases para TV | 🟢 Baja |
| **46** | Instalación de ventanas | Instaladores de ventanas | 🟡 Media |
| **47** | Jardinería | Jardineros | 🟢 Baja |
| **48** | Lavandería | Lavanderías | 🟡 Media |
| **49** | Limpiezas técnicas | Técnicos de Limpiezas técnicas | 🔴 Alta |
| **50** | Oficial de Obra | Oficiales de Obra | 🟡 Media |
| **51** | Mantenimiento locativo | Técnicos de mantenimiento locativo | 🟡 Media |
| **52** | Mantenimiento mecanico | Técnicos de mantenimiento mecanico | 🟡 Media |
| **53** | Metálmecanica | Técnicos en metálmecanica | 🟡 Media |
| **54** | Muebles | Técnicos en muebles | 🟢 Baja |
| **55** | Movilizar pesos | Ayudantes de movilizaciones | 🟢 Baja |
| **56** | Mudanzas | Ayudantes de mudanzas | 🟡 Media |
| **57** | Obra Liviana | Técnicos de obra liviana | 🟡 Media |
| **58** | Paisajismo | Paisajistas | 🔴 Alta |
| **59** | Pañetes y estucos | Técnicos de pañete y estuco | 🟢 Baja |
| **60** | Pergolas | Técnicos de pergolas | 🟡 Media |
| **61** | Persianas enrollables Blackout | Técnicos de Persianas enrollables Blackout | 🟢 Baja |
| **62** | Pintura | Pintores | 🟢 Baja |
| **63** | Plomería | Plomeros | 🟢 Baja |
| **64** | Pozos sépticos y trampas de grasas | Técnicos en pozos sépticos y trampas de grasas | 🔴 Alta |
| **65** | Protección contra incendio | Técnicos en protección contra incendio | 🔴 Alta |
| **66** | Red electrica | Electricistas | 🟡 Media |
| **67** | Red de gases | Técnicos de red de gases | 🔴 Alta |
| **68** | Redes de cableado estructurado | Tecnicos de redes de cableado estructurado | 🔴 Alta |
| **69** | Redes de telecomunicaciones | Técnicos de red de telecomunicaciones | 🔴 Alta |
| **70** | Redes hidrosanitarias | Técnicos de redes hidrosanitarias | 🔴 Alta |
| **71** | Reformas Cocinas | Instaladores Cocinas | 🟡 Media |
| **72** | Reformas Baños | Instaladores Baños | 🟡 Media |
| **73** | Reformas Piscinas | Reparadores de piscinas | 🔴 Alta |
| **74** | Refrigeración | Técnico en refrigeración | 🟡 Media |
| **75** | Servicio doméstico | Asistentes de servicio domestico | 🟢 Baja |
| **76** | Sistemas de Seguridad y alarmas | Técnico en seguridad electrónica | 🔴 Alta |
| **77** | Soldadura | Técnicos en soldadura | 🟡 Media |
| **78** | Tanques de agua | Técnicos de Tanques de agua | 🔴 Alta |
| **79** | Tapicería | Tapiceros | 🟢 Baja |
| **80** | Techos PVC | Técnicos de techos PVC | 🟢 Baja |
| **81** | Trabajos en piedra | Trabajadores de piedras | 🟡 Media |
| **82** | Trasiego de escombros | Técnicos de trasiego de escombros | 🟡 Media |
| **83** | Trabajos en altura | Técnicos de trabajos en altura y acceso vertical | 🔴 Alta |
| **84** | Cálculos y Diseños de Ingeniería | Ingenieros Calculistas y Estructurales | 🔴 Alta |
| **85** | Topografía y Agrimensura | Topógrafos y Agrimensores | 🔴 Alta |
| **86** | Estudios de Suelos y Geotecnia | Ingenieros Geotécnicos | 🔴 Alta |
| **87** | Energía Solar y Fotovoltaica | Instaladores de Energía Solar | 🔴 Alta |
| **88** | Puertas Automáticas y Motores | Técnicos de Puertas Automáticas | 🟡 Media |
| **89** | Fumigación y Control de Plagas | Especialistas en Fumigación y Control de Plagas | 🔴 Alta |
| **90** | Peritajes y Avalúos | Peritos y Avaluadores Certificados | 🔴 Alta |
| **91** | Diseño 3D y Renders | Modeladores y Diseñadores 3D | 🟡 Media |
| **92** | Videovigilancia CCTV | Instaladores y Técnicos de Videovigilancia CCTV | 🔴 Alta |
| **93** | Izaje de cargas | Operadores y Técnicos de Izaje de Cargas | 🔴 Alta |
