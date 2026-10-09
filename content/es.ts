import type { Content } from "./types";

export const es: Content = {
  htmlLang: "es",
  meta: {
    title: "Anderson F. González, desarrollador full stack",
    description:
      "Desarrollador full stack con énfasis en backend, integraciones y seguridad. Estudiante de Ingeniería de Sistemas en Colombia. Casos de estudio y hoja de vida.",
  },
  ui: {
    skip: "Saltar al contenido",
    home: "Inicio",
    switchLabel: "Idioma",
    switchTo: "English",
    back: "Volver al trabajo",
    caseStudy: "Caso de estudio",
    private: "Código privado",
    sourceLabel: "Fuente",
  },
  nav: {
    work: "Trabajo",
    experience: "Experiencia",
    education: "Formación",
    skills: "Habilidades",
    contact: "Contacto",
  },
  hero: {
    name: "Anderson F. González",
    role: "Desarrollador full stack, con énfasis en backend, integraciones y seguridad",
    intro:
      "Estudio Ingeniería de Sistemas en la Universidad de Pamplona. Desde agosto de 2026 desarrollo y despliego sistemas web para dos empresas colombianas: un lector de hojas de vida con OCR, la migración de un sistema de control de combustible y una plataforma de cursos con pagos. Estoy disponible desde enero de 2027 para práctica profesional o contrato.",
    facts: [
      { label: "Ubicación", value: "Pamplona, Colombia" },
      { label: "Disponible", value: "Desde enero de 2027" },
      { label: "Estudios", value: "Ingeniería de Sistemas, noveno semestre" },
      { label: "Idiomas", value: "Español nativo, inglés B2, japonés básico" },
    ],
    lab: {
      title: "Una petición, paso a paso",
      note: "Simulación del flujo de Control Vehicular, un sistema real con código privado.",
      scenariosLabel: "Escenarios",
      requestLabel: "Petición",
      resultLabel: "Respuesta",
      stateLabels: { ok: "pasa", na: "no aplica", stop: "se detiene", skip: "no se ejecuta" },
      steps: [
        { title: "Cabeceras y sesión", detail: "Cabeceras de seguridad y sesión guardada en MySQL." },
        { title: "Puerta CSRF", detail: "Todo POST se valida antes de cualquier ruta." },
        { title: "Usuario y permiso", detail: "Cada ruta exige el permiso de su rol." },
        { title: "Lógica de la ruta", detail: "Consultas SQL con parámetros, sin ORM." },
        { title: "Respuesta", detail: "Plantilla Nunjucks o redirección." },
      ],
      scenarios: [
        {
          id: "valida",
          label: "Consulta válida",
          request: "GET /consumos/ · rol auxiliar",
          states: ["ok", "na", "ok", "ok", "ok"],
          notes: [
            "Cabeceras puestas; la sesión se lee de MySQL.",
            "Un GET no lleva token.",
            "El rol auxiliar tiene el permiso de consumos.",
            "La consulta usa parámetros, no texto pegado.",
            "Se muestra la lista de consumos.",
          ],
          result: { code: "200", text: "Se muestra la lista de consumos." },
        },
        {
          id: "csrf",
          label: "Sin token CSRF",
          request: "POST /consumos/nuevo · sin csrf_token",
          states: ["ok", "stop", "skip", "skip", "skip"],
          notes: ["Cabeceras puestas; la sesión se lee de MySQL.", "Falta el token: se rechaza antes de ejecutar la ruta.", "", "", ""],
          result: { code: "400", text: "Petición inválida. La ruta no llegó a ejecutarse." },
        },
        {
          id: "permiso",
          label: "Rol sin permiso",
          request: "GET /consumos/ · rol jefe",
          states: ["ok", "na", "stop", "skip", "skip"],
          notes: ["Sesión válida del usuario jefe.", "Un GET no lleva token.", "El rol jefe no tiene el permiso de consumos.", "", ""],
          result: { code: "302", text: "Redirige al panel con el aviso: No tiene permisos para realizar esta acción." },
        },
        {
          id: "bloqueo",
          label: "Sexto intento de login",
          request: "POST /login · clave correcta tras 5 fallos",
          states: ["ok", "ok", "na", "stop", "ok"],
          notes: [
            "Cabeceras puestas; la sesión se lee de MySQL.",
            "El formulario trae su token y es válido.",
            "El login es público: todavía no hay usuario.",
            "Tras 5 fallos la cuenta queda bloqueada 15 minutos y no se compara la clave.",
            "Vuelve el formulario con el aviso de bloqueo.",
          ],
          result: { code: "200", text: "No se inicia sesión aunque la clave sea la correcta. El bloqueo es por usuario e IP." },
        },
      ],
      sourceNote: "Cada escenario tiene su prueba en fleet_control (permissions.test.js y auth.test.js). Flujo tomado de src/app.js, src/auth.js y src/routes/auth.js.",
      caseLabel: "Ver el caso de estudio",
    },
    cvPrimary: { label: "Hoja de vida (PDF)", href: "/cv/Anderson_Gonzalez_Hoja_de_Vida.pdf" },
    cvSecondary: { label: "CV en inglés (PDF)", href: "/cv/Anderson_Gonzalez_CV_EN.pdf" },
  },
  work: {
    title: "Trabajo",
    intro:
      "Seis proyectos entre trabajo para clientes y proyectos abiertos. En los de clientes el código es privado, así que cuento cómo funcionan y cómo los medí; los abiertos enlazan al código o a una demo. Los tres primeros tienen caso de estudio, con lo que salió bien y lo que no.",
    projects: [
      {
        slug: "talento-rosimar",
        title: "Talento Rosimar",
        context: "Cliente: Distribuciones Rosimar S.A.S.",
        period: "2026",
        stack: "React, TypeScript, pdf.js, Tesseract.js, Express, MariaDB",
        summary:
          "Sistema de talento humano que lee hojas de vida desde PDF, Word, escaneos y fotos y llena los formularios. Corre en el navegador, funciona sin conexión y no cobra por documento.",
        facts: [
          "[[165 de 165 campos correctos|ocr-pdf]] en 10 PDF digitales",
          "[[89,8 % de precisión en 40 escaneos sintéticos y 75,9 % en 17 fotos reales|ocr-medicion]]",
        ],
        links: [],
      },
      {
        slug: "control-vehicular",
        title: "Control Vehicular",
        context: "Cliente: Distribuciones Rosimar S.A.S.",
        period: "2026",
        stack: "Node.js, Express, MySQL, Nunjucks",
        summary:
          "Lee las facturas electrónicas de combustible de la DIAN y las concilia con los tanqueos de la flota. Migré el backend de Flask a Node.js sin cambiar el esquema ni las rutas.",
        facts: [
          "[[48 pruebas contra una base MySQL real, sin mocks|fleet-tests]]",
          "[[Se corrigieron un open redirect en el login y una ruta que aceptaba GET sin CSRF|fleet-fixes]]",
        ],
        links: [],
      },
      {
        slug: "circuitbreve",
        title: "CircuitBreve",
        context: "Proyecto abierto, en equipo de dos",
        period: "2026",
        stack: "React, TypeScript, Vite, Tailwind",
        summary:
          "Simulador de circuitos lógicos en el navegador. Escribes el circuito en un lenguaje propio, se compila al instante y se dibuja el esquema; puedes simularlo, ver la tabla de verdad y exportarlo.",
        facts: [
          "[[Compilador, simulador y distribución del esquema sin librerías de grafos ni de circuitos|circuit-deps]]",
          "[[Tablas de verdad de hasta 1.024 filas|circuit-readme]]",
        ],
        links: [
          { label: "Demo", href: "https://circuit-breve.vercel.app" },
          { label: "Código", href: "https://github.com/Albonire/CircuitBreve" },
        ],
      },
      {
        title: "Plataforma de cursos de Lograr",
        context: "Cliente: Lograr S.A.S.",
        period: "2026",
        stack: "Next.js 16, Laravel 12, MariaDB",
        summary:
          "Plataforma de cursos en línea. Mi parte fue la pasarela Wompi, con verificación de la firma de cada evento, y el streaming de video privado con enlaces firmados.",
        facts: [
          "[[La pasarela está probada, pero todavía sin transacciones reales: faltan las credenciales de producción|lograr-estado]]",
        ],
        links: [],
      },
      {
        title: "Sistema de Alertas Tempranas (SATIS)",
        context: "Proyecto en equipo, Universidad de Pamplona",
        period: "2026",
        stack: "FastAPI, SQLAlchemy, Alembic, PostgreSQL, React 19",
        summary:
          "Sistema para detectar estudiantes en riesgo de deserción. Hice la autenticación JWT con refresh tokens, los permisos por rol y las migraciones del backend ([[30 de 84 commits|satis-commits]]).",
        facts: ["[[29 permisos granulares y bloqueo tras 5 intentos fallidos durante 15 minutos|satis-permisos]]"],
        links: [
          { label: "Backend", href: "https://github.com/ATIS-UP/AT-Backend" },
          { label: "Frontend", href: "https://github.com/ATIS-UP/AT-frontend" },
        ],
      },
      {
        title: "Reconstructor de Zoom Iterativo (RZI)",
        context: "Proyecto en equipo de tres, curso de algoritmos numéricos",
        period: "2026",
        stack: "Python, NumPy, Numba, PySide6",
        summary:
          "Aplicación de escritorio que amplía una región de una imagen resolviendo la ecuación de Poisson con SOR Red-Black, en lugar de interpolar. Incluye comparación con PSNR y SSIM.",
        facts: [
          "El solver no construye la matriz: una malla de 256 por 256 ocuparía [[unos 34 GB|rzi-34gb]] en formato denso",
        ],
        links: [{ label: "Código", href: "https://github.com/Albonire/rzi-project" }],
      },
    ],
    alsoTitle: "También",
    also: [
      {
        title: "NotebookLM Watermark Remover",
        text: "Herramienta de línea de comandos que limpia PDF, PPTX e imágenes con inpainting. [[80 estrellas y 24 forks|nwr-stars]] en GitHub, con aportes de cuatro colaboradores externos (cifras de octubre de 2026).",
        href: "https://github.com/Albonire/notebooklm-watermark-remover",
        linkLabel: "Código",
      },
      {
        title: "cUPido",
        text: "Red social para estudiantes universitarios, en equipo. Soy el principal contribuidor del frontend en React y TypeScript ([[115 de 351 commits|cupido-commits]]).",
        href: "https://cupido-sandy.vercel.app",
        linkLabel: "Demo",
      },
      {
        title: "Pipeline ETL en AWS",
        text: "Flujo por capas (bronze, silver y gold) con AWS Glue, Step Functions y Athena sobre [[1.067.371 registros|etl-registros]] de ventas. Proyecto académico.",
        href: "https://github.com/Albonire/spark-glue-workshop",
        linkLabel: "Documentación",
      },
      {
        title: "Clasificador de ojos con CUDA",
        text: "Preprocesamiento en OpenMP y entrenamiento en CUDA, en equipo de seis. Mi parte fue la retropropagación en CUDA y la exportación de pesos. Exactitud de [[82,6 % sobre 201 muestras de prueba|cuda-exactitud]].",
        href: "https://github.com/Albonire/clasificador-imagenes-openmp-cuda",
        linkLabel: "Código",
      },
    ],
  },
  experience: {
    title: "Experiencia",
    jobs: [
      {
        title: "Desarrollador full stack (contratista independiente)",
        org: "Distribuciones Rosimar S.A.S. y Lograr S.A.S.",
        place: "Remoto",
        period: "Ago 2026 a la fecha",
        bullets: [
          "Desarrollé talento.rosimar.com, sistema de talento humano (PWA en React, API con JWT, MariaDB), con un lector OCR en el navegador que acertó 165 de 165 campos en 10 PDF digitales y alcanza 89,8 % en 40 escaneos de prueba.",
          "Migré de Python/Flask a Node.js/Express el backend de controlvehicular.rosimar.com (conciliación del combustible de la flota con facturas DIAN); agregué 48 pruebas y corregí dos fallas de seguridad (open redirect y CSRF).",
          "En la tienda rosimar.com (Next.js, Laravel, PostgreSQL, ERP Mayasis, ePayco) agregué validación de propiedad y montos en pedidos, eliminé consultas N+1 y configuré CI en GitHub Actions con pruebas end-to-end en Playwright.",
          "En la plataforma de cursos de Lograr (Next.js 16, Laravel 12, MariaDB) integré la pasarela de pagos Wompi con verificación de firma de eventos e implementé el streaming privado de video con enlaces firmados.",
          "Desplegué en Hostinger los tres sistemas de Rosimar: tienda, control vehicular y talento humano.",
        ],
      },
      {
        title: "Practicante técnico en sistemas",
        org: "SENA",
        place: "Puente Nacional, Santander",
        period: "Jun 2022 a dic 2022",
        bullets: [
          "Administré redes y equipos de cómputo en colegios de la zona y monté una red entre pares sin servidor central.",
        ],
      },
    ],
  },
  education: {
    title: "Formación",
    degrees: [
      {
        title: "Ingeniería de Sistemas",
        place: "Universidad de Pamplona",
        period: "2021 a la fecha",
        detail: "Noveno semestre. Termino materias en diciembre de 2026.",
      },
      {
        title: "Técnico en Sistemas (redes y hardware)",
        place: "SENA, Puente Nacional",
        period: "2017 a 2018",
      },
    ],
    certsTitle: "Certificaciones",
    certs: [
      {
        title: "Oracle Cloud Infrastructure Certified Architect Associate",
        issuer: "Oracle",
        date: "Oct 2026, vigente hasta oct 2028",
        href: "https://catalog-education.oracle.com/ords/certview/sharebadge?id=eafed89e1810f8509dfeb7f029a30e1d901789270ffe560604139d43edfffbb6",
        linkLabel: "Verificar en Oracle",
      },
      {
        title: "DevOps on AWS and Project Management",
        issuer: "AWS, en Coursera",
        date: "Jun 2025",
        href: "https://coursera.org/verify/IHHJU6O3TN4A",
        linkLabel: "Verificar en Coursera",
      },
      {
        title: "EF SET English Certificate, 59/100 (B2)",
        issuer: "EF Education First",
        date: "Jun 2025",
        href: "https://cert.efset.org/YsH6yp",
        linkLabel: "Verificar en EF SET",
      },
      {
        title: "Bootcamp de Programación, nivel Explorador (159 h)",
        issuer: "MinTIC Talento Tech y Universidad Sergio Arboleda",
        date: "Nov 2024",
        note: "El certificado se entrega cuando un proceso de selección lo pide.",
      },
    ],
  },
  skills: {
    title: "Habilidades",
    groups: [
      { label: "Lenguajes", items: "TypeScript, JavaScript, Python, PHP, Java, SQL" },
      {
        label: "Backend",
        items: "Node.js (Express), Laravel, Django REST Framework, FastAPI, Spring Boot (básico), APIs REST, JWT",
      },
      { label: "Frontend", items: "React, Next.js, Vite, Tailwind CSS, HTML, CSS" },
      { label: "Bases de datos", items: "PostgreSQL, MySQL, MariaDB, Redis, SQLite" },
      {
        label: "Nube y despliegue",
        items: "AWS (S3, Glue, Athena, Step Functions), Oracle Cloud Infrastructure, Docker, Linux, Hostinger, Vercel",
      },
      {
        label: "Calidad",
        items: "Pruebas unitarias, de integración y end-to-end (node:test, PHPUnit, Vitest, Playwright), GitHub Actions, Git",
      },
      { label: "Otros", items: "OCR (Tesseract.js, pdf.js), OpenCV, Scrum" },
    ],
    languagesLabel: "Idiomas",
    languages: "Español nativo, inglés B2 (EF SET 59/100), japonés básico",
  },
  contact: {
    title: "Contacto",
    text: "Si tienes una práctica, un contrato o un proyecto en mente, escríbeme. Te respondo.",
    emailLabel: "Correo",
    items: [
      { label: "LinkedIn", href: "https://www.linkedin.com/in/anderson-gonzaleza21/" },
      { label: "GitHub", href: "https://github.com/Albonire" },
    ],
  },
  sources: {
    title: "Fuentes de las cifras",
    intro: "Cada número con superíndice se puede rastrear. Cuando el repositorio es privado, indico el archivo y la fecha en lugar de un enlace.",
    items: {
    "ocr-pdf": {
      title: "Banco de precisión del lector sobre PDF digitales",
      where: "rosimar1/cv-parser, README y docs/MEDICION_LECTOR.md (privado)",
      date: "agosto de 2026",
      note: "Son diez PDF generados con jsPDF, todos con capa de texto perfecta: esta medición no pasa por OCR. Se compara contra 165 campos de una verdad de referencia versionada.",
    },
    "ocr-medicion": {
      title: "Medición del lector sobre escaneos, contratos y fotos reales",
      where: "rosimar1/cv-parser, docs/MEDICION_LECTOR.md, decimosexta tanda (privado)",
      date: "30 de septiembre de 2026",
      note: "El 89,8 % de los escaneos se midió con lecturas en paralelo que después se descartaron; en contratos, la versión en serie dio 90,0 % y la paralela 89,9 %. De las 17 fotos reales, solo 8 son hojas de vida.",
    },
    "ocr-evolucion": {
      title: "Evolución de la precisión sobre 40 escaneos sintéticos",
      where: "rosimar1/cv-parser, docs/MEDICION_LECTOR.md, sección Resultado (privado)",
      date: "agosto y septiembre de 2026",
      note: "Incluye la regresión del clasificador (19,6 %) y los hitos posteriores del mismo banco. Los caracteres leídos (8 y 2.528) son del documento CV_04, perfil duro. Los 20 documentos sin correo salen de la sección sobre la arroba.",
    },
    "ocr-nombres": {
      title: "Espejismo del promedio de nombres en las fotos",
      where: "rosimar1/cv-parser, docs/MEDICION_LECTOR.md, sexta tanda (privado)",
      date: "septiembre de 2026",
      note: "Solo 2 de los 17 documentos declaran nombres en su verdad de referencia; en esas dos el lector fallaba (0 % y 20 % de similitud) hasta que se corrigió.",
    },
    "ocr-tiempos": {
      title: "Tiempo por documento",
      where: "rosimar1/cv-parser, docs/MEDICION_LECTOR.md, decimosexta tanda (privado)",
      date: "30 de septiembre de 2026",
      note: "15,7 s por foto y 57,8 s por contrato, en un portátil con Ryzen 7 5700U. Con el mismo código, un contrato tardó 48,8 s por la mañana y 56,9 s por la tarde.",
    },
    "parser-commits": {
      title: "Autoría de los commits de cv-parser",
      where: "git shortlog de rosimar1/cv-parser (privado)",
      date: "9 de octubre de 2026",
      note: "Fabian Gonzalez 50, jholman19 41, Claude 27 e ImgBot 1: 119 en total.",
    },
    "fleet-commits": {
      title: "Autoría de los commits de fleet_control",
      where: "git shortlog de rosimar1/fleet_control (privado)",
      date: "9 de octubre de 2026",
      note: "Jholman Adrian Sogamoso Gutierrez 17 y Fabian Gonzalez 7: 24 en total.",
    },
    "fleet-tests": {
      title: "Pruebas al cerrar la migración",
      where: "rosimar1/fleet_control, commit d1cc1c2 (privado)",
      date: "23 de septiembre de 2026",
      note: "35 llamadas a test() más 14 casos que genera el bucle de permisos de test/integration/permissions.test.js. El mensaje del commit también dice 48.",
    },
    "fleet-fixes": {
      title: "Fallas del original corregidas en la migración",
      where: "mensaje del commit d1cc1c2 y test/integration/auth.test.js de rosimar1/fleet_control (privado)",
      date: "23 de septiembre de 2026",
      note: "Un open redirect en el login (hay una prueba: next=//evil.com se ignora) y una ruta de vinculación masiva que aceptaba GET sin token CSRF.",
    },
    "lograr-estado": {
      title: "Estado de la pasarela Wompi",
      where: "lograr-sas/lograr-plataforma, docs/ESTADO-PROYECTO.md (privado)",
      note: "La pasarela está implementada y probada con verificación criptográfica de eventos; en producción requiere las credenciales reales del cliente.",
    },
    "satis-commits": {
      title: "Aporte al backend de SATIS",
      where: "registro de evidencias de Albonire/my-cv, docs/GUIA.md (privado)",
      note: "30 de los 84 commits de ATIS-UP/AT-Backend.",
      href: "https://github.com/ATIS-UP/AT-Backend",
    },
    "satis-permisos": {
      title: "Permisos y bloqueo de intentos de SATIS",
      where: "README y config.py de ATIS-UP/AT-Backend (público)",
      note: "29 permisos granulares; bloqueo tras 5 intentos fallidos durante 15 minutos.",
      href: "https://github.com/ATIS-UP/AT-Backend",
    },
    "rzi-34gb": {
      title: "Memoria de la matriz densa de RZI",
      where: "Albonire/rzi-project, core/sor_solver.py (público)",
      note: "Una malla de 256 por 256 tiene 65.536 incógnitas; la matriz densa tendría 65.536 por 65.536 entradas de 8 bytes, unos 34,4 GB (32 GiB). El docstring del solver da la misma cifra.",
      href: "https://github.com/Albonire/rzi-project",
    },
    "nwr-stars": {
      title: "Estrellas, forks y colaboradores de NotebookLM Watermark Remover",
      where: "registro de evidencias de Albonire/my-cv (privado)",
      date: "6 de octubre de 2026",
      note: "80 estrellas, 24 forks y 4 colaboradores externos.",
      href: "https://github.com/Albonire/notebooklm-watermark-remover",
    },
    "cupido-commits": {
      title: "Aporte al frontend de cUPido",
      where: "registro de evidencias de Albonire/my-cv (privado)",
      note: "115 de los 351 commits de cupidoUP-App/cupido-frontend.",
    },
    "etl-registros": {
      title: "Registros procesados por el pipeline ETL",
      where: "README de Albonire/spark-glue-workshop (público)",
      note: "1.067.371 filas procesadas en la capa silver.",
      href: "https://github.com/Albonire/spark-glue-workshop",
    },
    "cuda-exactitud": {
      title: "Métricas del clasificador sobre el conjunto de prueba",
      where: "reporte/evidencias/final_metrics.md de Albonire/clasificador-imagenes-openmp-cuda (público)",
      note: "201 muestras y exactitud de 0,8259.",
      href: "https://github.com/Albonire/clasificador-imagenes-openmp-cuda",
    },
    "circuit-commits": {
      title: "Autoría de los commits de CircuitBreve",
      where: "git log de Albonire/CircuitBreve (público)",
      date: "9 de octubre de 2026",
      note: "Fabian Gonzalez 9, ANDresC-1A 4 (backend y una copia del frontend) e ImgBot 1: 14 en total.",
      href: "https://github.com/Albonire/CircuitBreve",
    },
    "circuit-loc": {
      title: "Tamaño del código de CircuitBreve",
      where: "archivos .ts y .tsx de src/ en Albonire/CircuitBreve (público)",
      date: "9 de octubre de 2026",
      note: "4.544 líneas.",
      href: "https://github.com/Albonire/CircuitBreve",
    },
    "circuit-readme": {
      title: "Capacidades declaradas de CircuitBreve",
      where: "README de Albonire/CircuitBreve (público)",
      note: "Tablas de verdad de hasta 10 entradas (1.024 filas) y exportación a SVG, PNG a 3x y PDF.",
      href: "https://github.com/Albonire/CircuitBreve",
    },
    "circuit-deps": {
      title: "Dependencias de ejecución de CircuitBreve",
      where: "package.json de Albonire/CircuitBreve (público)",
      note: "clsx, lucide-react, react, react-dom y tailwind-merge. Ninguna librería de grafos ni de circuitos.",
      href: "https://github.com/Albonire/CircuitBreve",
    },
    },
  },
  footer: "Anderson F. González. Hecho con Next.js y Tailwind.",
  notFound: {
    title: "No encontré esa página",
    text: "La dirección no existe o cambió de lugar.",
    link: "Ir al inicio",
  },
  cases: {
    "talento-rosimar": {
      title: "Talento Rosimar: leer hojas de vida en el navegador",
      lead: "Un sistema de talento humano para una distribuidora de alimentos. La parte difícil es el lector: convierte PDF, Word, escaneos y fotos en formularios que una persona solo tiene que revisar.",
      meta: [
        { label: "Cliente", value: "Distribuciones Rosimar S.A.S., Barranquilla" },
        {
          label: "Mi parte",
          value: "Desarrollo del sistema, en un equipo de dos. [[50 de los 119 commits del repositorio|parser-commits]] son míos.",
        },
        { label: "Periodo", value: "2026, en curso" },
        { label: "Stack", value: "React, TypeScript, pdf.js, Tesseract.js, mammoth.js, Express, MariaDB" },
        { label: "Código", value: "Privado" },
      ],
      links: [],
      sections: [
        {
          heading: "El problema",
          paragraphs: [
            "Rosimar recibe hojas de vida en todos los formatos: PDF con texto, escaneos, fotos tomadas con el celular y documentos de Word. Pasar a mano nombres, contacto, experiencia y estudios es lento y se presta a errores. El sistema tenía que leer esos documentos sin pagar por cada uno y sin depender de un modelo de lenguaje externo.",
            "También tenía que seguir funcionando sin conexión. Por eso el reconocimiento de texto corre dentro del navegador (es una PWA) y los archivos de Tesseract se sirven desde la propia aplicación, no desde un CDN.",
          ],
        },
        {
          heading: "Cómo funciona",
          paragraphs: [
            "El lector es un proceso determinista de cuatro etapas. No usa ningún modelo de lenguaje y no tiene costo por documento.",
          ],
          figures: [
            {
              kind: "flow",
              label: "Las cuatro etapas del lector",
              caption: "Las tres rutas de extracción entregan lo mismo: palabras con su caja delimitadora.",
              steps: [
                {
                  title: "Extracción",
                  detail: "pdf.js para PDF con texto, Tesseract.js (WASM) para fotos y escaneos, mammoth.js para Word.",
                },
                {
                  title: "Maquetación",
                  detail:
                    "Reconstruye renglones y detecta columnas por el canal vertical vacío, para no mezclar una barra lateral con el contenido.",
                },
                {
                  title: "Segmentación",
                  detail:
                    "Reconoce encabezados con un léxico en español e inglés tolerante a errores de OCR. Si no hay títulos, clasifica por contenido.",
                },
                {
                  title: "Extractores",
                  detail:
                    "Uno por campo: nombres, contacto, documento, fechas, experiencia, estudios, idiomas. Usan los municipios del DANE y un diccionario de cargos.",
                },
              ],
            },
          ],
        },
        {
          heading: "Lo que medí y lo que no",
          paragraphs: [
            "La primera cifra que tuve fue [[165 de 165 campos correctos|ocr-pdf]]. Era cierta, pero engañosa: ese banco son diez PDF generados por código, todos con capa de texto perfecta, y esa ruta no es la que usa Rosimar. Lo que llega de verdad son escaneos y fotos, y esa ruta no estaba medida.",
            "Armé un segundo banco con 40 hojas de vida colombianas sintéticas convertidas en escaneos degradados (ruido, inclinación, poca luz, recompresión) y un tercero con 17 fotos reales. Última medición documentada: 30 de septiembre de 2026.",
          ],
          table: {
            head: ["Banco", "Documentos", "Resultado"],
            rows: [
              ["PDF digitales, con capa de texto", "10", "[[165 de 165 campos|ocr-pdf]]"],
              ["Escaneos sintéticos", "40", "[[89,8 %|ocr-medicion]] ([[63,4 %|ocr-evolucion]] en la primera medición)"],
              ["Contratos", "12", "[[90,0 %|ocr-medicion]]"],
              ["Fotos reales", "17", "[[75,9 %|ocr-medicion]]"],
            ],
            note: "De las 17 fotos, solo 8 son hojas de vida; el resto son contratos, certificados y formularios manuscritos.",
          },
          figures: [
            {
              kind: "chart",
              label: "Precisión global del lector sobre 40 escaneos sintéticos, tras cada cambio",
              caption: "Cada punto es una medición después de un cambio. Los cuatro de la derecha son hitos de tandas posteriores del mismo banco.",
              yLabel: "Precisión global (%)",
              laterLabel: "Tandas posteriores",
              dataLabel: "Datos de la gráfica",
              keysHint: "Con el teclado, usa las flechas para recorrer los puntos.",
              focus: 4,
              callout: { title: "Regresión del clasificador", text: "73,9 % a 19,6 %" },
              points: [
                { label: "Primera medición", value: 63.4, phase: "table", note: "Antes de arreglar nada." },
                { label: "Umbral local (Sauvola)", value: 68.5, phase: "table", note: "Un umbral por zona en vez de uno solo para toda la página." },
                { label: "Detección de polaridad", value: 72.5, phase: "table", note: "Se invierte la zona oscura antes de umbralizar, para no perder la letra clara." },
                { label: "Reconstrucción del correo", value: 73.9, phase: "table", note: "Se reconstruye la arroba, que Tesseract lee mal." },
                { label: "Regresión del clasificador", value: 19.6, phase: "table", note: "Seis de cada nueve hojas de vida salían como documento no estructurado y llegaban vacías al formulario." },
                { label: "Clasificador corregido", value: 64.1, phase: "table", note: "Se corrige el clasificador de documentos." },
                { label: "Preprocesado por texto", value: 68.4, phase: "table", note: "Se elige entre gris y binarizada según la cantidad de texto leído." },
                { label: "Teléfono por fragmento", value: 69.1, phase: "table", note: "El teléfono se lee por fragmentos." },
                { label: "Detección de orientación", value: 73.3, phase: "table", note: "Una página girada deja de ser una lectura perdida." },
                { label: "Hojas sin encabezados", value: 75.5, phase: "table", note: "Una hoja de vida sin títulos se reconoce por la evidencia de su contenido." },
                { label: "Cuarta tanda", value: 76.0, phase: "later", note: "Banco completo medido por perfiles; la escalada de contratos no tocó las hojas de vida." },
                { label: "Sexta tanda", value: 75.8, phase: "later", note: "Primera medición con el trabajo de los dos desarrolladores integrado." },
                { label: "Decimosexta, base", value: 78.2, phase: "later", note: "Línea base de la última tanda." },
                { label: "Decimosexta, final", value: 89.8, phase: "later", note: "Medido con lecturas en paralelo, que luego se descartaron." },
              ],
            },
          ],
        },
        {
          heading: "Lo que apareció al medir la ruta real",
          bullets: [
            "pdf.js 6 usa una función de JavaScript que Chrome 141 y anteriores no tienen, así que los escaneos no se podían leer. Se resolvió con un respaldo de doce líneas.",
            "El umbral global de Otsu borraba los escaneos difíciles. Con un umbral local de Sauvola, un documento pasó [[de 8 a 2.528 caracteres leídos|ocr-evolucion]].",
            "Tesseract lee mal la arroba: [[20 de los 40 documentos|ocr-evolucion]] se quedaban sin correo hasta que se reconstruyó el dato.",
            "Un cambio en el clasificador de documentos hizo caer la precisión global [[de 73,9 % a 19,6 %|ocr-evolucion]]. Se detectó al volver a correr el banco.",
            "Un promedio de 83 % de similitud en los nombres de las fotos escondía que [[solo dos de las 17|ocr-nombres]] tenían nombre que comprobar, y en esas dos el lector fallaba. Después se corrigió.",
          ],
        },
        {
          heading: "Límites",
          bullets: [
            "Las fotos reales (75,9 %) siguen lejos de los escaneos limpios, que superan el 90 %.",
            "Los formularios manuscritos no se leen bien. Hay un piloto con TrOCR que todavía no se probó contra ese banco.",
            "En un portátil con Ryzen 7 cada documento tarda [[entre 16 segundos (fotos) y 58 segundos (contratos)|ocr-tiempos]].",
            "Los escaneos son sintéticos: se parecen a los reales, pero no los reemplazan.",
          ],
          closing:
            "Me quedo con una idea de este proyecto: un 100 % sobre el banco equivocado es peor que un 76 % honesto, porque el primero dice que no hay nada que arreglar.",
        },
      ],
    },
    "control-vehicular": {
      title: "Control Vehicular: migrar de Flask a Node.js sin cambiar el comportamiento",
      lead: "Un sistema web que lee las facturas electrónicas de combustible de la DIAN y las concilia con los tanqueos de la flota de una distribuidora. Mi parte fue reescribir el backend de Python a Node.js, manteniendo el esquema y las rutas.",
      meta: [
        { label: "Cliente", value: "Distribuciones Rosimar S.A.S." },
        {
          label: "Mi parte",
          value:
            "La migración del backend y varias funciones portadas después. [[7 de los 24 commits|fleet-commits]] son míos; el sistema original y su lógica de conciliación son de otro desarrollador del equipo.",
        },
        { label: "Periodo", value: "Septiembre y octubre de 2026" },
        { label: "Stack", value: "Node.js 22, Express 5, MySQL con mysql2 (SQL directo), Nunjucks, node:test y supertest" },
        { label: "Código", value: "Privado. controlvehicular.rosimar.com tiene acceso restringido." },
      ],
      links: [],
      sections: [
        {
          heading: "Por qué migrar",
          paragraphs: [
            "La aplicación original estaba en Flask. El hosting compartido de Hostinger que usa el cliente no soporta Python con frameworks, solo en un VPS. Se reescribió, con una condición: no cambiar el comportamiento. Mismo esquema MySQL, mismas rutas, mismas pantallas.",
          ],
        },
        {
          heading: "Qué se portó",
          bullets: [
            "Autenticación con bloqueo tras 5 intentos fallidos durante 15 minutos, por usuario y por IP.",
            "CSRF en todo POST, también en formularios multipart, verificado antes de procesar cualquier dato.",
            "El parser de las facturas electrónicas de la DIAN: ZIP con XML y PDF, con XML que usa espacios de nombres.",
            "Conciliación de consumos contra facturas por período, auditoría, análisis e importación de Excel y CSV.",
            "SQL directo y parametrizado, sin ORM. Las sesiones y los archivos de facturas viven en la base de datos, no en disco.",
            "Un módulo que reproduce el redondeo de Python, para que los totales coincidan con los del sistema anterior.",
          ],
          figures: [
            {
              kind: "flow",
              label: "Camino de una petición",
              caption: "Cada módulo (autenticación, catálogos, facturas, consumos, conciliación, reportes) tiene su propio router.",
              steps: [
                { title: "Petición", detail: "Cabeceras de seguridad y sesión guardada en la base de datos." },
                { title: "CSRF y permisos", detail: "El token CSRF se verifica antes de procesar cualquier dato; el rol limita qué rutas ve cada usuario." },
                { title: "Router", detail: "Un router por módulo. Los roles admin, auxiliar y jefe ven cada uno su parte." },
                { title: "SQL", detail: "mysql2 con consultas parametrizadas, sin ORM." },
                { title: "Plantilla", detail: "Nunjucks, con una sintaxis casi igual a la de Jinja2 que usaba el original." },
              ],
            },
          ],
        },
        {
          heading: "Errores del original que aparecieron al reescribir",
          paragraphs: ["Reescribir con atención obliga a leer cada ruta. Salieron estos problemas, que [[se corrigieron en la migración|fleet-fixes]]:"],
          bullets: [
            "Un open redirect en el login.",
            "La ruta de vinculación masiva aceptaba GET sin token CSRF.",
            "La importación de recibos en xlsx guardaba una lista en vez de un entero.",
            "Una celda mal ubicada en el export de facturas.",
            "El conteo de hallazgos nuevos era falso en el análisis inicial.",
          ],
        },
        {
          heading: "Cómo se probó",
          paragraphs: [
            "Al cerrar la migración había [[48 pruebas|fleet-tests]], unitarias y de integración, con node:test y supertest contra una base MySQL real, sin mocks. Cada archivo de prueba crea y borra su propia base `*_test`, y el helper se niega a correr contra cualquier servidor que no sea localhost.",
            "El código Python se conserva en `legacy/`, como referencia y como vía de regreso.",
          ],
        },
        {
          heading: "Límites",
          bullets: [
            "No hay integración continua. Lo que llega a `main` se despliega directo en Hostinger, así que las pruebas se corren a mano antes de cada push.",
            "Las pruebas necesitan un contenedor de MySQL local.",
            "No diseñé el producto. Lo mío fue el cambio de plataforma y el portado de funciones nuevas.",
          ],
        },
      ],
    },
    circuitbreve: {
      title: "CircuitBreve: un simulador de circuitos lógicos en el navegador",
      lead: "Escribes un circuito en un lenguaje propio, se compila al instante y se dibuja como esquema. Puedes alternar las entradas para ver cómo se propaga la señal, obtener la tabla de verdad y exportar el resultado.",
      meta: [
        { label: "Tipo", value: "Proyecto abierto, en equipo de dos" },
        {
          label: "Mi parte",
          value: "La aplicación en React. [[9 de los 14 commits|circuit-commits]] son míos; el prototipo de escaneo de imágenes en Python lo subió otro colaborador.",
        },
        { label: "Periodo", value: "Mayo de 2026" },
        { label: "Stack", value: "React 19, TypeScript, Vite 7, Tailwind 4" },
        { label: "Licencia", value: "MIT" },
      ],
      links: [
        { label: "Probar la demo", href: "https://circuit-breve.vercel.app" },
        { label: "Código en GitHub", href: "https://github.com/Albonire/CircuitBreve" },
      ],
      sections: [
        {
          heading: "Qué hace",
          bullets: [
            "Un lenguaje propio (HDL) con módulos, compuertas, entradas, salidas y expresiones anidadas.",
            "Compila mientras escribes, con 400 ms de espera.",
            "Dibuja el esquema en SVG con zoom y arrastre. Al hacer clic en una entrada, la señal se propaga.",
            "Genera la tabla de verdad de [[hasta 10 entradas (1.024 filas)|circuit-readme]] y extrae las expresiones booleanas de las salidas.",
            "Exporta a SVG, PNG a 3x y PDF.",
          ],
          figures: [
            {
              kind: "circuit",
              label: "Sumador completo interactivo",
              caption: "El mismo circuito de las capturas: dos medios sumadores y una compuerta OR. Activa las entradas y mira cómo se propaga la señal.",
              hint: "Haz clic en A, B o Cin, o enfócalas y pulsa Enter o Espacio.",
              summary: "en binario",
              tableLabel: "Tabla de verdad",
              inputLabels: ["A", "B", "Cin"],
              outputLabels: ["Sum", "Cout"],
            },
            {
              kind: "image",
              src: "/work/circuitbreve/esquema.webp",
              alt: "Pantalla de CircuitBreve en tema claro: editor de código a la izquierda y el esquema de un sumador completo a la derecha, con las entradas A, B y Cin activas.",
              width: 1440,
              height: 900,
              caption: "Un sumador completo escrito con dos módulos de medio sumador, con las tres entradas activas.",
            },
            {
              kind: "image",
              src: "/work/circuitbreve/tabla.webp",
              alt: "Pestaña de tabla de verdad de CircuitBreve con las ocho combinaciones de entrada del sumador completo.",
              width: 1440,
              height: 900,
              caption: "La tabla de verdad del mismo circuito, generada a partir del esquema.",
            },
          ],
        },
        {
          heading: "Cómo está hecho",
          paragraphs: [
            "Todo ocurre en el navegador, sin servidor. El código está separado por etapas: un compilador (lexer, parser y constructor del grafo), un simulador, un motor de distribución por capas al estilo Sugiyama y los componentes de la interfaz. Son [[unas 4.500 líneas de TypeScript|circuit-loc]].",
            "[[Las únicas dependencias de ejecución son React, clsx, tailwind-merge y un paquete de íconos|circuit-deps]]. No hay librerías de grafos ni de circuitos: el parser, la simulación y la distribución del esquema son código del proyecto.",
          ],
        },
        {
          heading: "Límites",
          bullets: [
            "No tiene pruebas automáticas ni integración continua.",
            "El escaneo de imagen a HDL es un prototipo.",
            "El lenguaje exige que cada señal esté definida antes de usarla.",
          ],
        },
      ],
    },
  },
};
