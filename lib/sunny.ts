// Constantes del modo Sol que comparten el interruptor (components/Sunny.tsx, en el cliente) y el layout (en el servidor).
export const SUNNY_KEY = "sunny";

// Las teselas del bordado (public/textile-tiles.css, unos 12 KB comprimidos) no van en el CSS del sitio: se piden la
// primera vez que se enciende el modo, así quien no lo usa no las descarga.
export const SUNNY_TILES_ID = "sunny-tiles";
export const SUNNY_TILES_HREF = "/textile-tiles.css";

// Se ejecuta al empezar el <body>, antes de pintar. Si el modo venía encendido (cambio de idioma o recarga), pone el
// atributo y pide las teselas de una vez: sin esto la página aparecía en claro y saltaba a Sol al hidratar.
export const SUNNY_BOOT = `(function(){try{if(sessionStorage.getItem(${JSON.stringify(SUNNY_KEY)})==="on"){var d=document,l=d.createElement("link");l.id=${JSON.stringify(SUNNY_TILES_ID)};l.rel="stylesheet";l.href=${JSON.stringify(SUNNY_TILES_HREF)};d.head.appendChild(l);d.documentElement.setAttribute("data-sunny","")}}catch(e){}})()`;
