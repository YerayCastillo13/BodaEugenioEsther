/* ============================================================
   Boda de Eugenio & Esther — app.js
   Vanilla JS, sin frameworks. Todo el markup se genera aquí
   para mantener un único punto de verdad (igual que antes con
   JSX), pero sin coste de React/Babel en el navegador.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Config ---------- */
  var CONFIG = {
    weddingDate: new Date(2027, 6, 3, 19, 0, 0), // mes 6 = Julio (0-indexado)
    whatsapp: "34685976684",
    iban: "ES12 3456 7890 1234 5678 9012",
    titulares: "Eugenio & Esther",
    instagramTag: "eugenio&esther",
    photos: ["/images/Foto1.jpeg", "/images/Foto2.jpeg", "/images/Foto3.jpeg"],
    mapsQuery: "Vara Restaurante Eventos Illescas",
    mapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3049.2399947399226!2d-3.8229810236076127!3d40.1592099712721!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd41f0fb53100e8d%3A0xb43087d21c660557!2sVara%20Restaurante%20%26%20Eventos!5e0!3m2!1ses!2ses!4v1781039870428!5m2!1ses!2ses",
    // Fase 3: aquí irá la URL del Google Apps Script Web App
    sheetEndpoint: ""
  };

  /* ---------- Helpers ---------- */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    attrs = attrs || {};
    for (var k in attrs) {
      if (!Object.prototype.hasOwnProperty.call(attrs, k)) continue;
      if (k === "class") node.className = attrs[k];
      else if (k === "html") node.innerHTML = attrs[k];
      else if (k.indexOf("on") === 0 && typeof attrs[k] === "function") {
        node.addEventListener(k.slice(2).toLowerCase(), attrs[k]);
      } else if (attrs[k] !== null && attrs[k] !== undefined) {
        node.setAttribute(k, attrs[k]);
      }
    }
    (children || []).forEach(function (c) {
      if (c === null || c === undefined) return;
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return node;
  }
  function pad(n) { return String(n).padStart(2, "0"); }

  var toastTimer = null;
  function showToast(msg) {
    var t = $("#toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("show"); }, 2400);
  }

  /* ---------- Iconos SVG (como strings, igual trazo que el diseño original) ---------- */
  var ICON = {
    botanicalTop: function (cls) {
      return '<svg viewBox="0 0 240 80" class="' + (cls || "") + '" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<g stroke="#c79c4a" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" fill="none">' +
        '<path d="M120 14 C 105 22, 80 30, 58 38 C 44 44, 30 48, 18 52"/>' +
        '<path d="M120 22 C 102 32, 78 40, 56 48 C 42 54, 28 58, 14 62"/>' +
        '<path d="M120 14 C 135 22, 160 30, 182 38 C 196 44, 210 48, 222 52"/>' +
        '<path d="M120 22 C 138 32, 162 40, 184 48 C 198 54, 212 58, 226 62"/>' +
        '<path d="M62 36 q -6 -8 -16 -6 q 6 10 16 6 z" fill="#e7c585" fill-opacity="0.55"/>' +
        '<path d="M85 30 q -5 -7 -14 -5 q 5 8 14 5 z" fill="#e7c585" fill-opacity="0.55"/>' +
        '<path d="M40 50 q -7 -7 -16 -3 q 6 9 16 3 z" fill="#e7c585" fill-opacity="0.55"/>' +
        '<path d="M100 26 q -4 -6 -12 -4 q 4 7 12 4 z" fill="#e7c585" fill-opacity="0.55"/>' +
        '<path d="M178 36 q 6 -8 16 -6 q -6 10 -16 6 z" fill="#e7c585" fill-opacity="0.55"/>' +
        '<path d="M155 30 q 5 -7 14 -5 q -5 8 -14 5 z" fill="#e7c585" fill-opacity="0.55"/>' +
        '<path d="M200 50 q 7 -7 16 -3 q -6 9 -16 3 z" fill="#e7c585" fill-opacity="0.55"/>' +
        '<path d="M140 26 q 4 -6 12 -4 q -4 7 -12 4 z" fill="#e7c585" fill-opacity="0.55"/>' +
        '<circle cx="50" cy="44" r="1.6" fill="#c79c4a"/><circle cx="72" cy="38" r="1.4" fill="#c79c4a"/>' +
        '<circle cx="92" cy="32" r="1.4" fill="#c79c4a"/><circle cx="190" cy="44" r="1.6" fill="#c79c4a"/>' +
        '<circle cx="168" cy="38" r="1.4" fill="#c79c4a"/><circle cx="148" cy="32" r="1.4" fill="#c79c4a"/>' +
        '<path d="M115 16 C 117 10, 123 10, 125 16" /><circle cx="120" cy="10" r="1.5" fill="#c79c4a"/>' +
        '</g></svg>';
    },
    adornoSmall: function (cls, color) {
      color = color || "#c79c4a";
      return '<svg viewBox="0 0 80 24" class="' + (cls || "") + '" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<g stroke="' + color + '" stroke-width="1" stroke-linecap="round" fill="none">' +
        '<path d="M40 12 L8 12" /><path d="M40 12 L72 12" />' +
        '<path d="M18 12 q -4 -4 -8 -2" /><path d="M28 12 q -3 -4 -8 -3" opacity="0.7" />' +
        '<path d="M62 12 q 4 -4 8 -2" /><path d="M52 12 q 3 -4 8 -3" opacity="0.7" />' +
        '<path d="M36 12 q 2 -3 4 -3 q 2 0 4 3" /><circle cx="40" cy="9" r="1.4" fill="' + color + '"/>' +
        '</g></svg>';
    },
    dateFlourish: function (flip) {
      return '<svg viewBox="0 0 40 14" fill="none" style="transform:' + (flip ? "scaleX(-1)" : "none") + '">' +
        '<g stroke="#c79c4a" stroke-width="0.9" stroke-linecap="round" fill="none">' +
        '<path d="M2 7 L34 7" /><path d="M28 7 q 3 -3 8 -2" />' +
        '<path d="M22 7 q 2 -3 6 -2" opacity="0.7" /><circle cx="36" cy="5" r="1" fill="#c79c4a"/>' +
        '</g></svg>';
    },
    sectionDivider: function () {
      return '<div style="position:relative;background:#fff">' +
        '<svg viewBox="0 0 440 18" preserveAspectRatio="none" style="display:block;width:100%;height:18px">' +
        '<path d="M0 0 Q 14 18, 28 6 T 56 6 T 84 6 T 112 6 T 140 6 T 168 6 T 196 6 T 224 6 T 252 6 T 280 6 T 308 6 T 336 6 T 364 6 T 392 6 T 420 6 T 440 6 L 440 18 L 0 18 Z" fill="#fff"/>' +
        '</svg>' + ICON.botanicalTop("") .replace('viewBox="0 0 240 80"', 'viewBox="0 0 240 80" style="position:absolute;left:50%;transform:translateX(-50%);top:-6px;width:160px;height:60px;pointer-events:none"') +
        '</div>';
    },
    heart: function (cls) {
      return '<svg viewBox="0 0 32 32" class="' + (cls || "") + '" fill="currentColor" stroke="currentColor" stroke-width="1.4">' +
        '<path d="M16 27 C 6 19, 3 13, 6 9 C 9 5, 14 6, 16 10 C 18 6, 23 5, 26 9 C 29 13, 26 19, 16 27 Z" /></svg>';
    },
    rings: function () {
      return '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">' +
        '<circle cx="24" cy="36" r="14" /><circle cx="40" cy="36" r="14" />' +
        '<path d="M19 18 L24 24 L29 18" /><path d="M22 22 L26 22" opacity="0.5" /></svg>';
    },
    clipboard: function () {
      return '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
        '<rect x="12" y="10" width="24" height="32" rx="2" /><rect x="18" y="6" width="12" height="6" rx="1.2" />' +
        '<path d="M18 22 L30 22" /><path d="M18 28 L30 28" /><path d="M18 34 L26 34" /></svg>';
    },
    hotel: function () {
      return '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round">' +
        '<path d="M8 42 L8 14 L24 6 L40 14 L40 42 Z" /><rect x="20" y="28" width="8" height="14" />' +
        '<rect x="14" y="20" width="5" height="5" /><rect x="29" y="20" width="5" height="5" />' +
        '<path d="M22 16 L26 14 L24 12 Z" fill="currentColor" /></svg>';
    },
    camera: function () {
      return '<svg viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">' +
        '<rect x="3" y="10" width="30" height="20" rx="2" /><circle cx="18" cy="20" r="6" /><circle cx="18" cy="20" r="2.5" />' +
        '<path d="M11 10 L13 6 L23 6 L25 10" /><circle cx="28" cy="14" r="0.8" fill="currentColor" /></svg>';
    },
    instagram: function () {
      return '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5">' +
        '<rect x="4" y="4" width="24" height="24" rx="6" /><circle cx="16" cy="16" r="6" />' +
        '<circle cx="23" cy="9" r="1.2" fill="currentColor" /></svg>';
    },
    musicCircle: function () {
      return '<svg width="26" height="26" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">' +
        '<circle cx="4" cy="12" r="2.25"/><circle cx="12" cy="11" r="2.25"/>' +
        '<polyline points="6.25 12,6.25 2.75,14.25 1.75,14.25 11"/></svg>';
    },
    pin: function () {
      return '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round">' +
        '<path d="M24 6 C 16 6, 10 12, 10 20 C 10 30, 24 42, 24 42 C 24 42, 38 30, 38 20 C 38 12, 32 6, 24 6 Z" />' +
        '<circle cx="24" cy="20" r="5" /></svg>';
    }
  };

  window.__BODA__ = { CONFIG: CONFIG, $, $all, el, pad, showToast, ICON };
})();

/* ============================================================
   Construcción del markup
   ============================================================ */
(function () {
  "use strict";
  var B = window.__BODA__;
  var CONFIG = B.CONFIG, $ = B.$, el = B.el, ICON = B.ICON, showToast = B.showToast, pad = B.pad;

  var app = document.getElementById("app");

  function buildInvite() {
    var invite = el("div", { class: "invite" }, [
      buildHero(),
      buildDivider(),
      buildConfirmSection(), // Ceremonia & Celebración
      buildConfirmAsistencia(),
      buildGallery(),
      buildDivider(),
      buildFiesta(),
      buildDivider(),
      buildInstagram(),
      buildDivider(),
      buildFooter()
    ]);
    app.appendChild(invite);
    app.appendChild(window.__BODA__.modals.buildModalsRoot());
    app.appendChild(window.__BODA__.modals.buildLightboxRoot());
    app.appendChild(el("div", { class: "toast", id: "toast" }));
  }

  function buildDivider() {
    return el("div", { html: ICON.sectionDivider() });
  }

  /* ---------- HERO ---------- */
  function buildHero() {
    var heroPin = el("div", { class: "hero-pin" }, [
      el("div", { class: "hero-bg" }),
      el("audio", { id: "bgm", src: "/musica/dtmf.mp3", loop: "", preload: "none", style: "display:none" }),
      el("button", { class: "music-toggle", id: "musicToggle", "aria-label": "Música", html: ICON.musicCircle() }),
      el("div", { class: "hero-top-ornament", html: ICON.botanicalTop() }),
      el("div", { class: "hero-date", id: "heroDate" }, [
        el("span", { html: ICON.dateFlourish(true) }),
        el("span", {}, ["03.07.2027"]),
        el("span", { html: ICON.dateFlourish(false) })
      ]),
      el("h1", { class: "hero-names", id: "heroNames" }, [
        "Eugenio", el("span", { class: "amp" }, ["&"]), "Esther"
      ]),
      el("div", { class: "hero-rule" }),
      el("p", { class: "hero-sub", id: "heroSub" }, ["Nuestra invitación a la Boda"]),
      el("div", { class: "quote", id: "heroQuote" }, [
        el("span", { class: "quote-mark top" }, ["\u201C"]),
        "Todos somos mortales,", el("br"),
        "hasta el primer beso", el("br"),
        "y la segunda copa de vino",
        el("span", { class: "quote-mark bottom" }, ["\u201D"])
      ]),
      buildCountdownBlock()
    ]);
    return el("section", { class: "hero" }, [heroPin]);
  }

  function buildCountdownBlock() {
    var counters = el("div", { class: "counters", id: "counters" }, ["días", "hs", "min", "seg"].map(function (label) {
      return el("div", { class: "counter" }, [
        el("div", { class: "counter-num", "data-unit": label }, ["00"]),
        el("div", { class: "counter-label" }, [label])
      ]);
    }));
    return el("div", { class: "block", id: "countdownBlock", "data-countdown": "", style: "margin-top:10px;padding-top:0;padding-bottom:0" }, [
      el("h2", { class: "countdown-title" }, ["Faltan..."]),
      counters,
      el("div", { html: ICON.heart("heart-pulse") })
    ]);
  }

  /* ---------- Ceremonia / Celebración ---------- */
  function buildConfirmSection() {
    var card = el("div", { class: "event-card", id: "eventCard" }, [
      el("div", { class: "event-icon", html: ICON.rings() }),
      el("h3", {}, ["Ceremonia", el("br"), "&", el("br"), "Celebración"]),
      el("div", { class: "event-divider", html: ICON.adornoSmall() }),
      el("p", { class: "event-sub" }, ["Día"]),
      el("p", { class: "event-detail" }, ["Sábado 03 de Julio - 19:00h"]),
      el("p", { class: "event-sub" }, ["Lugar"]),
      el("p", { class: "event-detail" }, ["Vara Restaurante & Eventos", el("br"), "A-42, Km 31, 45200", el("br"), "Illescas", el("br"), "Toledo"]),
      el("button", { class: "btn-pill", onClick: function () { openModal("map1"); } }, ["¿Cómo llegar?"])
    ]);
    return el("section", { class: "confirm" }, [card]);
  }

  function buildConfirmAsistencia() {
    var card = el("div", { class: "event-card", id: "confirmCard" }, [
      el("h3", {}, ["Confirmación de asistencia"]),
      el("div", { class: "event-divider", html: ICON.adornoSmall() }),
      el("p", { class: "event-detail" }, ["Es importante que confirmes tu asistencia"]),
      el("button", { class: "btn-pill lg", onClick: function () { openModal("confirm"); } }, ["Confirmar asistencia"])
    ]);
    return el("section", { class: "confirm" }, [card]);
  }

  /* ---------- Galería ---------- */
  var galleryIdx = 0, galleryTimer = null;
  function buildGallery() {
    var track = el("div", { class: "carousel-track", id: "carouselTrack" });
    var dots = el("div", { class: "dots", id: "dots" });

    CONFIG.photos.forEach(function (src, i) {
      var slide = el("div", { class: "slide", "data-i": i }, [
        el("img", { src: src, alt: "", loading: i === 0 ? "eager" : "lazy" })
      ]);
      slide.addEventListener("click", function () {
        if (i === galleryIdx) openLightbox(i); else setGalleryIndex(i);
      });
      track.appendChild(slide);

      var dot = el("button", { class: "dot" + (i === 0 ? " active" : "") });
      dot.addEventListener("click", function () { setGalleryIndex(i); });
      dots.appendChild(dot);
    });

    var carousel = el("div", { class: "carousel", id: "carousel" }, [track]);
    addSwipe(carousel);

    var section = el("section", { class: "gallery-wrap", id: "gallerySection" }, [
      el("h2", { class: "section-title" }, ["Retratos de Nuestro Amor"]),
      el("p", { class: "lead" }, ["Un minuto, un segundo, un instante que queda en la eternidad"]),
      el("div", { class: "camera-icon", html: ICON.camera() }),
      carousel,
      dots
    ]);
    return section;
  }

  function renderGallery() {
    var slides = B.$all(".slide", $("#carouselTrack"));
    var n = slides.length;
    slides.forEach(function (slide, i) {
      var rel = ((i - galleryIdx) + n) % n;
      var order = rel > n / 2 ? rel - n : rel;
      var abs = Math.abs(order);
      if (abs > 2) { slide.style.display = "none"; return; }
      slide.style.display = "";
      var translate = order * 95;
      var scale = order === 0 ? 1.1 : 0.78;
      var opacity = abs === 0 ? 1 : abs === 1 ? 0.85 : 0.4;
      slide.style.zIndex = 10 - abs;
      slide.style.transform = "translateX(" + translate + "px) scale(" + scale + ")";
      slide.style.opacity = opacity;
      slide.style.boxShadow = order === 0 ? "0 12px 30px rgba(40,30,10,0.25)" : "0 6px 16px rgba(40,30,10,0.18)";
      slide.style.background = order === 0 ? "var(--gold)" : "var(--card)";
    });
    B.$all(".dot", $("#dots")).forEach(function (d, i) { d.classList.toggle("active", i === galleryIdx); });
  }

  function setGalleryIndex(i) {
    galleryIdx = ((i % CONFIG.photos.length) + CONFIG.photos.length) % CONFIG.photos.length;
    renderGallery();
    restartGalleryAutoplay();
  }

  function restartGalleryAutoplay() {
    clearInterval(galleryTimer);
    galleryTimer = setInterval(function () { setGalleryIndex(galleryIdx + 1); }, 4500);
  }

  function addSwipe(container) {
    var startX = null;
    function onStart(e) { startX = e.touches ? e.touches[0].clientX : e.clientX; }
    function onEnd(e) {
      if (startX === null) return;
      var x = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
      var dx = x - startX;
      if (Math.abs(dx) > 30) setGalleryIndex(galleryIdx + (dx < 0 ? 1 : -1));
      startX = null;
    }
    container.addEventListener("touchstart", onStart, { passive: true });
    container.addEventListener("touchend", onEnd);
    container.addEventListener("mousedown", onStart);
    container.addEventListener("mouseup", onEnd);
  }

  /* ---------- Fiesta ---------- */
  function buildFiesta() {
    function card(opts) {
      var c = el("div", { class: "fiesta-card large", id: opts.id }, [
        el("h4", {}, [opts.title]),
        el("div", { class: "fiesta-icon", html: opts.icon }),
        el("p", {}, [opts.text]),
        el("button", { class: "btn-pill", onClick: opts.onClick }, [opts.cta])
      ]);
      return c;
    }
    var grid = el("div", { class: "fiesta-grid" }, [
      card({ id: "tipsCard", title: "Tips y Notas", icon: ICON.clipboard(), text: "Información adicional para tener en cuenta", cta: "+ Info", onClick: function () { openModal("tips"); } }),
      card({ id: "alojCard", title: "Alojamientos", icon: ICON.hotel(), text: "Opciones de hospedaje recomendadas", cta: "+ Info", onClick: function () { openModal("alojamientos"); } })
    ]);
    return el("div", {}, [
      el("section", { class: "fiesta-intro", id: "fiestaIntro" }, [
        el("h2", { class: "section-title" }, ["Toma nota..."]),
        el("p", { class: "lead" }, ["Hagamos juntos una fiesta única. Os dejamos algunos detalles a tener en cuenta."])
      ]),
      grid
    ]);
  }

  /* ---------- Instagram ---------- */
  function buildInstagram() {
    var url = "https://www.instagram.com/explore/tags/eugenioesther/";
    return el("section", { class: "ig", id: "igSection" }, [
      el("h2", { class: "section-title" }, ["Compartimos este día junto a ti"]),
      el("p", { class: "lead" }, ["Comparte tus fotos y vídeos de este hermoso día"]),
      el("div", { class: "ig-icon", html: ICON.instagram() }),
      el("a", { class: "hashtag", href: url, target: "_blank", rel: "noopener noreferrer" }, ["#" + CONFIG.instagramTag]),
      el("div", {}, [el("a", { class: "btn-pill", href: url, target: "_blank", rel: "noopener noreferrer", style: "text-decoration:none" }, ["Ver en Instagram"])])
    ]);
  }

  /* ---------- Footer ---------- */
  function buildFooter() {
    return el("footer", { class: "footer" }, [
      el("div", { class: "footer-brand" }, [
        el("p", { class: "footer-names" }, ["Eugenio", el("span", { class: "amp" }, ["&"]), "Esther"]),
        el("div", { class: "footer-rule" }),
        el("p", { class: "footer-sub" }, ["03 de Julio de 2027"])
      ]),
      el("ul", { class: "footer-links" }, [
        el("li", {}, [el("a", { href: "#", onClick: function (e) { e.preventDefault(); openModal("confirm"); } }, ["Confirmar asistencia"])]),
        el("li", {}, [el("a", { href: "#", onClick: function (e) { e.preventDefault(); openModal("agenda1"); } }, ["Agendar Ceremonia"])])
      ]),
      el("div", { class: "credit" }, ["Desarrollado con ", el("span", { class: "heart" }, ["\u2665"])])
    ]);
  }

  window.__BODA__.build = {
    buildInvite: buildInvite,
    renderGallery: renderGallery,
    restartGalleryAutoplay: restartGalleryAutoplay,
    setGalleryIndex: setGalleryIndex
  };
})();

/* ============================================================
   Modales
   ============================================================ */
(function () {
  "use strict";
  var B = window.__BODA__;
  var CONFIG = B.CONFIG, $ = B.$, el = B.el, ICON = B.ICON, showToast = B.showToast;

  var currentModal = null;

  function buildModalsRoot() {
    var backdrop = el("div", { class: "modal-backdrop", id: "modalBackdrop" });
    backdrop.addEventListener("click", function (e) { if (e.target === backdrop) closeModal(); });
    return backdrop;
  }

  function modalShell(opts) {
    // opts: { title, icon, body (Node) }
    var close = el("button", { class: "modal-close", "aria-label": "Cerrar" }, ["\u00D7"]);
    close.addEventListener("click", closeModal);
    var modal = el("div", { class: "modal" }, [
      close,
      el("div", { class: "modal-icon", html: opts.icon }),
      el("h3", {}, [opts.title]),
      el("div", { class: "divider", html: ICON.adornoSmall() }),
      opts.body
    ]);
    modal.addEventListener("click", function (e) { e.stopPropagation(); });
    return modal;
  }

  function openModal(kind) {
    currentModal = kind;
    var backdrop = $("#modalBackdrop");
    backdrop.innerHTML = "";
    var modal = buildModalByKind(kind);
    if (!modal) return;
    backdrop.appendChild(modal);
    backdrop.classList.add("open");
    document.addEventListener("keydown", onEscKey);
  }
  function closeModal() {
    var backdrop = $("#modalBackdrop");
    backdrop.classList.remove("open");
    currentModal = null;
    document.removeEventListener("keydown", onEscKey);
  }
  function onEscKey(e) { if (e.key === "Escape") closeModal(); }

  function buildModalByKind(kind) {
    if (kind === "confirm") return buildConfirmModal();
    if (kind === "tips") return buildTipsModal();
    if (kind === "alojamientos") return buildAlojamientosModal();
    if (kind === "agenda1") return buildAgendaModal();
    if (kind === "map1") return buildMapModal();
    return null;
  }

  /* ---- Tips ---- */
  function buildTipsModal() {
    var ul = el("ul", { style: "text-align:left;font-family:Quattrocento,serif;font-size:13px;color:var(--ink);line-height:1.7;padding-left:18px" }, [
      el("li", {}, ["La ceremonia comenzará a las 19:00h ¡Sed puntuales!"]),
      el("li", {}, ["Habrá servicio de guardarropa en la entrada."]),
      el("li", {}, ["El evento es exclusivo para adultos."]),
      el("li", {}, ["Se solicita evitar el uso del teléfono durante la ceremonia."])
    ]);
    return modalShell({ title: "Tips y Notas", icon: ICON.clipboard(), body: ul });
  }

  /* ---- Alojamientos ---- */
  function buildAlojamientosModal() {
    var p = el("p", { style: "font-family:Quattrocento,serif;font-size:13px;color:var(--ink);line-height:1.8" }, [
      "Hemos localizado los mejores alojamientos cercanos:", el("br"), el("br"),
      el("strong", {}, [el("a", { class: "modal-link", href: "https://hotelroute42.com-hotel.com/es/", target: "_blank", rel: "noopener noreferrer" }, ["Hotel Alda Route 42"])]),
      " · 15 min a pie", el("br"),
      el("strong", {}, [el("a", { class: "modal-link", href: "https://complejoparis.com/", target: "_blank", rel: "noopener noreferrer" }, ["Complejo París"])]),
      " · 10 min en coche", el("br"), el("br")
    ]);
    return modalShell({ title: "Alojamientos", icon: ICON.hotel(), body: p });
  }

  /* ---- Agenda (.ics) ---- */
  function buildAgendaModal() {
    var row = el("div", { class: "modal-row", style: "flex-direction:column;gap:8px" }, [
      el("button", { class: "btn-pill", onClick: function () { closeModal(); addToGoogleCalendar(); } }, ["Google Calendar"]),
      el("button", { class: "btn-pill outline", onClick: function () { closeModal(); downloadIcs(); } }, ["Apple / Outlook (.ics)"])
    ]);
    var p = el("p", { style: "font-family:Quattrocento,serif;font-size:13px;color:var(--ink);line-height:1.6" }, ["Añade el evento a tu calendario:"]);
    return modalShell({ title: "Agendar evento", icon: ICON.rings(), body: el("div", {}, [p, row]) });
  }

  function addToGoogleCalendar() {
    var start = fmtGCal(CONFIG.weddingDate);
    var end = fmtGCal(new Date(CONFIG.weddingDate.getTime() + 5 * 3600000));
    var url = "https://calendar.google.com/calendar/render?action=TEMPLATE&text=" +
      encodeURIComponent("Boda de Eugenio & Esther") +
      "&dates=" + start + "/" + end +
      "&details=" + encodeURIComponent("Ceremonia y Celebración") +
      "&location=" + encodeURIComponent("Vara Restaurante & Eventos, A-42 Km 31, 45200 Illescas, Toledo");
    window.open(url, "_blank");
  }
  function fmtGCal(d) {
    return d.getUTCFullYear() + pad2(d.getUTCMonth() + 1) + pad2(d.getUTCDate()) + "T" + pad2(d.getUTCHours()) + pad2(d.getUTCMinutes()) + "00Z";
  }
  function pad2(n) { return String(n).padStart(2, "0"); }

  function downloadIcs() {
    var dt = CONFIG.weddingDate;
    var endDt = new Date(dt.getTime() + 5 * 3600000);
    var ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Boda Eugenio Esther//ES",
      "BEGIN:VEVENT",
      "UID:" + Date.now() + "@boda-eugenio-esther",
      "DTSTAMP:" + fmtGCal(new Date()),
      "DTSTART:" + fmtGCal(dt),
      "DTEND:" + fmtGCal(endDt),
      "SUMMARY:Boda de Eugenio & Esther",
      "LOCATION:Vara Restaurante & Eventos\\, A-42 Km 31\\, 45200 Illescas\\, Toledo",
      "DESCRIPTION:Ceremonia y Celebración",
      "END:VEVENT", "END:VCALENDAR"
    ].join("\r\n");
    var blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "boda-eugenio-esther.ics";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast("Archivo .ics descargado");
  }

  /* ---- Mapa ---- */
  function buildMapModal() {
    var p = el("p", { style: "font-family:Karla,sans-serif;font-size:12px;color:var(--ink-soft);margin:0 0 14px" }, ["A-42, Km 31, Illescas. 45200 Toledo"]);
    var mapWrap = el("div", { style: "height:300px;border-radius:8px;overflow:hidden;margin-bottom:16px" }, [
      el("iframe", {
        src: CONFIG.mapsEmbed, width: "100%", height: "100%", style: "border:0",
        allowfullscreen: "", loading: "lazy", referrerpolicy: "no-referrer-when-downgrade",
        title: "Mapa Vara Restaurante & Eventos"
      })
    ]);
    var btn = el("button", { class: "btn-pill" }, ["Ampliar mapa"]);
    btn.addEventListener("click", function () {
      window.open("https://maps.google.com/?q=" + encodeURIComponent(CONFIG.mapsQuery), "_blank");
    });
    return modalShell({ title: "Vara Restaurante & Eventos", icon: ICON.pin(), body: el("div", {}, [p, mapWrap, btn]) });
  }

  /* ---- Confirmación de asistencia (formulario -> Google Sheet) ---- */
  function buildConfirmModal() {
    var going = null;
    var state = { nombre: "", acompanante: "", restricciones: "" };

    var intro = el("p", { style: "font-family:'Cormorant Garamond',serif;font-style:italic;color:var(--gold-deep);margin:0 0 18px;font-size:14px" }, ["¿Nos acompañarás en nuestro gran día?"]);

    var btnYes = el("button", { class: "btn-pill outline" }, ["Sí, allí estaré"]);
    var btnNo = el("button", { class: "btn-pill outline" }, ["No podré asistir"]);
    var choiceRow = el("div", { class: "modal-row", style: "margin-bottom:18px" }, [btnYes, btnNo]);

    var formArea = el("div", { id: "confirmFormArea" });

    function renderForm() {
      formArea.innerHTML = "";
      if (going === null) return;

      var nombreInput = el("input", { class: "modal-field", placeholder: "Tu nombre *", id: "fNombre", autocomplete: "name" });
      var nombreErr = el("div", { class: "field-error" }, ["Por favor, escribe tu nombre."]);
      formArea.appendChild(nombreInput);
      formArea.appendChild(nombreErr);

      var acompInput = null, restrInput = null;
      if (going) {
        acompInput = el("input", { class: "modal-field", placeholder: "Acompañante (opcional)", autocomplete: "off" });
        restrInput = el("input", { class: "modal-field", placeholder: "Restricciones alimentarias (opcional)", autocomplete: "off" });
        formArea.appendChild(acompInput);
        formArea.appendChild(restrInput);
      }

      var submitBtn = el("button", { class: "btn-pill lg", style: "margin-top:6px" }, [going ? "Confirmar" : "Enviar"]);
      formArea.appendChild(submitBtn);

      submitBtn.addEventListener("click", function () {
        var nombre = nombreInput.value.trim();
        if (!nombre) {
          nombreInput.classList.add("invalid");
          nombreErr.classList.add("show");
          nombreInput.focus();
          return;
        }
        nombreInput.classList.remove("invalid");
        nombreErr.classList.remove("show");

        state.nombre = nombre;
        state.acompanante = acompInput ? acompInput.value.trim() : "";
        state.restricciones = restrInput ? restrInput.value.trim() : "";

        submitRSVP(going, state, submitBtn);
      });
    }

    btnYes.addEventListener("click", function () { going = true; btnYes.classList.add("selected"); btnNo.classList.remove("selected"); renderForm(); });
    btnNo.addEventListener("click", function () { going = false; btnNo.classList.add("selected"); btnYes.classList.remove("selected"); renderForm(); });

    var body = el("div", {}, [intro, choiceRow, formArea]);
    return modalShell({ title: "Confirmar Asistencia", icon: ICON.heart(), body: body });
  }

  function submitRSVP(going, state, submitBtn) {
    var originalLabel = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="btn-spinner"></span>Enviando...';

    var payload = {
      asiste: going ? "Sí" : "No",
      nombre: state.nombre,
      acompanante: state.acompanante || "",
      restricciones: state.restricciones || "",
      fecha: new Date().toISOString()
    };

    sendToSheet(payload)
      .then(function () {
        closeModal();
        showToast(going ? "¡Gracias por confirmar! Nos vemos pronto 💛" : "Gracias por avisarnos");
        openWhatsappFallback(going, state);
      })
      .catch(function () {
        // Si falla el Sheet (p.ej. endpoint aún no configurado), no bloqueamos
        // al invitado: igualmente le dejamos confirmar por WhatsApp.
        closeModal();
        showToast("No pudimos guardar automáticamente, te abrimos WhatsApp");
        openWhatsappFallback(going, state);
      });
  }

  function openWhatsappFallback(going, state) {
    var msg = (state.acompanante ? "Somos " : "Soy ") + state.nombre +
      (state.acompanante ? " y " + state.acompanante : "") +
      (going ? " Quiero confirmar mi asistencia a vuestra boda 🥳" : " No podré asistir a vuestra boda, ¡os deseo lo mejor! 💛") +
      (state.restricciones ? " Tengo restricciones alimentarias: " + state.restricciones : "");
    window.open("https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(msg), "_blank");
  }

  function sendToSheet(payload) {
    if (!CONFIG.sheetEndpoint) {
      return Promise.reject(new Error("sheetEndpoint no configurado todavía"));
    }
    return fetch(CONFIG.sheetEndpoint, {
      method: "POST",
      mode: "no-cors", // Apps Script Web Apps no siempre devuelven CORS; con no-cors no podemos leer la respuesta pero sí se guarda
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    }).then(function () { return true; });
  }

  /* ---------- Lightbox ---------- */
  var lbIndex = null;
  function buildLightboxRoot() {
    var box = el("div", { class: "lightbox", id: "lightbox" });
    box.addEventListener("click", function (e) { if (e.target === box) closeLightbox(); });
    return box;
  }
  function openLightbox(i) {
    lbIndex = i;
    renderLightbox();
    $("#lightbox").classList.add("open");
  }
  function closeLightbox() {
    $("#lightbox").classList.remove("open");
    lbIndex = null;
  }
  function renderLightbox() {
    var box = $("#lightbox");
    box.innerHTML = "";
    var closeBtn = el("button", { class: "close" }, ["\u00D7"]);
    closeBtn.addEventListener("click", closeLightbox);
    var prev = el("button", { class: "nav prev" }, ["\u2039"]);
    prev.addEventListener("click", function (e) { e.stopPropagation(); lbIndex = (lbIndex - 1 + CONFIG.photos.length) % CONFIG.photos.length; renderLightbox(); });
    var next = el("button", { class: "nav next" }, ["\u203A"]);
    next.addEventListener("click", function (e) { e.stopPropagation(); lbIndex = (lbIndex + 1) % CONFIG.photos.length; renderLightbox(); });
    var img = el("img", { src: CONFIG.photos[lbIndex], alt: "" });
    img.addEventListener("click", function (e) { e.stopPropagation(); });
    box.appendChild(closeBtn); box.appendChild(prev); box.appendChild(img); box.appendChild(next);
  }

  window.__BODA__.modals = {
    buildModalsRoot: buildModalsRoot,
    buildLightboxRoot: buildLightboxRoot,
    openModal: openModal,
    closeModal: closeModal,
    openLightbox: openLightbox
  };
  // exponer para que build.js los use sin reescribir imports
  window.openModal = openModal;
  window.openLightbox = openLightbox;
})();

/* ============================================================
   Countdown, parallax, scroll-reveal, música e inicialización
   ============================================================ */
(function () {
  "use strict";
  var B = window.__BODA__;
  var CONFIG = B.CONFIG, $ = B.$, $all = B.$all, pad = B.pad, showToast = B.showToast;

  /* ---------- Countdown ---------- */
  function startCountdown() {
    var els = {
      días: document.querySelector('[data-unit="días"]'),
      hs: document.querySelector('[data-unit="hs"]'),
      min: document.querySelector('[data-unit="min"]'),
      seg: document.querySelector('[data-unit="seg"]')
    };
    function tick() {
      var diff = Math.max(0, CONFIG.weddingDate.getTime() - Date.now());
      var seconds = Math.floor(diff / 1000) % 60;
      var minutes = Math.floor(diff / 60000) % 60;
      var hours = Math.floor(diff / 3600000) % 24;
      var days = Math.floor(diff / 86400000);
      if (els.días) els.días.textContent = String(days);
      if (els.hs) els.hs.textContent = pad(hours);
      if (els.min) els.min.textContent = pad(minutes);
      if (els.seg) els.seg.textContent = pad(seconds);
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- Parallax (hero bg + textos), con throttle vía rAF
     y respetando prefers-reduced-motion y dispositivos de gama baja ---------- */
  function startParallax() {
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    var bg = $(".hero-bg");
    var heroDate = $("#heroDate");
    var heroNames = $("#heroNames");
    var heroSub = $("#heroSub");
    var heroQuote = $("#heroQuote");

    var targetY = 0, currentY = 0;
    var ticking = false;

    function onScroll() {
      targetY = window.scrollY;
      if (!ticking) { ticking = true; requestAnimationFrame(frame); }
    }

    function frame() {
      ticking = false;
      currentY += (targetY - currentY) * 0.12;
      if (Math.abs(targetY - currentY) < 0.05) currentY = targetY;

      // Fondo: limitado a los primeros ~500px de scroll, con easing
      var limit = 500;
      var progress = Math.min(currentY / limit, 1);
      var ease = 1 - Math.pow(1 - progress, 3);
      var factor = 0.15 + (0.2 * (1 - ease));
      if (bg) bg.style.transform = "translate3d(0," + (currentY * factor) + "px,0)";

      if (heroDate) heroDate.style.transform = "translate3d(0," + (currentY * 0.03) + "px,0)";
      if (heroNames) heroNames.style.transform = "translate3d(0," + (currentY * 0.05) + "px,0)";
      if (heroSub) heroSub.style.transform = "translate3d(0," + (currentY * 0.02) + "px,0)";
      if (heroQuote) heroQuote.style.transform = "translate3d(0," + (currentY * 0.01) + "px,0)";

      if (Math.abs(targetY - currentY) > 0.05) requestAnimationFrame(frame);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Scroll-reveal (IntersectionObserver) ---------- */
  function startScrollReveal() {
    var targets = $all("#countdownBlock, #eventCard, #confirmCard, #gallerySection, #fiestaIntro, .fiesta-card, #igSection");
    if (!("IntersectionObserver" in window)) {
      targets.forEach(function (t) { t.classList.add("animate-in"); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "50px" });
    targets.forEach(function (t) { observer.observe(t); });
  }

  /* ---------- Micro-interacción de elevación en cards al centrarse (ligera, con throttle) ---------- */
  function startCardTilt() {
    var cards = $all(".event-card, .fiesta-card");
    if (!cards.length) return;
    var ticking = false;
    function update() {
      ticking = false;
      var windowH = window.innerHeight;
      cards.forEach(function (card) {
        var rect = card.getBoundingClientRect();
        var centerY = rect.top + rect.height / 2;
        var dist = Math.abs(centerY - windowH / 2);
        var progress = 1 - Math.min(dist / (windowH * 0.8), 1);
        var translateY = (1 - progress) * 10;
        card.style.transform = "translateY(" + translateY + "px)";
      });
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* ---------- Música ---------- */
  function initMusic() {
    var audio = $("#bgm");
    var btn = $("#musicToggle");
    if (!audio || !btn) return;
    var on = false;

    function setOn(v) {
      on = v;
      btn.classList.toggle("playing", on);
      if (on) {
        audio.play().then(function () {
          showToast("🎵 Música activada");
        }).catch(function () {
          on = false;
          btn.classList.remove("playing");
          showToast("Pulsa el botón para reproducir la música");
        });
      } else {
        audio.pause();
        showToast("⏸️ Música pausada");
      }
    }

    btn.addEventListener("click", function () { setOn(!on); });

    // Intento de autoplay silencioso: los navegadores móviles normalmente
    // lo bloquean sin interacción previa, así que fallamos en silencio
    // (sin molestar con un toast de error en la primera carga).
    setTimeout(function () {
      audio.play().then(function () { on = true; btn.classList.add("playing"); }).catch(function () {});
    }, 500);
  }

  /* ---------- Boot loader ---------- */
  function hideBootLoader() {
    var loader = document.getElementById("boot-loader");
    if (!loader) return;
    loader.classList.add("hide");
    setTimeout(function () { loader.remove(); }, 450);
  }

  /* ---------- Init ---------- */
  function init() {
    B.build.buildInvite();
    B.build.renderGallery();
    B.build.restartGalleryAutoplay();
    startCountdown();
    startParallax();
    startScrollReveal();
    startCardTilt();
    initMusic();
    hideBootLoader();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
