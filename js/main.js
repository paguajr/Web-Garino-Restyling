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

  /* Divide un título en líneas enmascaradas por palabra (conserva el texto legible) */
  function splitWords(el) {
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
      s.textContent = word;
      line.appendChild(s);
      el.appendChild(line);
      if (i < arr.length - 1) el.appendChild(document.createTextNode(" "));
      inner.push(s);
    });
    return inner;
  }

  /* Texto que se revela al leer: cada palabra pasa de bruma a azul marino con el scroll */
  document.querySelectorAll(".statement").forEach(function (el) {
    var text = el.textContent.trim().replace(/\s+/g, " ");
    el.setAttribute("aria-label", text);
    el.innerHTML = text
      .split(" ")
      .map(function (w) { return '<span class="w" aria-hidden="true">' + w + "</span>"; })
      .join(" ");
    var words = el.querySelectorAll(".w");
    gsap.to(words, {
      color: getComputedStyle(root).getPropertyValue("--navy").trim() || "#002b5c",
      ease: "none",
      stagger: 0.12,
      scrollTrigger: { trigger: el, start: "top 82%", end: "bottom 62%", scrub: 0.4 }
    });
  });

  /* Títulos: entrada por palabra */
  document.querySelectorAll("[data-split]").forEach(function (el) {
    var words = splitWords(el);
    var hero = !!el.closest(".hero");
    gsap.fromTo(words, { yPercent: 110, y: 0 }, {
      yPercent: 0,
      duration: 1.1,
      ease: ease,
      stagger: 0.06,
      delay: hero ? 0.15 : 0,
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
      delay: hero ? 0.55 + delay : delay,
      ease: ease,
      scrollTrigger: hero ? null : { trigger: el, start: "top 90%", once: true }
    });
  });

  /* Paralaje sutil, con propósito: el pliego se desplaza a otra velocidad que el texto */
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

  /* Scroll horizontal fijado (solo escritorio y tablet ancha) */
  var mm = gsap.matchMedia();
  mm.add("(min-width: 860px)", function () {
    document.querySelectorAll(".hscroll").forEach(function (sec) {
      var track = sec.querySelector(".hscroll__track");
      if (!track) return;
      var dist = function () { return Math.max(0, track.scrollWidth - window.innerWidth + 0); };
      gsap.to(track, {
        x: function () { return -dist(); },
        ease: "none",
        scrollTrigger: {
          trigger: sec,
          start: function () { var h = document.querySelector(".site-header"); return "top " + (h ? h.offsetHeight : 0) + "px"; },
          end: function () { return "+=" + dist(); },
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: function (self) { sec.style.setProperty("--hp", self.progress.toFixed(4)); }
        }
      });
    });
  });

  window.addEventListener("load", function () { window.ScrollTrigger.refresh(); });
})();
