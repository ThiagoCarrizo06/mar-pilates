# Paquete de diseño · MAR Pilates

Las decisiones creativas del sitio, escritas antes de construir y consumidas por el
build. Sigue la plantilla de `references/design-package.md` de la skill 10K Websites,
adaptada para trabajar sin Higgsfield ni Hostinger.

---

## 1. La premisa

**La marea.**

El nombre es Mar. La ciudad es Mar del Plata. El logo tiene dos ondas celestes. Y el
carro del reformer se desliza y vuelve, una y otra vez, como el agua sobre la arena.

Esa es la idea que sostiene todo el sitio: acá el movimiento va y vuelve, sin apuro, y
cada cuerpo tiene su propio ritmo. Es lo opuesto a la lógica del gimnasio, que empuja a
todos al mismo tiempo y en la misma dirección.

**Tagline de la marca:**

> Cada cuerpo tiene su marea.

Cinco palabras que juntan el nombre, la atención personalizada, el movimiento y la
calma. No dice "premium" en ningún lado: lo demuestra.

---

## 2. La paleta

Muestreada del logo oficial con un histograma sobre el archivo, no elegida a ojo.

```css
:root{
  --canvas:   #FCFCFB;   /* blanco apenas calido, el fondo dominante */
  --surface:  #F2F2EF;   /* neutro suave para secciones alternas */
  --panel:    #FFFFFF;

  --azul:        #2A388C;   /* identidad, del logo */
  --azul-noche:  #1C2566;   /* pie */
  --azul-hondo:  #121A4A;   /* cierre */
  --celeste:     #00A8EE;   /* del logo, solo trazos y detalles */
  --celeste-luz: #7FD4F7;
  --celeste-txt: #0A6E9E;   /* unica variante legible como texto */

  --tinta:    #15183A;
  --tinta-2:  #5A6076;
}
```

**El azul es identidad, no fondo.** Solo dos superficies del sitio son azules: el cierre
y el pie. Todo lo demás es claro. El neutro es apenas cálido para que la página no se
lea como un bloque frío de azul.

**El celeste, en dosis mínimas.** `#00A8EE` da 2.4:1 sobre el lienzo, así que no sirve
para texto: se usa en la línea que se dibuja, la barra del plan destacado, el subrayado
del nav y los indicadores del hero. Cuando el celeste tiene que decir algo en palabras
se usa `--celeste-txt`, que da 5.1:1.

---

## 3. Tipografía

| Rol | Familia | Por qué |
|---|---|---|
| Display | **Fraunces** 300 a 600, más itálica | Serif variable con eje SOFT. Elegante y con carácter, sin ser el Playfair de todos los estudios de pilates. |
| Texto | **Manrope** 300 a 600 | Sans moderna y limpia, con una redondez sutil que rima con las ondas del logo. |
| Etiquetas | **DM Mono** 300 | Solo kickers y numeración. Precisión editorial en dosis chicas. |

Ni Inter ni Roboto, en ningún rol.

**Geometría:** un solo radio en todo el sitio, de 3px. Nada de pastillas ni de tarjetas
muy redondeadas.

---

## 4. El hero

**Recorrido por el estudio, resuelto con fotografía en vez de video.**

En pantallas de 900px o más la sección mide tres alturas de pantalla y el escenario
queda fijo. Al scrollear se atraviesan tres encuadres encadenados: entrada, sala,
detalle del reformer. Tres indicadores a la derecha marcan dónde va el recorrido.

Verificado: 0 a 33% encuadre uno, 35 a 66% encuadre dos, 70 a 100% encuadre tres.

**En celular no hay recorrido.** La sección vuelve a medir una pantalla, el escenario
deja de ser fijo y queda el primer encuadre con el mensaje encima. Sin scroll-jacking,
sin peso extra.

El velo del hero es un doble degradado calculado para fotografía real, no solo para el
placeholder: el texto blanco da 8.86:1 sobre la zona más clara.

---

## 5. El sistema gráfico

**La onda del logo, llevada a la página.**

| Dónde | Qué hace |
|---|---|
| Separador de pilares | Una línea que se dibuja sola al entrar en pantalla. El largo se mide en JS. |
| Cierre | Dos ondas desplazándose lentamente detrás del CTA final. |
| Indicadores del hero | Tres trazos horizontales que marcan el recorrido. |
| Favicon | Las dos ondas, en SVG embebido. |
| Placeholders | Cada uno lleva una onda celeste, para que el hueco pertenezca al sistema. |

---

## 6. Estructura, y por qué ningún vecino se repite

| # | Sección | Esqueleto |
|---|---|---|
| 1 | Navbar | Logo, links y CTA |
| 2 | Hero | Escenario fijo con recorrido, copy abajo a la izquierda |
| 3 | Presentación | Dos columnas asimétricas, texto izquierda |
| 4 | Beneficios | Tres columnas: lista, fotografía, lista |
| 5 | Clases | Encabezado partido, dos piezas con foto arriba |
| 6 | Pilares | Tipografía enorme, uno a la izquierda y otro a la derecha, línea entre medio |
| 7 | Experiencia | Dos columnas, fotografía a la izquierda |
| 8 | El espacio | Encabezado partido, galería asimétrica de cuatro |
| 9 | Precios | Tabla editorial de tres columnas con filete, no tarjetas |
| 10 | Preguntas | Encabezado pegajoso a la izquierda, acordeón a la derecha |
| 11 | Ubicación | Datos a la izquierda, fotografía a la derecha |
| 12 | Cierre | A sangre, azul profundo, centrado |
| 13 | Pie | Cuatro columnas |

La sección 6 es la de más peso visual del sitio, como pedía el briefing: atención
personalizada y grupos reducidos en tipografía de 86px, enfrentadas, con la onda
dibujándose entre las dos y una fotografía ancha debajo.

---

## 7. Movimiento

Dos curvas de easing como tokens, usadas en todo el sitio. Nada salta, nada rebota.

- Entradas por IntersectionObserver, con escalonado de 70 a 210ms.
- Los retrasos se retiran al terminar la entrada, para que el hover no arrastre.
- Parallax leve, solo sobre imágenes, nunca sobre texto.
- El recorrido del hero escribe en el DOM solo cuando cambia el encuadre.
- Todo corre sobre `transform` y `opacity`.
- Las animaciones se pausan en pestañas ocultas.

---

## 8. Conversión

Sin backend ni formulario. Todos los CTA van a WhatsApp, distribuidos donde el briefing
los pidió y en ningún lado más: **hero, después de clases, precios y cierre**, más el
del navbar. Diez enlaces en total, todos con el mismo mensaje prellenado.

En celular se suma un botón flotante, porque la mayoría del tráfico llega desde
Instagram y ahí el CTA tiene que estar siempre a mano. En desktop no aparece.

Número usado: `5492235859366`. **Pendiente de confirmación:** el briefing anterior daba
uno distinto.

---

## 9. Fotografía

Catorce espacios reservados, cada uno con su proporción ya definida. Los placeholders
son marcos con marcas de esquina, la onda de la marca y la leyenda de qué foto va
adentro. Están hechos para que se note que falta la foto, no para pasar por una.

La lista completa, con ángulo y encuadre, está en `FOTOS-QUE-NECESITO.md`.
