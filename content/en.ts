import type { ChartFigure, Content } from "./types";

const accuracyChart: ChartFigure = {
  kind: "chart",
  label: "Overall accuracy of the reader on 40 synthetic scans, after each change",
  caption: "Each point is a measurement taken after a change. The four on the right are milestones from later rounds on the same bench.",
  yLabel: "Overall accuracy (%)",
  laterLabel: "Later rounds",
  dataLabel: "Chart data",
  keysHint: "With a keyboard, use the arrow keys to move between points.",
  focus: 4,
  callout: { title: "Classifier regression", text: "73.9% to 19.6%" },
  points: [
    { label: "First measurement", value: 63.4, phase: "table", note: "Before fixing anything." },
    { label: "Local threshold (Sauvola)", value: 68.5, phase: "table", note: "One threshold per region instead of a single one for the whole page." },
    { label: "Polarity detection", value: 72.5, phase: "table", note: "Dark regions are inverted before thresholding, so light text isn't lost." },
    { label: "Email reconstruction", value: 73.9, phase: "table", note: "The at sign, which Tesseract struggles to read, is rebuilt." },
    { label: "Classifier regression", value: 19.6, phase: "table", note: "Six of every nine résumés came out as an unstructured document and reached the form empty." },
    { label: "Classifier fixed", value: 64.1, phase: "table", note: "The document classifier is corrected." },
    { label: "Preprocessing by text", value: 68.4, phase: "table", note: "Gray or binarized is chosen by how much text was read." },
    { label: "Phone by fragment", value: 69.1, phase: "table", note: "The phone number is read in fragments." },
    { label: "Orientation detection", value: 73.3, phase: "table", note: "A rotated page is no longer a lost reading." },
    { label: "Résumés without headings", value: 75.5, phase: "table", note: "A résumé with no titles is recognized by the evidence in its content." },
    { label: "Fourth round", value: 76.0, phase: "later", note: "Full bench measured by profile; the contracts escalation did not touch résumés." },
    { label: "Sixth round", value: 75.8, phase: "later", note: "First measurement with both developers' work merged." },
    { label: "Sixteenth, baseline", value: 78.2, phase: "later", note: "Baseline of the last round." },
    { label: "Sixteenth, final", value: 89.8, phase: "later", note: "Measured with parallel reads, which were dropped afterwards." },
  ],
};

export const en: Content = {
  htmlLang: "en",
  meta: {
    title: "Anderson F. González, full-stack developer",
    description:
      "Full-stack developer with a focus on backend, integrations and security. Systems Engineering student in Colombia. Case studies and résumé.",
  },
  ui: {
    skip: "Skip to content",
    navLabel: "Main",
    switchLabel: "Language",
    switchTo: "Español",
    back: "Back to work",
    caseStudy: "Case study",
    private: "Private code",
    sourceLabel: "Source",
    sunny: { label: "Sun" },
  },
  nav: {
    work: "Work",
    experience: "Experience",
    education: "Education",
    skills: "Skills",
    contact: "Contact",
  },
  hero: {
    name: "Anderson F. González",
    role: "Full-stack developer with a focus on backend, integrations and security",
    intro:
      "I'm studying Systems Engineering at the University of Pamplona, Colombia. Since August 2026 I've been developing and deploying web systems for two Colombian companies: a résumé reader with OCR, a fuel-control system migrated from Flask to Node, and a course platform with a payment gateway. I'm available from January 2027 for an internship or employment.",
    facts: [
      { label: "Location", value: "Pamplona, Colombia" },
      { label: "Available", value: "From January 2027" },
      { label: "Studying", value: "Systems Engineering, ninth semester" },
      { label: "Languages", value: "Spanish native, English B2, Japanese basic" },
    ],
    curve: {
      title: "A drop you only see if you measure again",
      text: "The résumé reader for Talento Rosimar reached [[73.9%|ocr-evolucion]] accuracy on synthetic scans. One change to the classifier sank it to [[19.6%|ocr-evolucion]]. It showed up because every change was measured against the same benchmark.",
      caseLabel: "See all 14 measurements and the case",
      chart: accuracyChart,
    },
    cvPrimary: { label: "Résumé (PDF)", href: "/cv/Anderson_Gonzalez_CV_EN.pdf" },
    cvSecondary: { label: "CV in Spanish (PDF)", href: "/cv/Anderson_Gonzalez_Hoja_de_Vida.pdf" },
  },
  reader: {
    title: "Test your résumé",
    lead: "A résumé reader starts by pulling the text out of the PDF. Here you can see what text comes out of yours and in what order, using pdf.js, the same library the Talento Rosimar reader uses on digital PDFs.",
    noscript: "Reading a PDF in the browser needs JavaScript.",
    privacy: "The file is processed in your browser and is not sent to any server.",
    pick: "Choose a PDF",
    dropHint: "or drop it here",
    samplesLabel: "Or try",
    samples: {
      own: { label: "my résumé", href: "/cv/Anderson_Gonzalez_CV_EN.pdf" },
      columns: { label: "a two-column example", href: "/samples/sample-two-column.pdf" },
    },
    busy: "Reading the PDF",
    reset: "Try another file",
    errors: {
      notPdf: "That file is not a PDF.",
      tooBig: "The file is larger than 15 MB. Pick a lighter one.",
      password: "The PDF is password protected. Remove the password and try again.",
      broken: "The PDF could not be read. It may be damaged.",
    },
    resultFor: "Result for {name}",
    pageOne: "{n} page",
    pageMany: "{n} pages",
    cap: "The first {n} pages of {total} were read.",
    status: { ok: "OK", review: "Review" },
    checks: {
      text: {
        label: "Text",
        ok: "{chars} characters of selectable text in {pages}.",
        few: "There is little text ({chars} characters in {pages}). Part of the content may be an image.",
        none: "The PDF has no selectable text: it looks like a scanned image. A system without OCR would read nothing. Export the résumé from the editor instead of a photo or a scan.",
      },
      contact: {
        label: "Contact",
        email: "Email",
        phone: "Phone",
        links: "Links",
        clickable: "{n} clickable",
        notFound: "not found",
        missingHint: "If one is missing, check that it is written as text and not as an image or an icon.",
      },
      sections: {
        label: "Sections",
        found: "Recognized headings: {list}.",
        missing: "These headings were not recognized: {list}. Conventional headings help an extractor locate each part.",
        none: "No section heading was recognized.",
      },
      columns: {
        label: "Columns",
        none: "No column layout was detected.",
        some: "Possible column layout (page {pages}). Some extractors read row by row and mix the text of the two columns; compare the two views below.",
      },
    },
    sectionNames: {
      summary: "Summary",
      experience: "Experience",
      education: "Education",
      skills: "Skills",
      projects: "Projects",
      languages: "Languages",
      certifications: "Certifications",
    },
    previewTitle: "Text as the PDF delivers it",
    previewRowsTitle: "Text read row by row, top to bottom",
    previewCut: "The first {n} characters are shown.",
    limits: "This is not a score or a verdict. It only shows the text the PDF contains and the order it delivers it in. It does no OCR, does not judge the content, and each hiring system reads in its own way.",
  },
  work: {
    title: "Work",
    intro:
      "Six projects, some for clients and some open source. The client code is private, so for those I explain how they work and how I measured them; the open ones link to the code or a demo. The first three have case studies, including what went wrong.",
    projects: [
      {
        slug: "talento-rosimar",
        title: "Talento Rosimar",
        context: "Client: Distribuciones Rosimar S.A.S.",
        period: "2026",
        stack: "React, TypeScript, pdf.js, Tesseract.js, Express, MariaDB",
        summary:
          "An HR system that reads résumés from PDF, Word, scans and photos and fills in the forms. It runs in the browser, works offline and costs nothing per document.",
        facts: [
          "[[165 of 165 fields correct|ocr-pdf]] on 10 digital PDFs",
          "[[89.8% accuracy on 40 synthetic scans and 75.9% on 17 real photos|ocr-medicion]]",
        ],
        links: [],
      },
      {
        slug: "control-vehicular",
        title: "Control Vehicular",
        context: "Client: Distribuciones Rosimar S.A.S.",
        period: "2026",
        stack: "Node.js, Express, MySQL, Nunjucks",
        summary:
          "Reads the fuel e-invoices issued under Colombia's DIAN and reconciles them with the fleet's refueling records. I migrated the backend from Flask to Node.js without changing the schema or the routes.",
        facts: [
          "[[48 tests against a real MySQL database, no mocks|fleet-tests]]",
          "[[Fixed an open redirect on login and a route that accepted GET without CSRF|fleet-fixes]]",
        ],
        links: [],
      },
      {
        slug: "circuitbreve",
        title: "CircuitBreve",
        context: "Open source, team of two",
        period: "2026",
        stack: "React, TypeScript, Vite, Tailwind",
        summary:
          "A logic circuit simulator in the browser. You write the circuit in a language of its own, it compiles as you type and draws the schematic; you can simulate it, see the truth table and export it.",
        facts: [
          "[[Compiler, simulator and schematic layout written without graph or circuit libraries|circuit-deps]]",
          "[[Truth tables up to 1,024 rows|circuit-readme]]",
        ],
        links: [
          { label: "Demo", href: "https://circuit-breve.vercel.app" },
          { label: "Code", href: "https://github.com/Albonire/CircuitBreve" },
        ],
      },
      {
        title: "Lograr course platform",
        context: "Client: Lograr S.A.S.",
        period: "2026",
        stack: "Next.js 16, Laravel 12, MariaDB",
        summary:
          "An online course platform. My part was the Wompi payment gateway, with signature verification on every event, and private video streaming with signed links.",
        facts: ["[[The gateway is tested but has no real transactions yet: production credentials are still pending|lograr-estado]]"],
        links: [],
      },
      {
        title: "Early Warning System (SATIS)",
        context: "Team project, University of Pamplona",
        period: "2026",
        stack: "FastAPI, SQLAlchemy, Alembic, PostgreSQL, React 19",
        summary:
          "A system to flag students at risk of dropping out. I built the JWT authentication with refresh tokens, the role permissions and the backend migrations ([[30 of 84 commits|satis-commits]]).",
        facts: ["[[29 granular permissions and a lockout after 5 failed attempts for 15 minutes|satis-permisos]]"],
        links: [
          { label: "Backend", href: "https://github.com/ATIS-UP/AT-Backend" },
          { label: "Frontend", href: "https://github.com/ATIS-UP/AT-frontend" },
        ],
      },
      {
        title: "Iterative Zoom Reconstructor (RZI)",
        context: "Team of three, numerical algorithms course",
        period: "2026",
        stack: "Python, NumPy, Numba, PySide6",
        summary:
          "A desktop app that enlarges a region of an image by solving the Poisson equation with Red-Black SOR instead of interpolating. It includes a PSNR and SSIM comparison.",
        facts: [
          "The solver never builds the matrix: a 256 by 256 grid would take [[about 34 GB|rzi-34gb]] in dense form",
        ],
        links: [{ label: "Code", href: "https://github.com/Albonire/rzi-project" }],
      },
    ],
    alsoTitle: "Also",
    also: [
      {
        title: "NotebookLM Watermark Remover",
        text: "A command-line tool that cleans PDF, PPTX and image files with inpainting. [[80 stars and 24 forks|nwr-stars]] on GitHub, with contributions from four outside developers (figures from October 2026).",
        href: "https://github.com/Albonire/notebooklm-watermark-remover",
        linkLabel: "Code",
      },
      {
        title: "cUPido",
        text: "A social app for university students, built as a team. I wrote [[115 of the 351 commits|cupido-commits]] of the React and TypeScript frontend.",
        href: "https://cupido-sandy.vercel.app",
        linkLabel: "Demo",
      },
      {
        title: "AWS ETL pipeline",
        text: "A layered flow (bronze, silver and gold) with AWS Glue, Step Functions and Athena over [[1,067,371 sales records|etl-registros]]. Academic project.",
        href: "https://github.com/Albonire/spark-glue-workshop",
        linkLabel: "Documentation",
      },
      {
        title: "Eye-state classifier with CUDA",
        text: "OpenMP preprocessing and CUDA training, in a team of six. My part was the CUDA backward pass and the weight export. [[82.6% accuracy on 201 test samples|cuda-exactitud]].",
        href: "https://github.com/Albonire/clasificador-imagenes-openmp-cuda",
        linkLabel: "Code",
      },
    ],
  },
  experience: {
    title: "Experience",
    jobs: [
      {
        title: "Full-Stack Developer (Independent Contractor)",
        org: "Distribuciones Rosimar S.A.S. and Lograr S.A.S.",
        place: "Remote",
        period: "Aug 2026 to present",
        bullets: [
          "Developed and deployed talento.rosimar.com, an HR and recruiting PWA (React, JWT API, MariaDB) with a browser-based OCR résumé parser that extracted [[165 of 165 fields|ocr-pdf]] on 10 digital PDFs and reached [[89.8%|ocr-medicion]] on 40 synthetic scans.",
          "Migrated the controlvehicular.rosimar.com backend (fleet fuel reconciliation against DIAN e-invoices) from Python/Flask to Node.js/Express; added 48 tests and fixed two security flaws (open redirect and CSRF).",
          "Hardened the rosimar.com store (Next.js, Laravel, PostgreSQL, Mayasis ERP, ePayco) with order ownership and amount checks, N+1 query fixes, and GitHub Actions CI with Playwright end-to-end tests.",
          "Integrated the Wompi payment gateway with signed event verification and added signed private video streaming for the Lograr course platform (Next.js 16, Laravel 12, MariaDB).",
          "Deployed the three Rosimar systems on Hostinger: store, vehicle control and HR.",
        ],
      },
      {
        title: "Systems Technician Intern",
        org: "SENA",
        place: "Puente Nacional, Santander",
        period: "Jun 2022 to Dec 2022",
        bullets: [
          "Managed networks and computers in local schools and set up a peer-to-peer network with no central server.",
        ],
      },
    ],
  },
  education: {
    title: "Education",
    degrees: [
      {
        title: "B.S. in Systems Engineering",
        place: "University of Pamplona",
        period: "2021 to present",
        detail: "Ninth semester. Coursework ends in December 2026.",
      },
      {
        title: "Systems Technician (networks and hardware)",
        place: "SENA, Puente Nacional",
        period: "2017 to 2018",
      },
    ],
    certsTitle: "Certifications",
    certs: [
      {
        title: "Oracle Cloud Infrastructure Certified Architect Associate",
        issuer: "Oracle",
        date: "Oct 2026, valid until Oct 2028",
        href: "https://catalog-education.oracle.com/ords/certview/sharebadge?id=eafed89e1810f8509dfeb7f029a30e1d901789270ffe560604139d43edfffbb6",
        linkLabel: "Verify at Oracle",
      },
      {
        title: "DevOps on AWS and Project Management",
        issuer: "AWS, on Coursera",
        date: "Jun 2025",
        href: "https://coursera.org/verify/IHHJU6O3TN4A",
        linkLabel: "Verify on Coursera",
      },
      {
        title: "EF SET English Certificate, 59/100 (B2)",
        issuer: "EF Education First",
        date: "Jun 2025",
        href: "https://cert.efset.org/YsH6yp",
        linkLabel: "Verify at EF SET",
      },
      {
        title: "Programming Bootcamp, Explorer level (159 h)",
        issuer: "MinTIC Talento Tech and Universidad Sergio Arboleda",
        date: "Nov 2024",
        note: "The certificate is shared when a hiring process asks for it.",
      },
    ],
  },
  skills: {
    title: "Skills",
    groups: [
      { label: "Languages", items: "TypeScript, JavaScript, Python, PHP, Java, SQL" },
      {
        label: "Backend",
        items: "Node.js (Express), Laravel, Django REST Framework, FastAPI, Spring Boot (basic), REST APIs, JWT",
      },
      { label: "Frontend", items: "React, Next.js, Vite, Tailwind CSS, HTML, CSS" },
      { label: "Databases", items: "PostgreSQL, MySQL, MariaDB, Redis, SQLite" },
      {
        label: "Cloud and DevOps",
        items: "AWS (S3, Glue, Athena, Step Functions), Oracle Cloud Infrastructure, Docker, Linux, Hostinger, Vercel",
      },
      {
        label: "Testing",
        items: "Unit, integration and end-to-end tests (node:test, PHPUnit, Vitest, Playwright), GitHub Actions, Git",
      },
      { label: "Other", items: "OCR (Tesseract.js, pdf.js), OpenCV, Scrum" },
    ],
    languagesLabel: "Languages spoken",
    languages: "Spanish (native), English B2 (EF SET 59/100), Japanese (basic)",
  },
  contact: {
    title: "Contact",
    text: "If you have an internship, a contract or a project in mind, write to me. I'll answer.",
    items: [
      { label: "LinkedIn", href: "https://www.linkedin.com/in/anderson-gonzaleza21/" },
      { label: "GitHub", href: "https://github.com/Albonire" },
    ],
    overlap: {
      title: "Your time and mine",
      intro: "I work on Colombian time (UTC-5, no daylight saving). Pick your zone to see how much of the workday we share.",
      noscript: "Calculating the overlap needs JavaScript.",
      zoneLabel: "Your time zone",
      detecting: "Detecting",
      detected: "detected",
      nowLabel: "Now",
      now: "It is {me} in Pamplona and {you} in your zone.",
      rows: { me: "Pamplona", you: "Your zone", both: "Overlap" },
      axisLabel: "Time in your zone",
      assumption: "A workday of 9:00 AM to 6:00 PM is assumed in each zone, using today's clock.",
      summary: {
        overlap: "We overlap for {duration} on a working day: {from} to {to} your time ({meFrom} to {meTo} in Pamplona).",
        same: "We are on the same time: we overlap the whole workday, {from} to {to}.",
        none: "We have no working hours in common. If you want to talk, write to me and we will agree on a time outside one of our workdays.",
      },
      zones: [
        { id: "America/Bogota", label: "Colombia (Bogotá)" },
        { id: "America/Mexico_City", label: "Mexico City" },
        { id: "America/New_York", label: "New York" },
        { id: "America/Chicago", label: "Chicago" },
        { id: "America/Denver", label: "Denver" },
        { id: "America/Los_Angeles", label: "Los Angeles" },
        { id: "America/Sao_Paulo", label: "São Paulo" },
        { id: "America/Argentina/Buenos_Aires", label: "Buenos Aires" },
        { id: "America/Santiago", label: "Santiago, Chile" },
        { id: "Europe/London", label: "London" },
        { id: "Europe/Madrid", label: "Madrid" },
        { id: "Europe/Berlin", label: "Berlin" },
        { id: "Asia/Dubai", label: "Dubai" },
        { id: "Asia/Kolkata", label: "India (Kolkata)" },
        { id: "Asia/Singapore", label: "Singapore" },
        { id: "Asia/Tokyo", label: "Tokyo" },
        { id: "Australia/Sydney", label: "Sydney" },
        { id: "UTC", label: "UTC" },
      ],
    },
  },
  sources: {
    title: "Sources for the figures",
    intro: "Every number with a superscript can be traced. When the repository is private, I give the file and the date instead of a link.",
    items: {
    "ocr-pdf": {
      title: "Reader accuracy bench on digital PDFs",
      where: "rosimar1/cv-parser, README and docs/MEDICION_LECTOR.md (private)",
      date: "August 2026",
      note: "Ten PDFs generated with jsPDF, all with a perfect text layer: this measurement does not go through OCR. It is compared against 165 fields of a versioned ground truth.",
    },
    "ocr-medicion": {
      title: "Reader measurement on scans, contracts and real photos",
      where: "rosimar1/cv-parser, docs/MEDICION_LECTOR.md, sixteenth round (private)",
      date: "September 30, 2026",
      note: "The 89.8% on scans was measured with parallel reads that were dropped afterwards; on contracts, the serial version gave 90.0% and the parallel one 89.9%. Of the 17 real photos, only 8 are résumés.",
    },
    "ocr-evolucion": {
      title: "Accuracy over time on 40 synthetic scans",
      where: "rosimar1/cv-parser, docs/MEDICION_LECTOR.md, Resultado section (private)",
      date: "August and September 2026",
      note: "Includes the classifier regression (19.6%) and the later milestones on the same bench. The characters read (8 and 2,528) are from document CV_04, hard profile. The 20 documents with no email come from the section on the at sign.",
    },
    "ocr-nombres": {
      title: "The averaging mirage on names in the photos",
      where: "rosimar1/cv-parser, docs/MEDICION_LECTOR.md, sixth round (private)",
      date: "September 2026",
      note: "Only 2 of the 17 documents declare names in their ground truth; on those two the reader failed (0% and 20% similarity) until it was fixed.",
    },
    "ocr-tiempos": {
      title: "Time per document",
      where: "rosimar1/cv-parser, docs/MEDICION_LECTOR.md, sixteenth round (private)",
      date: "September 30, 2026",
      note: "15.7 s per photo and 57.8 s per contract, on a laptop with a Ryzen 7 5700U. With the same code, a contract took 48.8 s in the morning and 56.9 s in the afternoon.",
    },
    "parser-commits": {
      title: "Commit authorship in cv-parser",
      where: "git shortlog of rosimar1/cv-parser (private)",
      date: "October 9, 2026",
      note: "Fabian Gonzalez (my git user) 50, another team developer 41, Claude 27 and ImgBot 1: 119 in total.",
    },
    "fleet-commits": {
      title: "Commit authorship in fleet_control",
      where: "git shortlog of rosimar1/fleet_control (private)",
      date: "October 9, 2026",
      note: "Another team developer 17 and Fabian Gonzalez (my git user) 7: 24 in total.",
    },
    "fleet-tests": {
      title: "Tests when the migration closed",
      where: "rosimar1/fleet_control, commit d1cc1c2 (private)",
      date: "September 23, 2026",
      note: "35 calls to test() plus 14 cases generated by the permissions loop in test/integration/permissions.test.js. The commit message also says 48.",
    },
    "fleet-fixes": {
      title: "Bugs in the original fixed during the migration",
      where: "commit d1cc1c2 message and test/integration/auth.test.js in rosimar1/fleet_control (private)",
      date: "September 23, 2026",
      note: "An open redirect on login (there is a test: next=//evil.com is ignored) and a bulk-linking route that accepted GET without a CSRF token.",
    },
    "lograr-estado": {
      title: "State of the Wompi gateway",
      where: "lograr-sas/lograr-plataforma, docs/ESTADO-PROYECTO.md (private)",
      note: "The gateway is implemented and tested with cryptographic event verification; in production it needs the client's real credentials.",
    },
    "satis-commits": {
      title: "Contribution to the SATIS backend",
      where: "evidence register in Albonire/my-cv, docs/GUIA.md (private)",
      note: "30 of the 84 commits of ATIS-UP/AT-Backend.",
      href: "https://github.com/ATIS-UP/AT-Backend",
    },
    "satis-permisos": {
      title: "SATIS permissions and attempt lockout",
      where: "README and config.py of ATIS-UP/AT-Backend (public)",
      note: "29 granular permissions; lockout after 5 failed attempts for 15 minutes.",
      href: "https://github.com/ATIS-UP/AT-Backend",
    },
    "rzi-34gb": {
      title: "Memory of RZI's dense matrix",
      where: "Albonire/rzi-project, core/sor_solver.py (public)",
      note: "A 256 by 256 grid has 65,536 unknowns; the dense matrix would have 65,536 by 65,536 entries of 8 bytes, about 34.4 GB (32 GiB). The solver's docstring gives the same figure.",
      href: "https://github.com/Albonire/rzi-project",
    },
    "nwr-stars": {
      title: "Stars, forks and contributors of NotebookLM Watermark Remover",
      where: "evidence register in Albonire/my-cv (private)",
      date: "October 6, 2026",
      note: "80 stars, 24 forks and 4 outside contributors.",
      href: "https://github.com/Albonire/notebooklm-watermark-remover",
    },
    "cupido-commits": {
      title: "Contribution to the cUPido frontend",
      where: "evidence register in Albonire/my-cv (private)",
      note: "115 of the 351 commits of cupidoUP-App/cupido-frontend.",
    },
    "etl-registros": {
      title: "Records processed by the ETL pipeline",
      where: "README of Albonire/spark-glue-workshop (public)",
      note: "1,067,371 rows processed in the silver layer.",
      href: "https://github.com/Albonire/spark-glue-workshop",
    },
    "cuda-exactitud": {
      title: "Classifier metrics on the test set",
      where: "reporte/evidencias/final_metrics.md in Albonire/clasificador-imagenes-openmp-cuda (public)",
      note: "201 samples and an accuracy of 0.8259.",
      href: "https://github.com/Albonire/clasificador-imagenes-openmp-cuda",
    },
    "circuit-commits": {
      title: "Commit authorship in CircuitBreve",
      where: "git log of Albonire/CircuitBreve (public)",
      date: "October 9, 2026",
      note: "Fabian Gonzalez (my git user) 9, another contributor 4 (backend and a copy of the frontend) and ImgBot 1: 14 in total.",
      href: "https://github.com/Albonire/CircuitBreve",
    },
    "circuit-loc": {
      title: "Size of the CircuitBreve code",
      where: ".ts and .tsx files under src/ in Albonire/CircuitBreve (public)",
      date: "October 9, 2026",
      note: "4,544 lines.",
      href: "https://github.com/Albonire/CircuitBreve",
    },
    "circuit-readme": {
      title: "Declared capabilities of CircuitBreve",
      where: "README of Albonire/CircuitBreve (public)",
      note: "Truth tables for up to 10 inputs (1,024 rows) and export to SVG, PNG at 3x and PDF.",
      href: "https://github.com/Albonire/CircuitBreve",
    },
    "circuit-deps": {
      title: "Runtime dependencies of CircuitBreve",
      where: "package.json of Albonire/CircuitBreve (public)",
      note: "clsx, lucide-react, react, react-dom and tailwind-merge. No graph or circuit libraries.",
      href: "https://github.com/Albonire/CircuitBreve",
    },
    },
  },
  footer: "Anderson F. González. Built with Next.js and Tailwind.",
  notFound: {
    title: "I couldn't find that page",
    text: "The address doesn't exist or it moved.",
    link: "Go to the home page",
  },
  cases: {
    "talento-rosimar": {
      title: "Talento Rosimar: reading résumés in the browser",
      lead: "An HR system for a food distributor. The hard part is the reader: it turns PDF, Word, scans and photos into forms that a person only has to review.",
      meta: [
        { label: "Client", value: "Distribuciones Rosimar S.A.S., Barranquilla" },
        {
          label: "My part",
          value: "Development of the system, in a team of two. [[50 of the repository's 119 commits|parser-commits]] are mine.",
        },
        { label: "Period", value: "2026, ongoing" },
        { label: "Stack", value: "React, TypeScript, pdf.js, Tesseract.js, mammoth.js, Express, MariaDB" },
        { label: "Code", value: "Private" },
      ],
      links: [],
      sections: [
        {
          heading: "The problem",
          paragraphs: [
            "Rosimar receives résumés in every format: PDFs with text, scans, photos taken with a phone and Word files. Copying names, contact details, experience and education by hand is slow and error-prone. The system had to read those documents without paying for each one and without relying on an external language model.",
            "It also had to keep working offline. That's why text recognition runs inside the browser (it's a PWA) and the Tesseract files are served from the application itself, not from a CDN.",
          ],
        },
        {
          heading: "How it works",
          paragraphs: [
            "The reader is a deterministic four-stage process. It uses no language model and has no cost per document.",
          ],
          figures: [
            {
              kind: "flow",
              label: "The four stages of the reader",
              caption: "All three extraction routes produce the same thing: words with their bounding boxes.",
              steps: [
                {
                  title: "Extraction",
                  detail: "pdf.js for PDFs with text, Tesseract.js (WASM) for photos and scans, mammoth.js for Word.",
                },
                {
                  title: "Layout",
                  detail:
                    "Rebuilds lines and detects columns from the empty vertical gutter, so a sidebar is never mixed with the content.",
                },
                {
                  title: "Segmentation",
                  detail:
                    "Recognizes headings with a Spanish and English lexicon that tolerates OCR errors. With no headings, it classifies by content.",
                },
                {
                  title: "Extractors",
                  detail:
                    "One per field: names, contact, ID, dates, experience, education, languages. They use the DANE municipality list and a job-title dictionary.",
                },
              ],
            },
          ],
        },
        {
          heading: "What I measured, and what I hadn't",
          paragraphs: [
            "The first number I had was [[165 of 165 fields correct|ocr-pdf]]. It was true but misleading: that bench is ten PDFs generated by code, all with a perfect text layer, and that is not the path Rosimar uses. What arrives in practice is scans and photos, and that path hadn't been measured.",
            "I built a second bench with 40 synthetic Colombian résumés turned into degraded scans (noise, skew, poor lighting, recompression), a third with 17 real photos and a fourth with 12 contracts. Latest documented measurement: September 30, 2026.",
          ],
          table: {
            head: ["Bench", "Documents", "Result"],
            rows: [
              ["Digital PDFs, with a text layer", "10", "[[165 of 165 fields|ocr-pdf]]"],
              ["Synthetic scans", "40", "[[89.8%|ocr-medicion]] ([[63.4%|ocr-evolucion]] on the first measurement)"],
              ["Contracts", "12", "[[90.0%|ocr-medicion]]"],
              ["Real photos", "17", "[[75.9%|ocr-medicion]]"],
            ],
            note: "Only 8 of the 17 photos are résumés; the rest are contracts, certificates and handwritten forms.",
          },
          figures: [
            accuracyChart,
          ],
        },
        {
          heading: "What showed up when I measured the real path",
          bullets: [
            "pdf.js 6 uses a JavaScript function that Chrome 141 and earlier don't have, so scanned PDFs couldn't be read. A twelve-line fallback fixed it.",
            "A global Otsu threshold wiped out the hard scans. With a local Sauvola threshold, one document went [[from 8 to 2,528 characters read|ocr-evolucion]].",
            "Tesseract has trouble with the at sign: [[20 of the 40 documents|ocr-evolucion]] ended up with no email until the value was rebuilt.",
            "A change in the document classifier dropped overall accuracy [[from 73.9% to 19.6%|ocr-evolucion]]. It was caught by running the bench again.",
            "An average of 83% similarity on names in the photos hid that [[only two of the 17|ocr-nombres]] had a name to check, and on those two the reader failed. It was fixed afterwards.",
          ],
        },
        {
          heading: "Limits",
          bullets: [
            "Real photos (75.9%) are still far from the synthetic scans ([[89.8%|ocr-medicion]]).",
            "Handwritten forms don't read well. There is a TrOCR pilot that hasn't been tested against that bench yet.",
            "On a laptop with a Ryzen 7, each document takes [[between 16 seconds (photos) and 58 seconds (contracts)|ocr-tiempos]].",
            "The scans are synthetic: they resemble real ones but don't replace them.",
          ],
          closing:
            "One idea stays with me from this project: a 100% on the wrong bench is worse than an honest 75.9%, because the first one says there's nothing to fix.",
        },
      ],
    },
    "control-vehicular": {
      title: "Control Vehicular: from Flask to Node.js on the same schema",
      lead: "A web system that reads fuel e-invoices issued under Colombia's DIAN and reconciles them with a distributor's fleet refueling records. My part was rewriting the backend from Python to Node.js, keeping the schema and the routes.",
      meta: [
        { label: "Client", value: "Distribuciones Rosimar S.A.S." },
        {
          label: "My part",
          value:
            "The backend migration and several features ported afterwards. [[7 of the 24 commits|fleet-commits]] are mine; the original system and its reconciliation logic are by another developer on the team.",
        },
        { label: "Period", value: "September and October 2026" },
        { label: "Stack", value: "Node.js 22, Express 5, MySQL with mysql2 (plain SQL), Nunjucks, node:test and supertest" },
        { label: "Code", value: "Private. controlvehicular.rosimar.com has restricted access." },
      ],
      links: [],
      sections: [
        {
          heading: "Why migrate",
          paragraphs: [
            "The original application was written in Flask. The shared Hostinger hosting the client uses doesn't support Python frameworks, only on a VPS. It was rewritten, with one condition: don't change the behavior. Same MySQL schema, same routes, same screens. The only exception is the bugs in the original that were fixed along the way, listed below.",
          ],
        },
        {
          heading: "What was ported",
          bullets: [
            "Authentication with a lockout after 5 failed attempts for 15 minutes, per user and per IP.",
            "CSRF on every POST, multipart forms included, checked before any data is processed.",
            "The parser for DIAN e-invoices: a ZIP with XML and PDF, with XML that uses namespaces.",
            "Reconciliation of fuel records against invoices by period, auditing, analysis, and Excel and CSV import.",
            "Plain, parameterized SQL with no ORM. Sessions and invoice files live in the database, not on disk.",
            "A module that reproduces Python's rounding so the totals match the previous system.",
          ],
          figures: [
            {
              kind: "flow",
              label: "The path of a request",
              caption: "Each module (authentication, catalogs, invoices, fuel records, reconciliation, reports) has its own router.",
              steps: [
                { title: "Request", detail: "Security headers and a session stored in the database." },
                { title: "CSRF and permissions", detail: "The CSRF token is checked before any data is processed; the role limits which routes each user sees." },
                { title: "Router", detail: "One router per module. The admin, auxiliar and jefe roles each see their own part." },
                { title: "SQL", detail: "mysql2 with parameterized queries, no ORM." },
                { title: "Template", detail: "Nunjucks, with a syntax almost identical to the Jinja2 the original used." },
              ],
            },
          ],
        },
        {
          heading: "Bugs in the original that surfaced during the rewrite",
          paragraphs: ["Rewriting forces you to read every route. These problems came up and [[were fixed in the migration|fleet-fixes]]:"],
          bullets: [
            "An open redirect on login.",
            "The bulk-linking route accepted GET without a CSRF token.",
            "The xlsx receipt import saved a list instead of an integer.",
            "A misplaced cell in the invoice export.",
            "The count of new findings was wrong in the initial analysis.",
          ],
        },
        {
          heading: "How it was tested",
          paragraphs: [
            "When the migration closed there were [[48 tests|fleet-tests]], unit and integration, with node:test and supertest against a real MySQL database, no mocks. Each test file creates and drops its own `*_test` database, and the helper refuses to run against any server that isn't localhost.",
            "The Python code is kept in `legacy/`, as a reference and as a way back.",
          ],
        },
        {
          heading: "Limits",
          bullets: [
            "There is no continuous integration. What reaches `main` is deployed straight to Hostinger, so the tests are run by hand before every push.",
            "The tests need a local MySQL container.",
            "I didn't design the product. My part was the platform change and porting new features.",
          ],
        },
      ],
    },
    circuitbreve: {
      title: "CircuitBreve: a logic circuit simulator in the browser",
      lead: "You write a circuit in a language of its own, it compiles as you type and is drawn as a schematic. You can toggle the inputs to watch the signal propagate, get the truth table and export the result.",
      meta: [
        { label: "Type", value: "Open source, team of two" },
        {
          label: "My part",
          value: "The React application. [[9 of the 14 commits|circuit-commits]] are mine; the Python image-scanning prototype was added by another contributor.",
        },
        { label: "Period", value: "May 2026" },
        { label: "Stack", value: "React 19, TypeScript, Vite 7, Tailwind 4" },
        { label: "License", value: "MIT" },
      ],
      links: [
        { label: "Try the demo", href: "https://circuit-breve.vercel.app" },
        { label: "Code on GitHub", href: "https://github.com/Albonire/CircuitBreve" },
      ],
      sections: [
        {
          heading: "What it does",
          bullets: [
            "A language of its own (HDL) with modules, gates, inputs, outputs and nested expressions.",
            "It compiles as you type, with a 400 ms debounce.",
            "It draws the schematic in SVG with zoom and drag. Click an input and the signal propagates.",
            "It generates the truth table for [[up to 10 inputs (1,024 rows)|circuit-readme]] and extracts the Boolean expressions of the outputs.",
            "It exports to SVG, PNG at 3x and PDF.",
          ],
          figures: [
            {
              kind: "circuit",
              label: "Interactive full adder",
              caption: "The same circuit as the screenshots: two half adders and an OR gate. Switch the inputs and watch the signal travel.",
              hint: "Click A, B or Cin, or focus them and press Enter or Space.",
              summary: "in binary",
              tableLabel: "Truth table",
              inputLabels: ["A", "B", "Cin"],
              outputLabels: ["Sum", "Cout"],
            },
            {
              kind: "image",
              src: "/work/circuitbreve/esquema.webp",
              alt: "CircuitBreve in the light theme: a code editor on the left and the schematic of a full adder on the right, with inputs A, B and Cin switched on.",
              width: 1440,
              height: 900,
              caption: "A full adder written with two half-adder modules, with all three inputs on.",
            },
            {
              kind: "image",
              src: "/work/circuitbreve/tabla.webp",
              alt: "The truth table tab of CircuitBreve showing the eight input combinations of the full adder.",
              width: 1440,
              height: 900,
              caption: "The truth table of the same circuit, generated from the schematic.",
            },
          ],
        },
        {
          heading: "How it's built",
          paragraphs: [
            "Everything happens in the browser, with no server. The code is split by stage: a compiler (lexer, parser and graph builder), a simulator, a Sugiyama-style layered layout engine and the interface components. It is [[about 4,500 lines of TypeScript|circuit-loc]].",
            "[[The only runtime dependencies are React, clsx, tailwind-merge and an icon package|circuit-deps]]. There are no graph or circuit libraries: the parser, the simulation and the schematic layout are project code.",
          ],
        },
        {
          heading: "Limits",
          bullets: [
            "It has no automated tests and no continuous integration.",
            "The image-to-HDL scan is a prototype.",
            "The language requires every signal to be defined before it is used.",
          ],
        },
      ],
    },
  },
};
