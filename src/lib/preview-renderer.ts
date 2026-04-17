interface PreviewConfig {
  type: 'canvas2d' | 'webgl' | 'css' | 'static';
  setup: string;
  render?: string;
  animate?: boolean;
}

const PREVIEW_MAP: Record<string, PreviewConfig> = {
  // ---- CANVAS 2D ----
  'cmo2qvu9m0008nrxxsd4rh7e0': {
    type: 'canvas2d',
    setup: `
const particles = [];
for (let i = 0; i < 80; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.6,
    vy: (Math.random() - 0.5) * 0.6,
    radius: Math.random() * 1.5 + 0.5
  });
}
function draw() {
  ctx.fillStyle = 'rgba(10,10,20,0.15)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (const p of particles) {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;
  }
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d = Math.sqrt(dx*dx + dy*dy);
      if (d < 100) {
        ctx.strokeStyle = \`rgba(150,180,255,\${(1-d/100)*0.5})\`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
  for (const p of particles) {
    ctx.fillStyle = 'rgba(180,200,255,0.9)';
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI*2);
    ctx.fill();
  }
}`,
    animate: true,
  },

  'cmo2qvu9k0005nrxx0k4xitnt': {
    type: 'canvas2d',
    setup: `
function drawNeonGrid(ctx, w, h, t) {
  ctx.fillStyle = '#0d0221';
  ctx.fillRect(0, 0, w, h);
  const horizon = h * 0.45;
  const vanishX = w / 2;
  const gridLines = 30;
  const scroll = (t * 40) % (h - horizon);
  for (let i = 0; i < gridLines; i++) {
    const ratio = (i - scroll / ((h - horizon) / gridLines)) / gridLines;
    if (ratio < 0) continue;
    const y = horizon + ratio * (h - horizon);
    const alpha = Math.min(1, ratio * 2);
    ctx.strokeStyle = \`hsla(320, 100%, 60%, \${alpha * 0.6})\`;
    ctx.lineWidth = ratio > 0.5 ? 1.5 : 0.5;
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }
  for (let i = -gridLines; i <= gridLines; i++) {
    const spacing = i * (w / gridLines);
    ctx.strokeStyle = \`hsla(280, 100%, 60%, \${0.3 - Math.abs(i) * 0.008})\`;
    ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.moveTo(vanishX, horizon); ctx.lineTo(vanishX + spacing, h); ctx.stroke();
  }
  const grad = ctx.createRadialGradient(vanishX, horizon, 0, vanishX, horizon, 120);
  grad.addColorStop(0, 'rgba(255, 100, 200, 0.4)');
  grad.addColorStop(1, 'transparent');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
}`,
    animate: true,
  },

  'cmo2qvu9h0001nrxxdu20yjsm': {
    type: 'canvas2d',
    setup: `
let seed = 42;
function pseudoRandom() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
function drawTree(ctx, x, y, len, angle, depth) {
  if (depth === 0 || len < 2) return;
  const sway = Math.sin(Date.now() / 1000 + depth * 0.5) * 0.03;
  const rad = (angle + sway) * Math.PI / 180;
  const x2 = x + len * Math.cos(rad);
  const y2 = y + len * Math.sin(rad);
  const hue = 120 + depth * 8;
  ctx.strokeStyle = \`hsl(\${hue}, 70%, \${30 + depth * 5}%)\`;
  ctx.lineWidth = depth * 0.8;
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x2, y2); ctx.stroke();
  if (depth < 3) {
    ctx.fillStyle = \`hsla(\${50 + pseudoRandom() * 40}, 90%, 65%, 0.6)\`;
    ctx.beginPath(); ctx.arc(x2, y2, 3 + pseudoRandom() * 4, 0, Math.PI*2); ctx.fill();
  }
  const shrink = 0.68 + pseudoRandom() * 0.08;
  seed = 42; // reset seed for consistent shape
  drawTree(ctx, x2, y2, len * 0.7, angle - 22, depth - 1);
  seed = 42;
  drawTree(ctx, x2, y2, len * 0.72, angle + 25, depth - 1);
}`,
    animate: true,
  },

  'cmo2qvu9g0000nrxxinarznq4': {
    type: 'canvas2d',
    setup: `
function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
  return true;
}
function drawPrimeSpiral(ctx, w, h) {
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, w, h);
  const cx = w / 2, cy = h / 2;
  for (let n = 2; n < 5000; n++) {
    if (!isPrime(n)) continue;
    const angle = n * 2.399963;
    const r = Math.sqrt(n) * (Math.min(w, h) / 200);
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    if (x < 0 || x > w || y < 0 || y > h) continue;
    const hue = (n * 0.06) % 360;
    ctx.fillStyle = \`hsla(\${hue}, 80%, 60%, 0.8)\`;
    ctx.beginPath(); ctx.arc(x, y, 1.5, 0, Math.PI*2); ctx.fill();
  }
}`,
    animate: false,
  },

  'cmo2qvu9j0003nrxxgwlrqjd5': {
    type: 'canvas2d',
    setup: `
// Simple Perlin-like noise
function noise(x, y) {
  const ix = Math.floor(x), iy = Math.floor(y);
  const fx = x - ix, fy = y - iy;
  const sx = fx*fx*(3-2*fx), sy = fy*fy*(3-2*fy);
  function hash(a, b) { let h = a*374761393 + b*668265263; h = (h^(h>>13))*1274126177; return (h&0x7fffffff)/0x7fffffff; }
  const n00 = hash(ix, iy), n10 = hash(ix+1, iy);
  const n01 = hash(ix, iy+1), n11 = hash(ix+1, iy+1);
  return (n00*(1-sx)+n10*sx)*(1-sy) + (n01*(1-sx)+n11*sx)*sy;
}
const pts = [];
for (let i = 0; i < 600; i++) {
  pts.push({ x: Math.random()*canvas.width, y: Math.random()*canvas.height,
    prevX: 0, prevY: 0, speed: Math.random()*1.5+0.5 });
}
let zoff = 0;
function draw() {
  ctx.fillStyle = 'rgba(8,8,16,0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  zoff += 0.003;
  for (const p of pts) {
    const angle = noise(p.x*0.005, p.y*0.005 + zoff) * Math.PI * 4;
    p.prevX = p.x; p.prevY = p.y;
    p.x += Math.cos(angle) * p.speed;
    p.y += Math.sin(angle) * p.speed;
    if (p.x<0||p.x>canvas.width||p.y<0||p.y>canvas.height) {
      p.x = Math.random()*canvas.width; p.y = Math.random()*canvas.height;
      p.prevX = p.x; p.prevY = p.y;
    }
    const hue = (angle / Math.PI * 60 + 180) % 360;
    ctx.strokeStyle = \`hsla(\${hue}, 70%, 55%, 0.3)\`;
    ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.moveTo(p.prevX, p.prevY); ctx.lineTo(p.x, p.y); ctx.stroke();
  }
}`,
    animate: true,
  },

  // ---- GLSL SHADERS ----
  'cmo2qvu9i0002nrxx9lwmrxhx': {
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

  // ---- CSS ----
  'cmo2qvu9p000bnrxxgl2400fh': {
    type: 'css',
    setup: `
:root {
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-expo: cubic-bezier(0.7, 0, 0.84, 0);
  --ease-overshoot: cubic-bezier(0.22, 1.8, 0.36, 1);
  --ease-dramatic: cubic-bezier(0.11, 0, 0.5, 0);
  --ease-liquid: cubic-bezier(0.45, 0, 0.15, 1);
}
body { background: #0f0f17; color: #e0e0e0; font-family: system-ui, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; gap: 16px; overflow: hidden; }
.row { display: flex; gap: 24px; align-items: center; }
.box { width: 36px; height: 36px; border-radius: 8px; }
.b1 { background: #f59e0b; animation: a1 2s var(--ease-spring) infinite alternate; }
.b2 { background: #ec4899; animation: a2 2.5s var(--ease-out-expo) infinite alternate; }
.b3 { background: #8b5cf6; animation: a3 3s var(--ease-overshoot) infinite alternate; }
.b4 { background: #06b6d4; animation: a4 2s var(--ease-liquid) infinite alternate; }
.bar-wrap { display: flex; gap: 6px; align-items: flex-end; height: 40px; }
.bar { width: 8px; border-radius: 4px 4px 0 0; background: linear-gradient(to top, #f59e0b, #ec4899); }
.bar:nth-child(1) { animation: grow 1.5s var(--ease-out-expo) infinite alternate; }
.bar:nth-child(2) { animation: grow 1.8s 0.1s var(--ease-overshoot) infinite alternate; }
.bar:nth-child(3) { animation: grow 2s 0.2s var(--ease-spring) infinite alternate; }
.bar:nth-child(4) { animation: grow 1.6s 0.3s var(--ease-liquid) infinite alternate; }
.bar:nth-child(5) { animation: grow 2.2s 0.15s var(--ease-in-expo) infinite alternate; }
.label { font-size: 9px; color: #666; letter-spacing: 1px; text-transform: uppercase; }
@keyframes a1 { from { transform: translateX(-20px) rotate(0deg); } to { transform: translateX(20px) rotate(180deg); } }
@keyframes a2 { from { transform: scale(0.6); opacity: 0.4; } to { transform: scale(1.2); opacity: 1; } }
@keyframes a3 { from { transform: translateY(10px) skewX(0deg); } to { transform: translateY(-10px) skewX(10deg); } }
@keyframes a4 { from { border-radius: 8px; transform: rotate(0deg); } to { border-radius: 50%; transform: rotate(90deg); } }
@keyframes grow { from { height: 10px; } to { height: 40px; } }
`,
    animate: true,
  },

  'cmo2qvu9l0006nrxxoc567sov': {
    type: 'css',
    setup: `
body { background: #050510; overflow: hidden; height: 100vh; }
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
@keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes pulse1 { from { opacity: 0.6; } to { opacity: 1; } }
@keyframes pulse2 { from { opacity: 1; } to { opacity: 0.6; } }
<div class="galaxy"></div><div class="center-glow"></div>
`,
    animate: true,
  },

  // ---- STATIC (non-browser languages) ----
  'cmo2qvu9j0004nrxxp3kgq0y4': { type: 'static', setup: 'Haskell' },
  'cmo2qvu9n0009nrxxhim874py': { type: 'static', setup: 'Python' },
  'cmo2qvu9m0007nrxxsfevba4d': { type: 'static', setup: 'Rust' },
};

function generateCanvas2dHTML(setupCode: string, animate: boolean): string {
  const drawCall = animate
    ? `
let animId;
function loop(t) {
  ${setupCode.includes('function draw') ? '' : ''}
  const time = t / 1000;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ${setupCode.includes('function draw') ? 'draw(ctx, canvas.width, canvas.height, time);' : setupCode}
  animId = requestAnimationFrame(loop);
}
animId = requestAnimationFrame(loop);
`
    : `ctx.clearRect(0, 0, canvas.width, canvas.height);\n${setupCode}`;

  // Check if setup defines named functions that need calling
  let initCode = drawCall;
  if (setupCode.includes('function drawPrimeSpiral')) {
    initCode = setupCode + '\ndrawPrimeSpiral(ctx, canvas.width, canvas.height);';
  } else if (setupCode.includes('function drawNeonGrid')) {
    initCode = `let animId;\nfunction loop(t) {\n  ${setupCode}\n  drawNeonGrid(ctx, canvas.width, canvas.height, t/1000);\n  animId = requestAnimationFrame(loop);\n}\nanimId = requestAnimationFrame(loop);`;
  } else if (setupCode.includes('function drawTree')) {
    initCode = `let animId;\nfunction loop() {\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\n  ctx.fillStyle = '#0a0f0a';\n  ctx.fillRect(0, 0, canvas.width, canvas.height);\n  ${setupCode}\n  drawTree(ctx, canvas.width/2, canvas.height*0.85, canvas.height*0.22, -90, 10);\n  animId = requestAnimationFrame(loop);\n}\nanimId = requestAnimationFrame(loop);`;
  }

  return `<!DOCTYPE html><html><head><style>
*{margin:0;padding:0}body{background:#0a0a0f;overflow:hidden}
canvas{display:block;width:100%;height:100%}
</style></head><body>
<canvas id="c"></canvas>
<script>
const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resize(); window.addEventListener('resize', resize);
${initCode}
</script></body></html>`;
}

function generateWebGLHTML(fragShader: string): string {
  return `<!DOCTYPE html><html><head><style>
*{margin:0;padding:0}body{overflow:hidden}
canvas{display:block;width:100%;height:100%}
</style></head><body>
<canvas id="c"></canvas>
<script>
const canvas = document.getElementById('c');
const gl = canvas.getContext('webgl');
function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; gl.viewport(0,0,canvas.width,canvas.height); }
resize(); window.addEventListener('resize', resize);

const vs = 'attribute vec2 a_position; void main(){ gl_Position = vec4(a_position, 0.0, 1.0); }';
const fs = \`${fragShader}\`;

function compile(src, type) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src); gl.compileShader(s); return s;
}
const prog = gl.createProgram();
gl.attachShader(prog, compile(vs, gl.VERTEX_SHADER));
gl.attachShader(prog, compile(fs, gl.FRAGMENT_SHADER));
gl.linkProgram(prog); gl.useProgram(prog);

const buf = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buf);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
const pos = gl.getAttribLocation(prog, 'a_position');
gl.enableVertexAttribArray(pos);
gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

const ut = gl.getUniformLocation(prog, 'u_time');
const ur = gl.getUniformLocation(prog, 'u_resolution');
function loop(t) {
  gl.uniform1f(ut, t/1000);
  gl.uniform2f(ur, canvas.width, canvas.height);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
</script></body></html>`;
}

function generateCSSHTML(cssCode: string): string {
  // Extract any HTML from the last line if it contains tags
  let htmlContent = '';
  const lines = cssCode.trim().split('\n');
  const lastLine = lines[lines.length - 1].trim();
  if (lastLine.includes('<div') || lastLine.includes('<span')) {
    htmlContent = lastLine;
    // Remove from CSS
    cssCode = lines.slice(0, -1).join('\n');
  }
  return `<!DOCTYPE html><html><head><style>${cssCode}</style></head><body>${htmlContent}</body></html>`;
}

function generateStaticHTML(language: string, snippet: { title: string; description: string; code: string; language: string; category: string; author: string }): string {
  const langColors: Record<string, string> = {
    Haskell: '#5e5086', Python: '#3776ab', Rust: '#dea584',
  };
  const color = langColors[language] || '#666';
  const codeLines = snippet.code.split('\n').slice(0, 12).map(line =>
    line.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
  ).join('\n');

  return `<!DOCTYPE html><html><head><style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0c0c14;display:flex;align-items:center;justify-content:center;height:100vh;font-family:'Courier New',monospace;color:#e0e0e0;overflow:hidden}
.card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:28px;max-width:90%;max-height:90%;overflow:hidden}
.badge{display:inline-block;background:${color}22;color:${color};border:1px solid ${color}44;border-radius:20px;padding:4px 14px;font-size:11px;margin-bottom:16px;letter-spacing:0.5px}
.title{font-size:20px;font-weight:700;margin-bottom:6px;color:#fff}
.desc{font-size:12px;color:#888;margin-bottom:16px;line-height:1.5}
.code{background:rgba(0,0,0,0.4);border-radius:8px;padding:14px;font-size:11px;line-height:1.7;overflow:hidden;max-height:200px;color:#aab;border-left:2px solid ${color}66}
</style></head><body>
<div class="card">
  <div class="badge">${snippet.language}</div>
  <div class="title">${snippet.title}</div>
  <div class="desc">${snippet.description}</div>
  <pre class="code">${codeLines}</pre>
</div>
</body></html>`;
}

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
