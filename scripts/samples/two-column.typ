// Hoja de vida de muestra con diseño de dos columnas. Todos los datos son inventados.
// Se compila con: python3 -c "import typst; ..." (ver README, apartado "Muestras del lector").
#let lang = sys.inputs.at("lang", default: "es")
#let t(es, en) = if lang == "es" { es } else { en }

#set page(paper: "a4", margin: (x: 1.6cm, y: 1.5cm))
#set text(font: ("Liberation Sans", "DejaVu Sans"), size: 9.5pt, lang: lang)
#set par(leading: 0.6em)

#let head(body) = block(above: 1.1em, below: 0.5em)[
  #text(size: 10pt, weight: "bold", fill: rgb("#1f3a5f"))[#upper(body)]
]

#text(size: 20pt, weight: "bold")[Camila Ejemplo]
#v(-0.3em)
#text(size: 11pt, fill: luma(90))[#t("Analista de datos", "Data analyst")]
#v(0.4em)

#grid(
  columns: (5.2cm, 1fr),
  column-gutter: 0.9cm,
  [
    #head(t("Contacto", "Contact"))
    camila.ejemplo\@example.com \
    +57 300 000 0000 \
    #t("Bogotá, Colombia", "Bogotá, Colombia") \
    linkedin.com/in/camila-ejemplo

    #head(t("Habilidades", "Skills"))
    Python, SQL, pandas \
    #t("Visualización con Tableau", "Tableau dashboards") \
    #t("Pruebas automatizadas", "Automated testing") \
    Git, Docker

    #head(t("Idiomas", "Languages"))
    #t("Español nativo", "Spanish, native") \
    #t("Inglés B2", "English, B2")

    #head(t("Certificaciones", "Certifications"))
    #t("Fundamentos de SQL, 2025", "SQL Fundamentals, 2025")
  ],
  [
    #head(t("Perfil", "Summary"))
    #t(
      "Analista de datos con dos años de experiencia limpiando y modelando datos de ventas. Trabajo con Python y SQL y documento cada reporte para que otra persona pueda repetirlo.",
      "Data analyst with two years of experience cleaning and modeling sales data. I work with Python and SQL and document each report so someone else can repeat it.",
    )

    #head(t("Experiencia", "Experience"))
    #grid(columns: (1fr, auto), [*#t("Analista de datos", "Data analyst")*, Comercial Ejemplo S.A.S.], [2024 - 2026])
    #list(
      t("Reduje de 3 horas a 20 minutos el cierre mensual de ventas al automatizar la consolidación en Python.", "Cut the monthly sales close from 3 hours to 20 minutes by automating the consolidation in Python."),
      t("Armé 12 consultas SQL con pruebas contra una copia de la base de datos.", "Wrote 12 SQL queries tested against a copy of the database."),
      t("Documenté las fuentes de cada cifra del reporte para el equipo comercial.", "Documented the source of every figure in the report for the sales team."),
    )
    #v(0.4em)
    #grid(columns: (1fr, auto), [*#t("Practicante de sistemas", "Systems intern")*, Tienda Ejemplo], [2023 - 2024])
    #list(
      t("Mantuve el inventario en una hoja de cálculo con validaciones que evitaron 40 errores de digitación al mes.", "Maintained the inventory spreadsheet with validations that prevented 40 data entry errors a month."),
      t("Capacité a cuatro personas en el uso del nuevo formato de pedidos.", "Trained four people on the new order form."),
    )

    #head(t("Educación", "Education"))
    #grid(columns: (1fr, auto), [*#t("Ingeniería de Sistemas", "Systems Engineering")*, Universidad Ejemplo], [2020 - 2025])
    #t("Trabajo de grado sobre calidad de datos en pequeñas empresas.", "Thesis on data quality in small businesses.")
  ],
)
