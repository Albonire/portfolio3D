// La marca del sitio es una compuerta lógica AND dibujada como en un esquema: Anderson empieza por "AND" y el
// sitio incluye CircuitBreve y un sumador completo hecho con estas compuertas. Es el dibujo de public/icon.svg
// (la pestaña) en los colores del tema, sin recuadro. Aquí el trazo es más fino (2,4) que en el icono (3), que
// necesita más cuerpo para leerse a 16 px.
export default function Mark({ size = 28 }: { size?: number }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true" focusable="false" className="shrink-0">
      <path
        d="M9 5.5H16A10.5 10.5 0 0 1 16 26.5H9Z M2 11.5H9 M2 20.5H9 M26.5 16H30.5"
        className="stroke-accent"
        fill="none"
        strokeWidth="2.4"
        strokeLinejoin="miter"
      />
    </svg>
  );
}
