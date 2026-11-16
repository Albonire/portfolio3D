import Thread from "./Thread";

// La marca del sitio es una compuerta lógica AND dibujada como en un esquema: Anderson empieza por "AND" y el
// sitio incluye CircuitBreve y un sumador completo hecho con estas compuertas. Es el dibujo de public/icon.svg
// (la pestaña) en los colores del tema, sin recuadro. Aquí el trazo es más fino (2,4) que en el icono (3), que
// necesita más cuerpo para leerse a 16 px.
//
// Con el modo Sol la compuerta va bordada en pespunte: las patas y los tramos rectos cortos son una puntada cada uno,
// el lado izquierdo tres y el arco cinco. El hueco entre puntadas (3,3) es el grosor del hilo más lo que se ve.
const STITCH = 2.5;
export default function Mark({ size = 28 }: { size?: number }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true" focusable="false" className="shrink-0 overflow-visible">
      <path
        d="M9 5.5H16A10.5 10.5 0 0 1 16 26.5H9Z M2 11.5H9 M2 20.5H9 M26.5 16H30.5"
        className="tx-sol-hide stroke-accent"
        fill="none"
        strokeWidth="2.4"
        strokeLinejoin="miter"
      />
      <g className="tx-sol-only">
        <Thread d="M2.2 11.5H7.6M2.2 20.5H7.6M27.8 16H30.6" tone="navy" w={STITCH} />
        <Thread d="M9 26.5V5.5" tone="navy" w={STITCH} dash="4.8 3.3" />
        <Thread d="M9.3 5.5H15.6M15.6 26.5H9.3" tone="navy" w={STITCH} />
        <Thread d="M16.4 5.5A10.5 10.5 0 0 1 16.4 26.5" tone="navy" w={STITCH} dash="3.96 3.3" />
      </g>
    </svg>
  );
}
