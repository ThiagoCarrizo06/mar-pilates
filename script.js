/* ============================================================
   MAR PILATES · interaccion y movimiento
   Vanilla, sin librerias. Solo transform y opacity, para que todo
   corra en el hilo del compositor.
   ============================================================ */
(function () {
  'use strict';

  var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  var mqBig = window.matchMedia('(min-width: 900px)');
  var root = document.documentElement;

  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- Navbar ---------- */
  var nav = document.getElementById('nav');
  var onNav = function () { nav.classList.toggle('stuck', window.scrollY > 20); };
  onNav();
  window.addEventListener('scroll', onNav, { passive: true });

  /* ---------- Menu movil ---------- */
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');
  function closeMenu() {
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Abrir menú');
    menu.hidden = true;
  }
  burger.addEventListener('click', function () {
    if (burger.getAttribute('aria-expanded') === 'true') return closeMenu();
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Cerrar menú');
    menu.hidden = false;
  });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') { closeMenu(); burger.focus(); }
  });

  /* ---------- Pausa en pestañas ocultas ---------- */
  document.addEventListener('visibilitychange', function () {
    document.body.classList.toggle('paused', document.hidden);
  });

  /* ============================================================
     PLANES · seleccion y modal
     La tarjeta se sigue eligiendo como antes: son radios y el CTA de la
     seccion se reescribe solo. Lo que cambia es el final del camino: en
     vez de saltar a WhatsApp, abre el modal para elegir la forma de
     abono. El nombre del plan y el numero se leen del DOM, no estan
     duplicados aca: si manana cambian, el mensaje cambia solo.
     ============================================================ */
  (function () {
    var cta = document.getElementById('ctaPlan');
    var nota = document.getElementById('ctaPlanNota');
    var radios = [].slice.call(document.querySelectorAll('.tar input[type="radio"]'));
    var modal = document.getElementById('modalPlan');
    if (!cta || !radios.length) return;

    // Estado de arranque, para poder volver a el
    var baseHref = cta.getAttribute('href');
    // Se escribe en el span, no en textContent: eso borraria el icono SVG
    var etiqueta = cta.querySelector('span') || cta;
    var baseTexto = etiqueta.textContent.trim();
    var baseNota = nota ? nota.textContent.trim() : '';
    var resto = baseHref.split('wa.me/')[1];
    var tel = resto && resto.split(/[^0-9]/)[0];
    if (!tel) return;

    function nombreDelPlan(radio) {
      var tarjeta = radio.closest('.tar');
      var f = tarjeta && tarjeta.querySelector('.tar__f');
      return f ? f.textContent.trim() : '';
    }
    function elegido() {
      for (var i = 0; i < radios.length; i++) if (radios[i].checked) return radios[i];
      return null;
    }

    function actualizar() {
      radios.forEach(function (r) {
        // Respaldo por si el navegador no soporta :has()
        var t = r.closest('.tar');
        if (t) t.classList.toggle('is-elegida', r.checked);
      });
      var r = elegido();
      if (!r) {
        etiqueta.textContent = baseTexto;
        if (nota) nota.textContent = baseNota;
        return;
      }
      var nombre = nombreDelPlan(r);
      etiqueta.textContent = 'Continuar con este plan';
      if (nota) nota.textContent = 'Elegiste el plan de ' + nombre + '. Los horarios están sujetos a disponibilidad.';
    }
    radios.forEach(function (r) { r.addEventListener('change', actualizar); });
    actualizar();   // el navegador puede recordar la seleccion al volver atras

    /* ---- Modal ---- */
    if (!modal) return;
    var sub = document.getElementById('modalSub');
    var ir = document.getElementById('modalIr');
    var caja = modal.querySelector('.modal__caja');
    var opciones = [].slice.call(modal.querySelectorAll('input[name="abono"]'));

    var FRASES = {
      estandar:   'Quiero abonar el mes estándar',
      mayor:      'Aplico al descuento de mayor de 60',
      trimestral: 'Quiero abonar los 3 meses juntos'
    };
    var planActual = '', quienAbrio = null;

    function abonoElegido() {
      for (var i = 0; i < opciones.length; i++) if (opciones[i].checked) return opciones[i].value;
      return 'estandar';
    }
    function mensaje() {
      return 'Hola! Vengo de la web y me interesa el plan de ' + planActual + '. ' +
             FRASES[abonoElegido()] + '. ¿Me pasarías los horarios disponibles?';
    }
    function abrir(plan, origen) {
      planActual = plan;
      quienAbrio = origen;
      sub.textContent = 'Plan: ' + plan;
      opciones[0].checked = true;             // cada apertura arranca limpia
      refrescarEnlace();
      modal.hidden = false;
      document.body.classList.add('modal-abierto');
      (opciones[0] || caja).focus();
    }
    function cerrar() {
      modal.hidden = true;
      document.body.classList.remove('modal-abierto');
      if (quienAbrio) quienAbrio.focus();     // el foco vuelve de donde salio
      quienAbrio = null;
    }

    // Boton propio de cada tarjeta: elige el plan y abre el modal
    [].slice.call(document.querySelectorAll('.tar__cta')).forEach(function (b) {
      b.addEventListener('click', function () {
        var r = b.closest('.tar').querySelector('input[type="radio"]');
        if (r) { r.checked = true; actualizar(); }
        abrir(b.getAttribute('data-plan') || '', b);
      });
    });

    // CTA de la seccion: con un plan elegido abre el modal; sin plan
    // sigue siendo la consulta general de horarios, como antes.
    cta.addEventListener('click', function (e) {
      var r = elegido();
      if (!r) return;                          // deja pasar el enlace original
      e.preventDefault();
      abrir(nombreDelPlan(r), cta);
    });

    modal.addEventListener('click', function (e) {
      if (e.target.closest('[data-cerrar]')) cerrar();
    });
    // El href se mantiene al dia y el navegador navega solo. Antes esto
    // era window.open, y los navegadores embebidos lo bloquean sin avisar.
    function refrescarEnlace() {
      ir.setAttribute('href', 'https://wa.me/' + tel + '?text=' + encodeURIComponent(mensaje()));
    }
    opciones.forEach(function (o) { o.addEventListener('change', refrescarEnlace); });
    ir.addEventListener('click', function () { setTimeout(cerrar, 0); });
    document.addEventListener('keydown', function (e) {
      if (modal.hidden) return;
      if (e.key === 'Escape') return cerrar();
      if (e.key !== 'Tab') return;
      // Cepo de foco: mientras esta abierto, el tabulado no sale de la caja
      var foco = caja.querySelectorAll('button, input, [href], [tabindex]:not([tabindex="-1"])');
      if (!foco.length) return;
      var primero = foco[0], ultimo = foco[foco.length - 1];
      if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
    });
  })();

  /* ============================================================
     ENLACES EXTERNOS · red de seguridad
     target="_blank" no hace nada dentro del navegador embebido de
     Instagram ni en un iframe con sandbox: la ventana nueva se bloquea
     sin aviso y el visitante cree que el boton esta roto. Si no abrio,
     se navega en la misma pestana. En wa.me eso es incluso mejor en
     telefono: el sistema abre la app y no queda una pestana en blanco.
     ============================================================ */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[target="_blank"][href^="http"]');
    if (!a || e.defaultPrevented) return;
    // No tocar el clic con modificadores ni el del boton del medio
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    var w = window.open(a.href, '_blank', 'noopener');
    if (!w || w.closed || typeof w.closed === 'undefined') window.location.href = a.href;
  });

  /* ============================================================
     HERO · el recorrido por el estudio
     El scroll dentro de la seccion avanza entre tres encuadres.
     Solo se arma en pantallas grandes y con movimiento activo.
     ============================================================ */
  var hero = document.querySelector('.hero');
  var frames = [].slice.call(document.querySelectorAll('.hero__frame'));
  var pips = [].slice.call(document.querySelectorAll('.hero__pips span'));
  var heroActivo = false, heroRaf = 0, heroActual = -1;

  function heroPintar() {
    heroRaf = 0;
    var r = hero.getBoundingClientRect();
    var total = hero.offsetHeight - window.innerHeight;
    if (total <= 0) return;
    var p = Math.max(0, Math.min(1, -r.top / total));
    // Tramos iguales segun cuantos encuadres haya. El ultimo se sostiene
    // hasta el final, asi el titular queda quieto sobre una imagen fija.
    var i = Math.min(frames.length - 1, Math.floor(p * frames.length));
    if (i === heroActual) return;          // escribir en el DOM solo si cambio
    heroActual = i;
    for (var k = 0; k < frames.length; k++) frames[k].classList.toggle('is-on', k === i);
    for (var j = 0; j < pips.length; j++) pips[j].classList.toggle('is-on', j === i);
  }
  function heroScroll() { if (!heroRaf) heroRaf = requestAnimationFrame(heroPintar); }

  function armarHero() {
    if (!hero || heroActivo) return;
    if (mq.matches || !mqBig.matches) return;
    heroActivo = true; heroActual = -1;
    heroPintar();
    window.addEventListener('scroll', heroScroll, { passive: true });
    window.addEventListener('resize', heroScroll, { passive: true });
  }
  function desarmarHero() {
    if (!heroActivo) return;
    heroActivo = false; heroActual = -1;
    window.removeEventListener('scroll', heroScroll);
    window.removeEventListener('resize', heroScroll);
    for (var k = 0; k < frames.length; k++) frames[k].classList.toggle('is-on', k === 0);
    for (var j = 0; j < pips.length; j++) pips[j].classList.toggle('is-on', j === 0);
  }
  mqBig.addEventListener('change', function (e) { e.matches ? armarHero() : desarmarHero(); });

  /* ============================================================
     Entradas al entrar en pantalla
     ============================================================ */
  var io = null;
  function armarEntradas() {
    if (mq.matches) return;
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        el.classList.add('in');
        setTimeout(function () { el.classList.add('done'); }, 1200);
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    document.querySelectorAll('.rev').forEach(function (el) { io.observe(el); });
    var h1 = document.querySelector('.hero__h1');
    if (h1) requestAnimationFrame(function () { h1.classList.add('in'); });
  }

  /* ============================================================
     La linea del separador se dibuja sola
     ============================================================ */
  function armarLinea() {
    var box = document.querySelector('.pilar__sep');
    var path = document.getElementById('sepPath');
    if (!box || !path) return;
    box.style.setProperty('--len', Math.ceil(path.getTotalLength()));
    if (mq.matches) return;
    var o = new IntersectionObserver(function (en) {
      if (en[0].isIntersecting) { box.classList.add('drawn'); o.disconnect(); }
    }, { threshold: 0.4 });
    o.observe(box);
  }

  /* ============================================================
     Parallax muy leve, solo sobre imagenes
     ============================================================ */
  var pxEls = [], pxRaf = 0;
  function pxPintar() {
    pxRaf = 0;
    var vh = window.innerHeight;
    for (var i = 0; i < pxEls.length; i++) {
      var el = pxEls[i], r = el.getBoundingClientRect();
      if (r.bottom < -120 || r.top > vh + 120) continue;
      // La escala deja sobrar (escala-1)/2 arriba y abajo. Si el desplazamiento
      // supera ese sobrante, la imagen se despega del recuadro y aparece una
      // franja de fondo. Antes se desplazaba hasta amt/2 y solo sobraba amt/3.
      // Se acota el recorrido en vez de agrandar la escala, para no recortar mas.
      var amt = parseFloat(el.dataset.par) || 6;
      var escala = 1 + amt / 150;
      var tope = (escala - 1) / 2 * 100 - 0.4;      // el colchon son ~2px
      var p = (r.top + r.height / 2 - vh / 2) / vh;
      var desp = Math.max(-tope, Math.min(tope, p * amt));
      el.style.transform = 'translate3d(0,' + desp.toFixed(2) + '%,0) scale(' + escala.toFixed(4) + ')';
    }
  }
  function pxScroll() { if (!pxRaf) pxRaf = requestAnimationFrame(pxPintar); }
  var mqParallax = window.matchMedia('(min-width: 768px)');
  function armarParallax() {
    if (mq.matches) return;
    // En telefono el parallax no se aprecia y obliga a escalar la imagen,
    // que recorta la foto. Ahi la composicion vale mas que el efecto.
    if (!mqParallax.matches) { desarmarParallax(); return; }
    pxEls = [].slice.call(document.querySelectorAll('[data-par]'));
    pxPintar();
    window.addEventListener('scroll', pxScroll, { passive: true });
    window.addEventListener('resize', pxScroll, { passive: true });
  }
  mqParallax.addEventListener('change', function () {
    if (mq.matches) return;
    mqParallax.matches ? armarParallax() : desarmarParallax();
  });
  function desarmarParallax() {
    window.removeEventListener('scroll', pxScroll);
    pxEls.forEach(function (el) { el.style.transform = ''; });
    pxEls = [];
  }

  /* ============================================================
     Movimiento reducido, en vivo y en las dos direcciones
     ============================================================ */
  function fijarFinal() {
    root.classList.add('no-motion');
    if (io) { io.disconnect(); io = null; }
    desarmarParallax();
    desarmarHero();
    var box = document.querySelector('.pilar__sep'); if (box) box.classList.add('drawn');
    document.querySelectorAll('.rev').forEach(function (el) { el.classList.add('in', 'done'); });
    var h1 = document.querySelector('.hero__h1'); if (h1) h1.classList.add('in');
  }
  function soltar() {
    root.classList.remove('no-motion');
    document.querySelectorAll('.rev').forEach(function (el) { el.classList.remove('in', 'done'); });
    var box = document.querySelector('.pilar__sep'); if (box) box.classList.remove('drawn');
    armarEntradas(); armarLinea(); armarParallax(); armarHero();
  }
  mq.addEventListener('change', function (e) { e.matches ? fijarFinal() : soltar(); });

  /* ---------- Arranque ---------- */
  if (mq.matches) { armarLinea(); fijarFinal(); }
  else { armarEntradas(); armarLinea(); armarParallax(); armarHero(); }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { pxScroll(); heroScroll(); });
  }
})();
