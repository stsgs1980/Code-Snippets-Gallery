interface PreviewConfig {
  type: 'canvas2d' | 'webgl' | 'css' | 'static';
  /** For canvas2d: full JS that defines init vars + `function render(ctx, w, h, time){}` */
  /** For webgl: fragment shader source */
  /** For css: full CSS + trailing HTML divs */
  /** For static: language name */
  setup: string;
  animate: boolean;
}

const PREVIEW_MAP: Record<string, PreviewConfig> = {
  // ============================================================
  //  CANVAS 2D — each template defines: vars + function render(ctx, w, h, time)
  // ============================================================

  'cmo2qvu9m0008nrxxsd4rh7e0': {
    // Particle Constellation
    type: 'canvas2d',
    setup: `
var _particles = null;
function _initParticles(w, h) {
  _particles = [];
  for (var i = 0; i < 80; i++) {
    _particles.push({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.6, vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 1.5 + 0.5
    });
  }
}
function render(ctx, w, h, time) {
  if (!_particles) _initParticles(w, h);
  ctx.fillStyle = 'rgba(10,10,20,0.15)';
  ctx.fillRect(0, 0, w, h);
  for (const p of _particles) {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
    if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
  }
  for (let i = 0; i < _particles.length; i++) {
    for (let j = i + 1; j < _particles.length; j++) {
      const dx = _particles[i].x - _particles[j].x;
      const dy = _particles[i].y - _particles[j].y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 100) {
        ctx.strokeStyle = 'rgba(150,180,255,' + ((1 - d / 100) * 0.5) + ')';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(_particles[i].x, _particles[i].y);
        ctx.lineTo(_particles[j].x, _particles[j].y);
        ctx.stroke();
      }
    }
  }
  for (const p of _particles) {
    ctx.fillStyle = 'rgba(180,200,255,0.9)';
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}`,
    animate: true,
  },

  'cmo2qvu9k0005nrxx0k4xitnt': {
    // Neon Grid (Synthwave)
    type: 'canvas2d',
    setup: `
function render(ctx, w, h, time) {
  ctx.fillStyle = '#0d0221';
  ctx.fillRect(0, 0, w, h);
  const horizon = h * 0.45;
  const vanishX = w / 2;
  const gridLines = 30;
  const scroll = (time * 40) % (h - horizon);
  for (let i = 0; i < gridLines; i++) {
    const ratio = (i - scroll / ((h - horizon) / gridLines)) / gridLines;
    if (ratio < 0) continue;
    const y = horizon + ratio * (h - horizon);
    const alpha = Math.min(1, ratio * 2);
    ctx.strokeStyle = 'hsla(320, 100%, 60%, ' + (alpha * 0.6) + ')';
    ctx.lineWidth = ratio > 0.5 ? 1.5 : 0.5;
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }
  for (let i = -gridLines; i <= gridLines; i++) {
    const spacing = i * (w / gridLines);
    ctx.strokeStyle = 'hsla(280, 100%, 60%, ' + (0.3 - Math.abs(i) * 0.008) + ')';
    ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.moveTo(vanishX, horizon); ctx.lineTo(vanishX + spacing, h); ctx.stroke();
  }
  const grad = ctx.createRadialGradient(vanishX, horizon, 0, vanishX, horizon, Math.min(w, h) * 0.3);
  grad.addColorStop(0, 'rgba(255, 100, 200, 0.4)');
  grad.addColorStop(1, 'transparent');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
}`,
    animate: true,
  },

  'cmo2qvu9h0001nrxxdu20yjsm': {
    // Fractal Tree
    type: 'canvas2d',
    setup: `
let seed = 42;
function pseudoRandom() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
function render(ctx, w, h, time) {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#0a0f0a';
  ctx.fillRect(0, 0, w, h);
  seed = 42;
  function branch(x, y, len, angle, depth) {
    if (depth === 0 || len < 2) return;
    const sway = Math.sin(time + depth * 0.5) * 0.03;
    const rad = (angle + sway) * Math.PI / 180;
    const x2 = x + len * Math.cos(rad);
    const y2 = y + len * Math.sin(rad);
    const hue = 120 + depth * 8;
    ctx.strokeStyle = 'hsl(' + hue + ', 70%, ' + (30 + depth * 5) + '%)';
    ctx.lineWidth = depth * 0.8;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x2, y2); ctx.stroke();
    if (depth < 3) {
      ctx.fillStyle = 'hsla(' + (50 + pseudoRandom() * 40) + ', 90%, 65%, 0.6)';
      ctx.beginPath(); ctx.arc(x2, y2, 3 + pseudoRandom() * 4, 0, Math.PI * 2); ctx.fill();
    }
    seed = 42;
    const shrink = 0.68 + pseudoRandom() * 0.08;
    seed = 42;
    branch(x2, y2, len * shrink, angle - 22, depth - 1);
    seed = 42;
    branch(x2, y2, len * shrink * 1.05, angle + 25, depth - 1);
  }
  branch(w / 2, h * 0.85, h * 0.22, -90, 10);
}`,
    animate: true,
  },

  'cmo2qvu9g0000nrxxinarznq4': {
    // Spiral of Primes
    type: 'canvas2d',
    setup: `
function isPrime(n) {
  if (n < 2) return false;
  for (var i = 2; i * i <= n; i++) if (n % i === 0) return false;
  return true;
}
function render(ctx, w, h, time) {
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, w, h);
  var cx = w / 2, cy = h / 2;
  var rot = time * 0.1;
  var scale = Math.min(w, h) / 200;
  for (var n = 2; n < 5000; n++) {
    if (!isPrime(n)) continue;
    var angle = n * 2.399963 + rot;
    var r = Math.sqrt(n) * scale;
    var x = cx + r * Math.cos(angle);
    var y = cy + r * Math.sin(angle);
    if (x < 0 || x > w || y < 0 || y > h) continue;
    var hue = (n * 0.06 + time * 10) % 360;
    ctx.fillStyle = 'hsla(' + hue + ', 80%, 60%, 0.85)';
    ctx.beginPath(); ctx.arc(x, y, 1.5, 0, Math.PI * 2); ctx.fill();
  }
}`,
    animate: true,
  },

  'cmo2qvu9j0003nrxxgwlrqjd5': {
    // Flow Field
    type: 'canvas2d',
    setup: `
function noise(x, y) {
  const ix = Math.floor(x), iy = Math.floor(y);
  const fx = x - ix, fy = y - iy;
  const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
  function hash(a, b) { let h = a * 374761393 + b * 668265263; h = (h ^ (h >> 13)) * 1274126177; return (h & 0x7fffffff) / 0x7fffffff; }
  const n00 = hash(ix, iy), n10 = hash(ix + 1, iy);
  const n01 = hash(ix, iy + 1), n11 = hash(ix + 1, iy + 1);
  return (n00 * (1 - sx) + n10 * sx) * (1 - sy) + (n01 * (1 - sx) + n11 * sx) * sy;
}
const pts = [];
function initFlowField(w, h) {
  pts.length = 0;
  for (let i = 0; i < 600; i++) {
    pts.push({
      x: Math.random() * w, y: Math.random() * h,
      prevX: 0, prevY: 0,
      speed: Math.random() * 1.5 + 0.5
    });
  }
}
let zoff = 0;
function render(ctx, w, h, time) {
  if (pts.length === 0) initFlowField(w, h);
  ctx.fillStyle = 'rgba(8,8,16,0.05)';
  ctx.fillRect(0, 0, w, h);
  zoff += 0.003;
  for (const p of pts) {
    const angle = noise(p.x * 0.005, p.y * 0.005 + zoff) * Math.PI * 4;
    p.prevX = p.x; p.prevY = p.y;
    p.x += Math.cos(angle) * p.speed;
    p.y += Math.sin(angle) * p.speed;
    if (p.x < 0 || p.x > w || p.y < 0 || p.y > h) {
      p.x = Math.random() * w; p.y = Math.random() * h;
      p.prevX = p.x; p.prevY = p.y;
    }
    const hue = (angle / Math.PI * 60 + 180) % 360;
    ctx.strokeStyle = 'hsla(' + hue + ', 70%, 55%, 0.3)';
    ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.moveTo(p.prevX, p.prevY); ctx.lineTo(p.x, p.y); ctx.stroke();
  }
}`,
    animate: true,
  },

  // ============================================================
  //  WEBGL SHADERS
  // ============================================================

  'cmo2qvu9i0002nrxx9lwmrxhx': {
    // Plasma Shader
    type: 'webgl',
    setup: `precision mediump float;
uniform float u_time;
uniform vec2 u_resolution;
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float t = u_time * 0.8;
  float v = 0.0;
  v += sin(uv.x * 10.0 + t);
  v += sin((uv.y * 10.0 + t) * 0.5);
  v += sin((uv.x * 10.0 + uv.y * 10.0 + t) * 0.3);
  vec2 c = uv - 0.5;
  v += sin(length(c) * 12.0 - t * 1.5);
  vec3 col;
  col.r = sin(v * 3.14159) * 0.5 + 0.5;
  col.g = sin(v * 3.14159 + 2.094) * 0.5 + 0.5;
  col.b = sin(v * 3.14159 + 4.188) * 0.5 + 0.5;
  col = pow(col, vec3(0.85));
  gl_FragColor = vec4(col, 1.0);
}`,
    animate: true,
  },

  'cmo2qvu9o000anrxxz3y7ww3g': {
    // Aurora Borealis
    type: 'webgl',
    setup: `precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
vec3 mod289(vec3 x) { return x - floor(x / 289.0) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x / 289.0) * 289.0; }
vec3 permute(vec3 x) { return mod289((x * 34.0 + 1.0) * x); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x_ = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x_) - 0.5;
  vec3 ox = floor(x_ + 0.5);
  vec3 a0 = x_ - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0+h*h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float n = snoise(vec2(uv.x * 3.0, u_time * 0.15)) * 0.5 + 0.5;
  vec3 green = vec3(0.1, 0.8, 0.4);
  vec3 purple = vec3(0.5, 0.1, 0.8);
  vec3 blue = vec3(0.1, 0.3, 0.9);
  float wave = sin(uv.y * 8.0 + n * 6.0 + u_time * 0.5);
  float aurora = smoothstep(0.0, 0.3, wave) * smoothstep(0.8, 0.3, uv.y);
  vec3 col = mix(green, purple, sin(uv.x * 4.0 + u_time * 0.2) * 0.5 + 0.5);
  col = mix(col, blue, sin(uv.x * 2.0 - u_time * 0.3) * 0.3 + 0.3);
  vec3 sky = vec3(0.02, 0.02, 0.08);
  gl_FragColor = vec4(sky + col * aurora * 0.6, 1.0);
}`,
    animate: true,
  },

  // ============================================================
  //  CSS ANIMATIONS
  // ============================================================

  'cmo2qvu9p000bnrxxgl2400fh': {
    // Easing Collection
    type: 'css',
    setup: `
body { background: #0f0f17; color: #e0e0e0; font-family: system-ui, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; gap: 16px; overflow: hidden; margin: 0; }
.row { display: flex; gap: 24px; align-items: center; }
.box { width: 36px; height: 36px; border-radius: 8px; }
.b1 { background: #f59e0b; animation: a1 2s cubic-bezier(0.34, 1.56, 0.64, 1) infinite alternate; }
.b2 { background: #ec4899; animation: a2 2.5s cubic-bezier(0.16, 1, 0.3, 1) infinite alternate; }
.b3 { background: #8b5cf6; animation: a3 3s cubic-bezier(0.22, 1.8, 0.36, 1) infinite alternate; }
.b4 { background: #06b6d4; animation: a4 2s cubic-bezier(0.45, 0, 0.15, 1) infinite alternate; }
.bar-wrap { display: flex; gap: 6px; align-items: flex-end; height: 40px; }
.bar { width: 8px; border-radius: 4px 4px 0 0; background: linear-gradient(to top, #f59e0b, #ec4899); }
.bar:nth-child(1) { animation: grow 1.5s cubic-bezier(0.16, 1, 0.3, 1) infinite alternate; }
.bar:nth-child(2) { animation: grow 1.8s 0.1s cubic-bezier(0.22, 1.8, 0.36, 1) infinite alternate; }
.bar:nth-child(3) { animation: grow 2s 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) infinite alternate; }
.bar:nth-child(4) { animation: grow 1.6s 0.3s cubic-bezier(0.45, 0, 0.15, 1) infinite alternate; }
.bar:nth-child(5) { animation: grow 2.2s 0.15s cubic-bezier(0.7, 0, 0.84, 0) infinite alternate; }
.label { font-size: 9px; color: #666; letter-spacing: 1px; text-transform: uppercase; }
@keyframes a1 { from { transform: translateX(-20px) rotate(0deg); } to { transform: translateX(20px) rotate(180deg); } }
@keyframes a2 { from { transform: scale(0.6); opacity: 0.4; } to { transform: scale(1.2); opacity: 1; } }
@keyframes a3 { from { transform: translateY(10px) skewX(0deg); } to { transform: translateY(-10px) skewX(10deg); } }
@keyframes a4 { from { border-radius: 8px; transform: rotate(0deg); } to { border-radius: 50%; transform: rotate(90deg); } }
@keyframes grow { from { height: 10px; } to { height: 40px; } }
<div class="row">
  <div class="box b1"></div>
  <div class="box b2"></div>
  <div class="box b3"></div>
  <div class="box b4"></div>
</div>
<div class="bar-wrap">
  <div class="bar"></div>
  <div class="bar"></div>
  <div class="bar"></div>
  <div class="bar"></div>
  <div class="bar"></div>
</div>
<div class="label">easing curves</div>`,
    animate: true,
  },

  'cmo2qvu9l0006nrxxoc567sov': {
    // CSS Galaxy
    type: 'css',
    setup: `
body { background: #050510; overflow: hidden; height: 100vh; margin: 0; }
.galaxy {
  position: absolute; top: 50%; left: 50%;
  width: 2px; height: 2px; background: transparent;
  animation: rotate 60s linear infinite;
}
.galaxy::before, .galaxy::after {
  content: ''; position: absolute; top: 0; left: 0;
  width: 600px; height: 600px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}
.galaxy::before {
  box-shadow:
    224px 89px 1px 0 #fff, 197px 201px 1px 0 #fff, 112px 148px 1px 0 #fff,
    300px 50px 2px 0 #ff9de2, 250px 180px 1px 0 #a78bfa,
    150px 300px 1px 0 #67e8f9, 100px 80px 2px 0 #fbbf24,
    350px 250px 1px 0 #fff, 80px 220px 1px 0 #c084fc,
    280px 100px 2px 0 #f472b6, 180px 350px 1px 0 #34d399,
    50px 300px 1px 0 #fff, 400px 150px 1px 0 #fb923c,
    320px 320px 1px 0 #fff, 170px 50px 1px 0 #818cf8;
  animation: pulse1 4s ease-in-out infinite alternate;
}
.galaxy::after {
  box-shadow:
    200px 120px 1px 0 #fff, 260px 250px 2px 0 #c084fc,
    140px 190px 1px 0 #67e8f9, 380px 80px 1px 0 #fbbf24,
    90px 350px 1px 0 #f472b6, 230px 300px 1px 0 #fff,
    310px 180px 2px 0 #a78bfa, 160px 130px 1px 0 #ff9de2,
    350px 350px 1px 0 #34d399, 70px 150px 1px 0 #fff,
    290px 50px 1px 0 #fb923c, 410px 280px 1px 0 #fff,
    120px 260px 1px 0 #818cf8, 340px 200px 1px 0 #fff;
  animation: pulse2 5s ease-in-out infinite alternate;
}
.center-glow {
  position: absolute; top: 50%; left: 50%;
  width: 120px; height: 120px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: radial-gradient(circle, rgba(180,140,255,0.15) 0%, transparent 70%);
}
@keyframes rotate { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }
@keyframes pulse1 { from { opacity: 0.6; } to { opacity: 1; } }
@keyframes pulse2 { from { opacity: 1; } to { opacity: 0.6; } }
<div class="galaxy"></div><div class="center-glow"></div>`,
    animate: true,
  },

  // ============================================================
  //  HASKELL — Quicksort visualizer
  // ============================================================

  'cmo2qvu9j0004nrxxp3kgq0y4': {
    type: 'canvas2d',
    setup: `
var _arr = null;
var _comparing = -1;
var _sorted = -1;
var _phase = 0;
var _timer = 0;
function _initSort(w, h) {
  _arr = [];
  var count = Math.floor(w / 6);
  for (var i = 0; i < count; i++) _arr.push(Math.random() * 0.85 + 0.15);
  _comparing = -1; _sorted = -1; _phase = 0; _timer = 0;
}
function _qs(arr, lo, hi, steps) {
  if (lo >= hi || steps.length > 200) return steps;
  var pivot = arr[hi]; var i = lo;
  steps.push({t:'p', v: hi});
  for (var j = lo; j < hi; j++) {
    steps.push({t:'c', a: j, b: hi});
    if (arr[j] <= pivot) {
      var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
      steps.push({t:'s', a: i, b: j});
      i++;
    }
  }
  var tmp2 = arr[i]; arr[i] = arr[hi]; arr[hi] = tmp2;
  steps.push({t:'s', a: i, b: hi});
  steps.push({t:'d', v: i});
  _qs(arr, lo, i - 1, steps);
  _qs(arr, i + 1, hi, steps);
  return steps;
}
var _steps = null;
var _stepIdx = 0;
var _renderArr = null;
function render(ctx, w, h, time) {
  if (!_arr) {
    _initSort(w, h);
    _renderArr = _arr.slice();
    var sortArr = _arr.slice();
    _steps = _qs(sortArr, 0, sortArr.length - 1, []);
    _stepIdx = 0; _comparing = -1;
  }
  ctx.fillStyle = '#0c0c14';
  ctx.fillRect(0, 0, w, h);
  var n = _renderArr.length;
  var barW = w / n;
  var maxH = h * 0.85;
  _timer += 1;
  if (_timer % 2 === 0 && _stepIdx < _steps.length) {
    var step = _steps[_stepIdx++];
    if (step.t === 'c') _comparing = step.a;
    else if (step.t === 's') {
      var tmp = _renderArr[step.a]; _renderArr[step.a] = _renderArr[step.b]; _renderArr[step.b] = tmp;
      _comparing = -1;
    } else if (step.t === 'd') _comparing = -1;
    if (_stepIdx >= _steps.length) { _comparing = -1; _sorted = 1; }
  }
  for (var i = 0; i < n; i++) {
    var barH = _renderArr[i] * maxH;
    var hue = 160 + _renderArr[i] * 80;
    var light = _comparing === i ? 70 : 45;
    ctx.fillStyle = 'hsl(' + hue + ', 75%, ' + light + '%)';
    ctx.fillRect(i * barW + 0.5, h - barH, barW - 1, barH);
  }
  if (_sorted === 1 && _stepIdx >= _steps.length) {
    setTimeout(function() { _initSort(w, h); _renderArr = _arr.slice(); var sortArr = _arr.slice(); _steps = _qs(sortArr, 0, sortArr.length - 1, []); _stepIdx = 0; _sorted = 0; }, 2000);
    _sorted = 2;
  }
}`,
    animate: true,
  },

  // ============================================================
  //  PYTHON — Wave Function Collapse visualizer
  // ============================================================

  'cmo2qvu9n0009nrxxhim874py': {
    type: 'canvas2d',
    setup: `
var _grid = null;
var _gw = 0; var _gh = 0; var _cellSize = 12;
var _gen = 0;
var _colors = ['#f59e0b','#ec4899','#8b5cf6','#06b6d4','#34d399','#fb923c','#a78bfa'];
function _initWFC(w, h) {
  _gw = Math.floor(w / _cellSize);
  _gh = Math.floor(h / _cellSize);
  _grid = [];
  for (var y = 0; y < _gh; y++) {
    _grid[y] = [];
    for (var x = 0; x < _gw; x++) {
      _grid[y][x] = { options: [0,1,2,3,4,5,6], collapsed: false };
    }
  }
  _gen = 0;
}
function _propagate(gx, gy) {
  var tile = _grid[gy][gx].options[0];
  var dirs = [[0,-1],[0,1],[-1,0],[1,0]];
  var allowed = {
    0: [[0,1,2,3,4,5,6],[0,1,2,3,4,5,6],[0,1,2,3,4,5,6],[0,1,2,3,4,5,6]],
    1: [[0,1,2,4,5],[0,1,2,4,5],[0,1,2,3,4,5,6],[0,1,2,3,4,5,6]],
    2: [[1,2,3,5,6],[0,2,3,4,6],[0,1,2,3,4,5,6],[0,1,2,3,4,5,6]],
    3: [[3,4,5,6],[3,4,5,6],[0,1,3,4,5,6],[0,2,3,4,5,6]],
    4: [[0,2,4,6],[1,3,5,6],[0,1,2,3,4,5,6],[0,1,2,3,4,5,6]],
    5: [[0,1,5,6],[2,3,4,5,6],[0,1,2,3,4,5,6],[0,1,2,3,4,5,6]],
    6: [[0,1,2,3,4,5,6],[0,1,2,3,4,5,6],[2,4,5,6],[1,3,5,6]]
  };
  for (var d = 0; d < 4; d++) {
    var nx = gx + dirs[d][0]; var ny = gy + dirs[d][1];
    if (nx >= 0 && nx < _gw && ny >= 0 && ny < _gh && !_grid[ny][nx].collapsed) {
      var cell = _grid[ny][nx];
      var valid = allowed[tile][d];
      cell.options = cell.options.filter(function(v) { return valid.indexOf(v) >= 0; });
      if (cell.options.length === 0) cell.options = [Math.floor(Math.random() * 7)];
    }
  }
}
function _collapseStep() {
  var minOpts = 999; var mx = -1; var my = -1;
  for (var y = 0; y < _gh; y++) for (var x = 0; x < _gw; x++) {
    if (!_grid[y][x].collapsed && _grid[y][x].options.length > 1 && _grid[y][x].options.length < minOpts) {
      minOpts = _grid[y][x].options.length; mx = x; my = y;
    }
  }
  if (mx < 0) { var allDone = true; for (var y2 = 0; y2 < _gh; y2++) for (var x2 = 0; x2 < _gw; x2++) if (!_grid[y2][x2].collapsed) allDone = false; return allDone; }
  var cell = _grid[my][mx];
  var pick = cell.options[Math.floor(Math.random() * cell.options.length)];
  cell.options = [pick]; cell.collapsed = true;
  _propagate(mx, my);
  return false;
}
function render(ctx, w, h, time) {
  if (!_grid) _initWFC(w, h);
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, w, h);
  var allDone = false;
  for (var s = 0; s < 3; s++) allDone = _collapseStep();
  for (var y = 0; y < _gh; y++) for (var x = 0; x < _gw; x++) {
    var cell = _grid[y][x];
    if (cell.collapsed) {
      ctx.fillStyle = _colors[cell.options[0]];
      ctx.globalAlpha = 0.85;
      ctx.fillRect(x * _cellSize + 1, y * _cellSize + 1, _cellSize - 2, _cellSize - 2);
      ctx.globalAlpha = 1;
    } else {
      var entropy = 1 - cell.options.length / 7;
      ctx.fillStyle = 'rgba(100,100,140,' + (0.1 + entropy * 0.3) + ')';
      ctx.fillRect(x * _cellSize + 1, y * _cellSize + 1, _cellSize - 2, _cellSize - 2);
    }
  }
  if (allDone) setTimeout(function() { _initWFC(w, h); }, 1500);
}`,
    animate: true,
  },

  // ============================================================
  //  RUST — Mandelbrot zoom
  // ============================================================

  'cmo2qvu9m0007nrxxsfevba4d': {
    type: 'canvas2d',
    setup: `
var _imgData = null;
var _zoom = 1.5;
var _cx = -0.745; var _cy = 0.186;
var _needsRedraw = true;
function render(ctx, w, h, time) {
  if (!_imgData || _imgData.width !== w || _imgData.height !== h) {
    _imgData = ctx.createImageData(w, h);
    _needsRedraw = true;
  }
  if (!_needsRedraw) return;
  _needsRedraw = false;
  var d = _imgData.data;
  var maxIter = 80;
  var scale = _zoom;
  for (var py = 0; py < h; py++) {
    for (var px = 0; px < w; px++) {
      var x0 = (px - w / 2) / (w / 4) / scale + _cx;
      var y0 = (py - h / 2) / (h / 4) / scale + _cy;
      var x = 0; var y = 0; var iter = 0;
      while (x * x + y * y <= 4 && iter < maxIter) {
        var xt = x * x - y * y + x0; y = 2 * x * y + y0; x = xt; iter++;
      }
      var idx = (py * w + px) * 4;
      if (iter === maxIter) {
        d[idx] = 8; d[idx+1] = 8; d[idx+2] = 16;
      } else {
        var t = iter / maxIter;
        var hue = t * 360 + time * 20;
        var r = 0, g = 0, b = 0;
        var hi = hue / 60; var f = hi - Math.floor(hi);
        switch (Math.floor(hi) % 6) {
          case 0: r=1; g=f; b=0; break;
          case 1: r=1-f; g=1; b=0; break;
          case 2: r=0; g=1; b=f; break;
          case 3: r=0; g=1-f; b=1; break;
          case 4: r=f; g=0; b=1; break;
          case 5: r=1; g=0; b=1-f; break;
        }
        d[idx] = Math.floor(r * 200 + 30);
        d[idx+1] = Math.floor(g * 200 + 30);
        d[idx+2] = Math.floor(b * 200 + 30);
      }
      d[idx+3] = 255;
    }
  }
  ctx.putImageData(_imgData, 0, 0);
  _zoom *= 1.008;
  if (_zoom > 50000) { _zoom = 1.5; }
  _needsRedraw = true;
}`,
    animate: true,
  },
};

// ============================================================
//  UTILITIES
// ============================================================

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

// ============================================================
//  HTML GENERATORS
// ============================================================

function generateCanvas2dHTML(setupCode: string, animate: boolean): string {
  // All canvas2d templates define: init vars + function render(ctx, w, h, time) {}
  const loopCode = animate
    ? `let _animId;\nfunction _loop(t) {\n  render(ctx, canvas.width, canvas.height, t / 1000);\n  _animId = requestAnimationFrame(_loop);\n}\n_animId = requestAnimationFrame(_loop);`
    : `render(ctx, canvas.width, canvas.height, 0);`;

  return `<!DOCTYPE html><html><head>
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; img-src data:;"><style>
*{margin:0;padding:0}body{background:#0a0a0f;overflow:hidden}
canvas{display:block;width:100%;height:100%}
</style></head><body>
<canvas id="c"></canvas>
<script>
var canvas = document.getElementById('c');
var ctx = canvas.getContext('2d');
function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resize(); window.addEventListener('resize', resize);
${setupCode}
${loopCode}
</script></body></html>`;
}

function generateWebGLHTML(fragShader: string): string {
  return `<!DOCTYPE html><html><head>
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; img-src data:;"><style>
*{margin:0;padding:0}body{overflow:hidden;background:#000}
canvas{display:block;width:100%;height:100%}
</style></head><body>
<canvas id="c"></canvas>
<script>
var canvas = document.getElementById('c');
var gl = canvas.getContext('webgl');
if (!gl) { document.body.innerHTML = '<p style="color:#888;padding:20px;font-family:sans-serif">WebGL not supported</p>'; }
function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; if (gl) gl.viewport(0, 0, canvas.width, canvas.height); }
resize(); window.addEventListener('resize', resize);

var vs = 'attribute vec2 a_position; void main(){ gl_Position = vec4(a_position, 0.0, 1.0); }';
var fs = \`${fragShader}\`;

function compile(src, type) {
  var s = gl.createShader(type);
  gl.shaderSource(s, src); gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.error(gl.getShaderInfoLog(s)); return null; }
  return s;
}
var prog = gl.createProgram();
gl.attachShader(prog, compile(vs, gl.VERTEX_SHADER));
gl.attachShader(prog, compile(fs, gl.FRAGMENT_SHADER));
gl.linkProgram(prog);
if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { console.error(gl.getProgramInfoLog(prog)); }
gl.useProgram(prog);

var buf = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buf);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
var pos = gl.getAttribLocation(prog, 'a_position');
gl.enableVertexAttribArray(pos);
gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

var ut = gl.getUniformLocation(prog, 'u_time');
var ur = gl.getUniformLocation(prog, 'u_resolution');
function loop(t) {
  gl.uniform1f(ut, t / 1000);
  gl.uniform2f(ur, canvas.width, canvas.height);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
</script></body></html>`;
}

function generateCSSHTML(cssAndHtml: string): string {
  // Split: everything before the first HTML tag is CSS, the rest is HTML
  const htmlTagMatch = cssAndHtml.match(/(<div[\s>]|<span[\s>])/);
  let css = cssAndHtml;
  let html = '';
  if (htmlTagMatch) {
    const idx = cssAndHtml.indexOf(htmlTagMatch[1]);
    css = cssAndHtml.substring(0, idx);
    html = cssAndHtml.substring(idx);
  }
  return `<!DOCTYPE html><html><head>
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data:;"><style>${css}</style></head><body>${html}</body></html>`;
}

function generateStaticHTML(language: string, snippet: {
  title: string; description: string; code: string;
  language: string; category: string; author: string;
}): string {
  const langColors: Record<string, string> = {
    Haskell: '#5e5086', Python: '#3776ab', Rust: '#dea584',
  };
  const color = langColors[language] || '#666';
  const codeLines = snippet.code.split('\n').slice(0, 12).map(line =>
    escapeHtml(line)
  ).join('\n');

  return `<!DOCTYPE html><html><head>
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data:; font-src data:;"><style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0c0c14;display:flex;align-items:center;justify-content:center;height:100vh;font-family:'Courier New',monospace;color:#e0e0e0;overflow:hidden}
.card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:28px;max-width:90%;max-height:90%;overflow:hidden}
.badge{display:inline-block;background:${color}22;color:${color};border:1px solid ${color}44;border-radius:20px;padding:4px 14px;font-size:11px;margin-bottom:16px;letter-spacing:0.5px}
.title{font-size:20px;font-weight:700;margin-bottom:6px;color:#fff}
.desc{font-size:12px;color:#888;margin-bottom:16px;line-height:1.5}
.code{background:rgba(0,0,0,0.4);border-radius:8px;padding:14px;font-size:11px;line-height:1.7;overflow:hidden;max-height:200px;color:#aab;border-left:2px solid ${color}66}
</style></head><body>
<div class="card">
  <div class="badge">${escapeHtml(snippet.language)}</div>
  <div class="title">${escapeHtml(snippet.title)}</div>
  <div class="desc">${escapeHtml(snippet.description)}</div>
  <pre class="code">${codeLines}</pre>
</div>
</body></html>`;
}

// ============================================================
//  PUBLIC API
// ============================================================

export function generatePreviewHTML(snippet: {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
  category: string;
  author: string;
}): string {
  const config = PREVIEW_MAP[snippet.id];

  if (!config || config.type === 'static') {
    return generateStaticHTML(config?.setup || snippet.language, snippet);
  }

  switch (config.type) {
    case 'canvas2d':
      return generateCanvas2dHTML(config.setup, config.animate);
    case 'webgl':
      return generateWebGLHTML(config.setup);
    case 'css':
      return generateCSSHTML(config.setup);
    default:
      return generateStaticHTML(snippet.language, snippet);
  }
}

export function hasInteractivePreview(snippetId: string): boolean {
  const config = PREVIEW_MAP[snippetId];
  return !!config && config.type !== 'static';
}
