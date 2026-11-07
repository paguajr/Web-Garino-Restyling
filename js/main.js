/* GARINO — interacción de scroll. Todo el contenido es visible sin JS ni movimiento. */
(function () {
  var root = document.documentElement;

  /* Menú móvil */
  var toggle = document.querySelector(".nav-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = root.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.querySelectorAll(".nav a").forEach(function (a) {
      a.addEventListener("click", function () {
        root.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && root.classList.contains("nav-open")) {
        root.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* Progreso de lectura (barra de color del pliego) */
  var bar = document.querySelector(".progress");
  function progress() {
    var h = root.scrollHeight - window.innerHeight;
    if (bar) bar.style.setProperty("--p", h > 0 ? Math.min(1, window.scrollY / h).toFixed(4) : 0);
  }
  window.addEventListener("scroll", progress, { passive: true });
  window.addEventListener("resize", progress);
  progress();

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !window.gsap || !window.ScrollTrigger) {
    root.classList.remove("motion");
    return;
  }

  var gsap = window.gsap;
  gsap.registerPlugin(window.ScrollTrigger);
  var ease = "expo.out";

  var headerH = function () { var h = document.querySelector(".site-header"); return h ? h.offsetHeight : 0; };
  var clamp = gsap.utils.clamp;

  /* Divide un título en líneas enmascaradas por palabra; en el héroe, también por letra */
  function splitWords(el, chars) {
    var text = el.textContent.trim().replace(/\s+/g, " ");
    el.setAttribute("aria-label", text);
    el.innerHTML = "";
    var inner = [];
    text.split(" ").forEach(function (word, i, arr) {
      var line = document.createElement("span");
      line.className = "line";
      line.setAttribute("aria-hidden", "true");
      line.style.display = "inline-block";
      var s = document.createElement("span");
      if (chars) {
        s.style.transform = "none";
        s.style.display = "inline-block";
        word.split("").forEach(function (ch) {
          var c = document.createElement("span");
          c.textContent = ch;
          c.style.display = "inline-block";
          s.appendChild(c);
          inner.push(c);
        });
      } else {
        s.textContent = word;
        inner.push(s);
      }
      line.appendChild(s);
      el.appendChild(line);
      if (i < arr.length - 1) el.appendChild(document.createTextNode(" "));
    });
    return inner;
  }

  /* Texto que se revela al leer: cada palabra sube y pasa de bruma a azul marino con el scroll.
     En escritorio la sección se fija mientras se lee. */
  var navy = getComputedStyle(root).getPropertyValue("--navy").trim() || "#002b5c";
  var mmText = gsap.matchMedia();
  document.querySelectorAll(".statement").forEach(function (el) {
    var text = el.textContent.trim().replace(/\s+/g, " ");
    el.setAttribute("aria-label", text);
    el.innerHTML = text
      .split(" ")
      .map(function (w) { return '<span class="w" aria-hidden="true">' + w + "</span>"; })
      .join(" ");
    var words = el.querySelectorAll(".w");
    var section = el.closest("section");
    mmText.add("(min-width: 860px)", function () {
      section.classList.add("section--pin");
      gsap.fromTo(words, { color: getComputedStyle(words[0]).color, y: 22 }, {
        color: navy, y: 0, ease: "none", stagger: 0.14,
        scrollTrigger: {
          trigger: section, start: function () { return "top " + headerH() + "px"; },
          end: "+=110%", pin: true, scrub: 0.5, anticipatePin: 1, invalidateOnRefresh: true
        }
      });
      return function () { section.classList.remove("section--pin"); };
    });
    mmText.add("(max-width: 859px)", function () {
      gsap.to(words, {
        color: navy, ease: "none", stagger: 0.12,
        scrollTrigger: { trigger: el, start: "top 82%", end: "bottom 62%", scrub: 0.4 }
      });
    });
  });

  /* Títulos: entrada por palabra (en el héroe, letra por letra con giro) */
  document.querySelectorAll("[data-split]").forEach(function (el) {
    var hero = !!el.closest(".hero");
    var parts = splitWords(el, hero);
    gsap.fromTo(parts, { yPercent: 120, rotation: hero ? 9 : 5, transformOrigin: "0% 100%" }, {
      yPercent: 0, rotation: 0, y: 0,
      duration: hero ? 1.25 : 1.1,
      ease: ease,
      stagger: hero ? 0.022 : 0.07,
      delay: hero ? 0.2 : 0,
      scrollTrigger: hero ? null : { trigger: el, start: "top 88%", once: true }
    });
  });

  /* Entradas generales: una sola gramática, no una por sección */
  gsap.utils.toArray("[data-reveal]").forEach(function (el) {
    var delay = parseFloat(el.getAttribute("data-delay")) || 0;
    var hero = !!el.closest(".hero");
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 1.1,
      delay: hero ? 0.75 + delay : delay,
      ease: ease,
      scrollTrigger: hero ? null : { trigger: el, start: "top 90%", once: true }
    });
  });

  /* Fotos: se descubren con una máscara de izquierda a derecha y el cuadro se asienta */
  function maskReveal(box, opts) {
    var img = box.querySelector("img");
    opts = opts || {};
    gsap.fromTo(box, { clipPath: "inset(0% 100% 0% 0%)" }, {
      clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: ease, delay: opts.delay || 0,
      scrollTrigger: opts.st || { trigger: box, start: "top 88%", once: true }
    });
    if (img) gsap.fromTo(img, { scale: 1.35 }, {
      scale: 1, duration: 1.9, ease: ease, delay: opts.delay || 0,
      scrollTrigger: opts.st || { trigger: box, start: "top 88%", once: true }
    });
  }
  document.querySelectorAll(".gallery .frame").forEach(function (box, i) {
    maskReveal(box, { delay: i * 0.1 });
    var img = box.querySelector("img");
    if (img) gsap.fromTo(box, { y: i % 2 ? 40 : 90 }, {
      y: i % 2 ? -50 : -90, ease: "none",
      scrollTrigger: { trigger: box, start: "top bottom", end: "bottom top", scrub: true }
    });
  });
  document.querySelectorAll(".rows--photo figure, .aside-photo").forEach(function (box) { maskReveal(box); });

  /* Divisiones: cada bloque se abre desde su lado */
  [[".division--a", "inset(0% 100% 0% 0%)"], [".division--b", "inset(0% 0% 0% 100%)"]].forEach(function (d) {
    var el = document.querySelector(d[0]);
    if (!el) return;
    gsap.fromTo(el, { clipPath: d[1] }, {
      clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: ease,
      scrollTrigger: { trigger: ".divisions", start: "top 78%", once: true }
    });
  });

  /* Héroe: al salir, cada capa de texto se va a distinta velocidad; el "1920" crece */
  var hero = document.querySelector(".hero");
  if (hero) {
    var heroST = { trigger: hero, start: function () { return "top " + headerH() + "px"; }, end: "bottom top", scrub: true };
    gsap.to(hero.querySelector("h1"), { yPercent: -28, opacity: 0.1, ease: "none", scrollTrigger: heroST });
    gsap.to(hero.querySelector(".lead"), { yPercent: -60, ease: "none", scrollTrigger: heroST });
    gsap.to(hero.querySelector(".doors"), { yPercent: -35, ease: "none", scrollTrigger: heroST });
    gsap.to(hero.querySelector(".hero__year"), { scale: 1.18, transformOrigin: "50% 40%", ease: "none", scrollTrigger: heroST });
  }

  /* Paralaje: el pliego se desplaza a otra velocidad que el texto */
  gsap.utils.toArray("[data-parallax]").forEach(function (el) {
    var amount = parseFloat(el.getAttribute("data-parallax")) || 0.15;
    gsap.fromTo(el, { y: -amount * 220 }, {
      y: amount * 220,
      ease: "none",
      scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true }
    });
  });
  gsap.utils.toArray("[data-spin]").forEach(function (el) {
    gsap.to(el, {
      rotation: 90,
      ease: "none",
      scrollTrigger: { trigger: el.closest("section") || el, start: "top bottom", end: "bottom top", scrub: true }
    });
  });

  /* Scroll horizontal fijado: los paneles entran con empuje y se inclinan con la velocidad */
  var mm = gsap.matchMedia();
  mm.add("(min-width: 860px)", function () {
    document.querySelectorAll(".hscroll").forEach(function (sec) {
      var track = sec.querySelector(".hscroll__track");
      if (!track) return;
      var panels = gsap.utils.toArray(".panel", track);
      var dist = function () { return Math.max(0, track.scrollWidth - window.innerWidth + 0); };
      var run = gsap.to(track, {
        x: function () { return -dist(); },
        ease: "none",
        scrollTrigger: {
          trigger: sec,
          start: function () { return "top " + headerH() + "px"; },
          end: function () { return "+=" + dist(); },
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: function (self) {
            sec.style.setProperty("--hp", self.progress.toFixed(4));
            var sk = clamp(-6, 6, self.getVelocity() / -420);
            gsap.to(panels, { skewX: sk, duration: 0.35, ease: "power3.out", overwrite: "auto" });
          }
        }
      });
      // al detenerse, los paneles se enderezan
      var settle = function () { gsap.to(panels, { skewX: 0, duration: 0.7, ease: ease, overwrite: "auto" }); };
      window.ScrollTrigger.addEventListener("scrollEnd", settle);
      // cada panel entra desde la derecha con su foto descubriéndose
      panels.forEach(function (p) {
        var st = { trigger: p, containerAnimation: run, start: "left 96%", once: true };
        var text = p.querySelector(".panel__text") || p;
        gsap.from(Array.prototype.slice.call(text.children), { x: 140, opacity: 0, duration: 1.1, ease: ease, stagger: 0.1, scrollTrigger: st });
        var photo = p.querySelector(".panel__photo");
        if (photo) maskReveal(photo, { st: st });
      });
      return function () { window.ScrollTrigger.removeEventListener("scrollEnd", settle); };
    });
  });

  window.addEventListener("load", function () { window.ScrollTrigger.refresh(); });
})();
