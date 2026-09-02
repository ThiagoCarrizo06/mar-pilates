# MAR Pilates · sitio web

Landing del estudio de Pilates Reformer en La Madrid 4702, Mar del Plata.
HTML, CSS y JavaScript vanilla. Sin frameworks, sin build step, sin dependencias.

```
mar-pilates/
├── index.html              todo el marcado
├── styles.css              tokens, layout y componentes
├── script.js               navbar, menu, recorrido del hero, entradas y parallax
├── assets/
│   ├── logo-mar-pilates.png
│   └── img/                10 fotos reales en WebP + 4 espacios reservados
├── PAQUETE-DE-DISENO.md    las decisiones creativas
├── FOTOS-QUE-NECESITO.md   que fotografiar, encuadre por encuadre
└── README.md
```

Código: 73 KB entre los tres archivos.

## Verlo

Doble clic en `index.html` funciona: el sitio no depende de `fetch` para nada.
Con servidor local:

```bash
npx --yes serve "C:/Users/tcarr/Proyecto Pilates/mar-pilates" -l 4173
```

## Publicarlo

No hay build. Se arrastra la carpeta a Netlify Drop, Vercel o Cloudflare Pages.

Antes de publicar, completar las dos etiquetas marcadas `<!-- DEPLOY STEP -->` en el
`<head>`: `og:url` y `og:image` necesitan la URL absoluta, que recién existe online.

## Qué se verificó

Auditado en el navegador, no asumido:

- **Recorrido del hero:** cambia de encuadre en 0 a 33%, 35 a 66% y 70 a 100%, con los
  indicadores siguiendo. En celular no se arma: una sola pantalla, sin scroll fijo.
- **Contraste:** cero textos por debajo de 4.5:1. El hero da 8.86:1. Cero texto menor a 12px.
- **Táctil:** cero objetivos por debajo de 44px, salvo enlaces dentro de una oración.
- **WhatsApp:** los 10 enlaces apuntan a `5492235859366` con el mismo mensaje prellenado.
  El número viejo del briefing anterior no aparece en ningún lado.
- **Responsive:** sin scroll horizontal a 375px ni a 1280px. Las grillas colapsan a una
  columna y el navbar cambia a menú propio. El flotante de WhatsApp aparece solo en celular.
- **Sin JavaScript:** cero elementos ocultos. La clase `anim` nunca se agrega.
- **Movimiento reducido:** probado en las dos direcciones. Todo en su estado final, la
  línea dibujada, el recorrido del hero desarmado.
- **Menú móvil:** abre, cierra con Escape y al elegir un destino, con `aria-expanded`
  y label dinámico.
- **Consola:** cero errores.
- **Copy:** cero guiones largos, cero palabras de relleno, cero frases prohibidas por
  el briefing.
- **Semántica:** un solo `h1`, jerarquía sin saltos, las 16 imágenes con `alt`,
  landmarks, skip link y anillo de foco visible.

## Pendiente

1. **Cuatro fotografías, todas con gente.** Clase en curso, una corrección de cerca, la
   sala con alumnas, y un retrato de la instructora. Ninguna de las diez fotos actuales
   tiene personas, y esas cuatro ranuras son las que venden la atención personalizada.
   Detalle en `FOTOS-QUE-NECESITO.md`.
2. **Confirmar el número de WhatsApp.** Los dos briefings dieron números distintos.
3. **Originales de cámara**, si los tenés. Las fotos actuales llegaron a 900x1600, que
   es el tamaño al que WhatsApp recomprime.

El material que no usa el sitio (videos y logo original) quedó en `../_material/`.
