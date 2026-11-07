/* Hero 3D: un pliego de imprenta que se pliega en acordeón y queda en reposo.
   Solo paleta de la marca. Se carga bajo demanda; el hero funciona sin esto. */
import * as THREE from "./vendor/three.module.min.js";

var NAVY = "#002b5c", BLUE = "#0065a4", SLATE = "#536283", MIST = "#c6cbd6", INK = "#555555";

/* Textura del pliego: papel blanco con marcas de corte, de doblez, registro,
   escala de tonos y micro-texto; un "1920" en contorno cruza los dobleces. */
function sheetTexture(renderer) {
  var W = 2400, H = 1800, c = document.createElement("canvas");
  c.width = W; c.height = H;
  var g = c.getContext("2d");
  g.fillStyle = "#ffffff"; g.fillRect(0, 0, W, H);

  // "1920" en contorno, atraviesa las 4 secciones
  g.font = "800 1180px Montserrat, system-ui, sans-serif";
  g.textBaseline = "alphabetic"; g.textAlign = "center";
  g.lineWidth = 6; g.strokeStyle = MIST;
  g.strokeText("1920", W / 2, H * 0.74);

  // franja azul marino, para dar contraste a los dobleces
  g.fillStyle = NAVY; g.fillRect(0, H * 0.80, W, H * 0.045);

  // escala de tonos (los seis pasos de la paleta)
  var steps = ["#ffffff", MIST, SLATE, BLUE, NAVY, INK], sw = 170, sx = W - 120 - sw * 6, sy = H - 200;
  steps.forEach(function (col, i) {
    g.fillStyle = col; g.fillRect(sx + i * sw, sy, sw, 60);
    g.strokeStyle = MIST; g.lineWidth = 2; g.strokeRect(sx + i * sw, sy, sw, 60);
  });

  // marcas de corte en las cuatro esquinas
  g.strokeStyle = NAVY; g.lineWidth = 4;
  var m = 60, L = 80;
  [[m, m, 1, 1], [W - m, m, -1, 1], [m, H - m, 1, -1], [W - m, H - m, -1, -1]].forEach(function (p) {
    g.beginPath(); g.moveTo(p[0], p[1] + p[3] * L); g.lineTo(p[0], p[1]); g.lineTo(p[0] + p[2] * L, p[1]); g.stroke();
  });

  // marcas de doblez (arriba y abajo) en cada unión
  g.strokeStyle = BLUE; g.lineWidth = 4;
  for (var i = 1; i < 4; i++) {
    var x = (W / 4) * i;
    g.beginPath(); g.moveTo(x, m); g.lineTo(x, m + 56); g.moveTo(x, H - m); g.lineTo(x, H - m - 56); g.stroke();
  }

  // registro
  function reg(cx, cy, r) {
    g.strokeStyle = NAVY; g.lineWidth = 4;
    g.beginPath(); g.arc(cx, cy, r, 0, 7); g.stroke();
    g.beginPath(); g.arc(cx, cy, r * 0.36, 0, 7); g.stroke();
    g.beginPath(); g.moveTo(cx - r * 1.5, cy); g.lineTo(cx + r * 1.5, cy); g.moveTo(cx, cy - r * 1.5); g.lineTo(cx, cy + r * 1.5); g.stroke();
  }
  reg(W / 2, 220, 44);
  reg(W * 0.12, H * 0.5, 44);

  // micro-texto
  g.fillStyle = SLATE; g.font = "600 30px Montserrat, system-ui, sans-serif"; g.textAlign = "left";
  g.fillText("GARINO HNOS. S.A.  ·  MONTEVIDEO  ·  1920", 150, 130);
  g.textAlign = "right"; g.fillText("PLIEGO DE CONTROL", W - 150, 130);

  var t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  return t;
}

export function init(hero, opts) {
  opts = opts || {};
  var host = document.createElement("div");
  host.className = "hero__3d";
  host.setAttribute("aria-hidden", "true");
  var canvas = document.createElement("canvas");
  host.appendChild(canvas);
  hero.insertBefore(host, hero.querySelector(".wrap"));

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, powerPreference: "low-power" });
  } catch (e) { host.remove(); return false; }
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
  camera.position.set(0, 0, 10.6);

  scene.add(new THREE.AmbientLight(0xffffff, 0.8));
  var key = new THREE.DirectionalLight(0xffffff, 2.3); key.position.set(-5, 4, 6); scene.add(key);
  var rim = new THREE.DirectionalLight(0x9fb8d6, 0.7); rim.position.set(5, -2, 3); scene.add(rim);

  // Pliego de 4 secciones articuladas en acordeón
  var N = 4, PW = 1.32, PH = 3.25;
  var tex = sheetTexture(renderer);
  var pivot = new THREE.Group(); scene.add(pivot);
  var root = new THREE.Group(); pivot.add(root);
  var hinges = [], parent = root;
  for (var i = 0; i < N; i++) {
    var hinge = new THREE.Group();
    hinge.position.x = i === 0 ? 0 : PW;
    parent.add(hinge);
    var geo = new THREE.PlaneGeometry(PW, PH, 1, 1);
    geo.translate(PW / 2, 0, 0);
    var uv = geo.attributes.uv;
    for (var k = 0; k < uv.count; k++) uv.setX(k, (i + uv.getX(k)) / N);
    var mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.92, metalness: 0, side: THREE.DoubleSide });
    hinge.add(new THREE.Mesh(geo, mat));
    hinges.push(hinge);
    parent = hinge;
  }

  var FOLD = 0.78;               // radianes por doblez
  var fold = opts.reduce ? 1 : 0;  // 0 plano, 1 plegado
  var pointer = { x: 0, y: 0 }, tilt = { x: 0, y: 0 };
  var running = false, raf = 0, start = 0, introDone = !!opts.reduce;

  function ease(t) { return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t); } // expo.out

  function pose() {
    var th = FOLD * fold, proj = PW;
    for (var i = 1; i < N; i++) {
      hinges[i].rotation.y = (i % 2 === 1 ? 1 : -1) * -th;
      proj += PW * Math.cos(th);
    }
    root.position.x = -proj / 2;            // el pliego queda centrado en su pivote
    pivot.rotation.y = -0.28 * fold + tilt.x; // de tres cuartos al plegarse
    pivot.rotation.x = 0.07 * fold + tilt.y;
    pivot.rotation.z = -0.03 * fold;
  }

  function resize() {
    var r = host.getBoundingClientRect();
    var w = Math.max(1, r.width), h = Math.max(1, r.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.position.z = Math.max(10.6, 11.2 / camera.aspect); // el pliego completo cabe en cualquier proporción
    camera.updateProjectionMatrix();
  }

  function frame(now) {
    if (!running) return;
    raf = requestAnimationFrame(frame);
    if (!start) start = now;
    if (!introDone) {
      var t = (now - start - 500) / 2200;         // 0.5 s de espera, 2.2 s de pliegue
      fold = t <= 0 ? 0 : ease(Math.min(1, t));
      if (t >= 1) introDone = true;
    }
    tilt.x += (pointer.x * 0.14 - tilt.x) * 0.08;
    tilt.y += (-pointer.y * 0.10 - tilt.y) * 0.08;
    pose();
    renderer.render(scene, camera);
  }

  function play() { if (!running) { running = true; raf = requestAnimationFrame(frame); } }
  function stop() { running = false; cancelAnimationFrame(raf); }

  function onMove(e) {
    var r = hero.getBoundingClientRect();
    pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    pointer.y = ((e.clientY - r.top) / r.height) * 2 - 1;
  }

  resize();
  if (window.ResizeObserver) new ResizeObserver(resize).observe(host); else window.addEventListener("resize", resize);

  if (opts.reduce) {
    // sin movimiento: una sola imagen del pliego ya plegado
    pose(); renderer.render(scene, camera);
  } else {
    window.addEventListener("pointermove", onMove, { passive: true });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) { en[0].isIntersecting ? play() : stop(); }, { threshold: 0.05 }).observe(hero);
    } else play();
    document.addEventListener("visibilitychange", function () { document.hidden ? stop() : play(); });
  }

  hero.classList.add("hero--3d");
  return true;
}
