import type { Content } from "./types";

export const en: Content = {
  htmlLang: "en",
  meta: {
    title: "Anderson F. González, full-stack developer",
    description:
      "Full-stack developer and Systems Engineering student in Colombia. Production web systems with Node.js, Laravel and React. Case studies and résumé.",
  },
  ui: {
    skip: "Skip to content",
    home: "Home",
    switchLabel: "Language",
    switchTo: "Español",
    back: "Back to work",
    caseStudy: "Case study",
    private: "Private code",
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
    role: "Full-stack developer",
    intro:
      "I'm studying Systems Engineering at the University of Pamplona, Colombia. Since August 2026 I've been developing and deploying web systems for two Colombian companies: a résumé reader with OCR, a fuel-control system migrated from Flask to Node, and a course platform with a payment gateway. I'm available from January 2027 for an internship or employment.",
    facts: [
      { label: "Location", value: "Pamplona, Colombia" },
      { label: "Available", value: "From January 2027" },
      { label: "Studying", value: "Systems Engineering, ninth semester" },
      { label: "Languages", value: "Spanish native, English B2, Japanese basic" },
    ],
    cvPrimary: { label: "Résumé (PDF)", href: "/cv/Anderson_Gonzalez_CV_EN.pdf" },
    cvSecondary: { label: "CV in Spanish (PDF)", href: "/cv/Anderson_Gonzalez_Hoja_de_Vida.pdf" },
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
          "165 of 165 fields correct on 10 digital PDFs",
          "89.8% accuracy on 40 synthetic scans and 75.9% on 17 real photos",
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
          "48 tests against a real MySQL database, no mocks",
          "Fixed an open redirect on login and a route that accepted GET without CSRF",
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
          "Compiler, simulator and schematic layout written without graph or circuit libraries",
          "Truth tables up to 1,024 rows",
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
        facts: ["The gateway is tested but has no real transactions yet: production credentials are still pending"],
        links: [],
      },
      {
        title: "Early Warning System (SATIS)",
        context: "Team project, University of Pamplona",
        period: "2026",
        stack: "FastAPI, SQLAlchemy, Alembic, PostgreSQL, React 19",
        summary:
          "A system to flag students at risk of dropping out. I built the JWT authentication with refresh tokens, the role permissions and the backend migrations (30 of 84 commits).",
        facts: ["29 granular permissions and a lockout after 5 failed attempts for 15 minutes"],
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
          "The solver never builds the matrix: a 256 by 256 grid would take about 34 GB in dense form",
        ],
        links: [{ label: "Code", href: "https://github.com/Albonire/rzi-project" }],
      },
    ],
    alsoTitle: "Also",
    also: [
      {
        title: "NotebookLM Watermark Remover",
        text: "A command-line tool that cleans PDF, PPTX and image files with inpainting. 80 stars and 24 forks on GitHub, with contributions from four outside developers (figures from October 2026).",
        href: "https://github.com/Albonire/notebooklm-watermark-remover",
        linkLabel: "Code",
      },
      {
        title: "cUPido",
        text: "A social app for university students, built as a team. I'm the top contributor to the React and TypeScript frontend (115 of 351 commits).",
        href: "https://cupido-sandy.vercel.app",
        linkLabel: "Demo",
      },
      {
        title: "AWS ETL pipeline",
        text: "A layered flow (bronze, silver and gold) with AWS Glue, Step Functions and Athena over 1,067,371 sales records. Academic project.",
        href: "https://github.com/Albonire/spark-glue-workshop",
        linkLabel: "Documentation",
      },
      {
        title: "Eye-state classifier with CUDA",
        text: "OpenMP preprocessing and CUDA training, in a team of six. My part was the CUDA backward pass and the weight export. 82.6% accuracy on 201 test samples.",
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
          "Developed and deployed talento.rosimar.com, an HR and recruiting PWA (React, JWT API, MariaDB) with a browser-based OCR résumé parser that extracted 165 of 165 fields on 10 digital PDFs and reaches 89.8% on 40 test scans.",
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
    emailLabel: "Email",
    items: [
      { label: "LinkedIn", href: "https://www.linkedin.com/in/anderson-gonzaleza21/" },
      { label: "GitHub", href: "https://github.com/Albonire" },
    ],
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
          value: "Development of the system, in a team of two. 50 of the repository's 119 commits are mine.",
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
            "The first number I had was 165 of 165 fields correct. It was true but misleading: that bench is ten PDFs generated by code, all with a perfect text layer, and that is not the path Rosimar uses. What arrives in practice is scans and photos, and that path hadn't been measured.",
            "I built a second bench with 40 synthetic Colombian résumés turned into degraded scans (noise, skew, poor lighting, recompression) and a third with 17 real photos. Latest documented measurement: September 30, 2026.",
          ],
          table: {
            head: ["Bench", "Documents", "Result"],
            rows: [
              ["Digital PDFs, with a text layer", "10", "165 of 165 fields"],
              ["Synthetic scans", "40", "89.8% (63.4% on the first measurement)"],
              ["Contracts", "12", "90.0%"],
              ["Real photos", "17", "75.9%"],
            ],
            note: "Only 8 of the 17 photos are résumés; the rest are contracts, certificates and handwritten forms.",
          },
        },
        {
          heading: "What showed up when I measured the real path",
          bullets: [
            "pdf.js 6 uses a JavaScript function that Chrome 141 and earlier don't have, so scanned PDFs couldn't be read. A twelve-line fallback fixed it.",
            "A global Otsu threshold wiped out the hard scans. With a local Sauvola threshold, one document went from 8 to 2,528 characters read.",
            "Tesseract has trouble with the at sign: 20 of the 40 documents ended up with no email until the value was rebuilt.",
            "A change in the document classifier dropped overall accuracy from 73.9% to 19.6%. It was caught by running the bench again.",
            "An average of 83% similarity on names in the photos hid that only two of the 17 had a name to check, and on those two the reader failed. It was fixed afterwards.",
          ],
        },
        {
          heading: "Limits",
          bullets: [
            "Real photos (75.9%) are still far from clean scans, which are above 90%.",
            "Handwritten forms don't read well. There is a TrOCR pilot that hasn't been tested against that bench yet.",
            "On a laptop with a Ryzen 7, each document takes between 16 seconds (photos) and 58 seconds (contracts).",
            "The scans are synthetic: they resemble real ones but don't replace them.",
          ],
          closing:
            "One idea stays with me from this project: a 100% on the wrong bench is worse than an honest 76%, because the first one says there's nothing to fix.",
        },
      ],
    },
    "control-vehicular": {
      title: "Control Vehicular: migrating from Flask to Node.js without changing behavior",
      lead: "A web system that reads fuel e-invoices issued under Colombia's DIAN and reconciles them with a distributor's fleet refueling records. My part was rewriting the backend from Python to Node.js, keeping the schema and the routes.",
      meta: [
        { label: "Client", value: "Distribuciones Rosimar S.A.S." },
        {
          label: "My part",
          value:
            "The backend migration and several features ported afterwards. 7 of the 24 commits are mine; the original system and its reconciliation logic are by another developer on the team.",
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
            "The original application was written in Flask. The shared Hostinger hosting the client uses doesn't support Python frameworks, only on a VPS. It was rewritten, with one condition: don't change the behavior. Same MySQL schema, same routes, same screens.",
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
          paragraphs: ["Rewriting forces you to read every route. These problems came up and were fixed in the migration:"],
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
            "When the migration closed there were 48 tests, unit and integration, with node:test and supertest against a real MySQL database, no mocks. Each test file creates and drops its own `*_test` database, and the helper refuses to run against any server that isn't localhost.",
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
          value: "The React application. 9 of the 14 commits are mine; the Python image-scanning prototype was added by another contributor.",
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
            "It generates the truth table for up to 10 inputs (1,024 rows) and extracts the Boolean expressions of the outputs.",
            "It exports to SVG, PNG at 3x and PDF.",
          ],
          figures: [
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
            "Everything happens in the browser, with no server. The code is split by stage: a compiler (lexer, parser and graph builder), a simulator, a Sugiyama-style layered layout engine and the interface components. It is about 4,500 lines of TypeScript.",
            "The only runtime dependencies are React, clsx, tailwind-merge and an icon package. There are no graph or circuit libraries: the parser, the simulation and the schematic layout are project code.",
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
