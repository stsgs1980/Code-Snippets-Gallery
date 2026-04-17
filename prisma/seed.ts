import { db } from '@/lib/db';

const snippets = [
  {
    title: 'Spiral of Primes',
    description: 'A mesmerizing prime number spiral visualization using canvas. Each prime is plotted in polar coordinates, revealing hidden patterns in the distribution of prime numbers.',
    code: `function drawPrimeSpiral(ctx, width, height) {
  const cx = width / 2, cy = height / 2;
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, width, height);

  function isPrime(n) {
    if (n < 2) return false;
    for (let i = 2; i * i <= n; i++)
      if (n % i === 0) return false;
    return true;
  }

  let count = 0;
  for (let n = 2; n < 10000; n++) {
    if (!isPrime(n)) continue;
    const angle = n * 2.399963;
    const r = Math.sqrt(n) * 4;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    const hue = (n * 0.06) % 360;
    ctx.fillStyle = \`hsla(\${hue}, 80%, 60%, 0.8)\`;
    ctx.beginPath();
    ctx.arc(x, y, 1.5, 0, Math.PI * 2);
    ctx.fill();
    count++;
  }
}`,
    language: 'JavaScript',
    category: 'Data Visualization',
    author: 'NumberArtist',
    isFeatured: true,
  },
  {
    title: 'Fractal Tree',
    description: 'A recursive fractal tree that sways with wind-like motion. Branches split at natural angles and diminish in size, creating organic growth patterns.',
    code: `function drawTree(ctx, x, y, len, angle, depth) {
  if (depth === 0 || len < 2) return;
  
  const sway = Math.sin(Date.now() / 1000 + depth * 0.5) * 0.03;
  const rad = (angle + sway) * Math.PI / 180;
  
  const x2 = x + len * Math.cos(rad);
  const y2 = y + len * Math.sin(rad);
  
  const hue = 120 + depth * 8;
  ctx.strokeStyle = \`hsl(\${hue}, 70%, \${30 + depth * 5}%)\`;
  ctx.lineWidth = depth * 0.8;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  
  if (depth < 3) {
    ctx.fillStyle = \`hsla(\${50 + Math.random() * 40}, 90%, 65%, 0.6)\`;
    ctx.beginPath();
    ctx.arc(x2, y2, 3 + Math.random() * 4, 0, Math.PI * 2);
    ctx.fill();
  }
  
  const shrink = 0.68 + Math.random() * 0.08;
  drawTree(ctx, x2, y2, len * shrink, angle - 22, depth - 1);
  drawTree(ctx, x2, y2, len * shrink, angle + 25, depth - 1);
  
  if (depth > 6 && Math.random() > 0.7)
    drawTree(ctx, x2, y2, len * shrink * 0.7, angle + 5, depth - 2);
}`,
    language: 'JavaScript',
    category: 'Generative Art',
    author: 'RecursiveDreamer',
    isFeatured: true,
  },
  {
    title: 'Plasma Shader',
    description: 'A classic GPU-powered plasma effect using sine wave interference. Multiple overlapping sine functions create fluid, organic color patterns that shift over time.',
    code: `precision mediump float;
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
    language: 'GLSL',
    category: 'Shaders',
    author: 'ShaderWitch',
    isFeatured: true,
  },
  {
    title: 'Flow Field',
    description: 'Perlin noise-driven flow field particles. Thousands of particles follow invisible vector field lines, painting smooth organic trails across the canvas.',
    code: `class FlowField {
  constructor(width, height, scale = 20) {
    this.cols = Math.ceil(width / scale);
    this.rows = Math.ceil(height / scale);
    this.field = new Array(this.cols * this.rows);
    this.zoff = 0;
  }

  update() {
    let yoff = 0;
    for (let y = 0; y < this.rows; y++) {
      let xoff = 0;
      for (let x = 0; x < this.cols; x++) {
        const angle = noise3D(xoff, yoff, this.zoff) * Math.PI * 4;
        this.field[y * this.cols + x] = angle;
        xoff += 0.1;
      }
      yoff += 0.1;
    }
    this.zoff += 0.003;
  }

  getAngle(x, y, scale) {
    const col = Math.floor(x / scale);
    const row = Math.floor(y / scale);
    const idx = row * this.cols + col;
    return this.field[idx] || 0;
  }
}`,
    language: 'JavaScript',
    category: 'Generative Art',
    author: 'FlowMaster',
    isFeatured: false,
  },
  {
    title: 'Quicksort Elegance',
    description: 'A beautifully concise implementation of quicksort in Haskell that showcases the power of pattern matching and list comprehensions.',
    code: `quicksort :: (Ord a) => [a] -> [a]
quicksort []     = []
quicksort (x:xs) = 
    let smaller = quicksort [a | a <- xs, a <= x]
        greater = quicksort [a | a <- xs, a > x]
    in  smaller ++ [x] ++ greater

-- Usage:
-- quicksort [3, 6, 1, 8, 4, 9, 2, 7, 5]
-- => [1, 2, 3, 4, 5, 6, 7, 8, 9]

-- The beauty lies in its declarative nature:
-- "Sort everything smaller, put x in the middle,
--  sort everything greater"`,
    language: 'Haskell',
    category: 'Algorithms',
    author: 'LambdaWizard',
    isFeatured: true,
  },
  {
    title: 'Neon Grid',
    description: 'A retro-synthwave infinite grid with perspective projection and neon glow effects. The grid scrolls endlessly into the horizon with pulsing colors.',
    code: `function drawNeonGrid(ctx, w, h, t) {
  ctx.fillStyle = '#0d0221';
  ctx.fillRect(0, 0, w, h);
  
  const horizon = h * 0.45;
  const vanishX = w / 2;
  const gridLines = 30;
  const scroll = (t * 40) % (h - horizon);
  
  // Horizontal lines
  for (let i = 0; i < gridLines; i++) {
    const ratio = (i - scroll / ((h - horizon) / gridLines)) / gridLines;
    if (ratio < 0) continue;
    const y = horizon + ratio * (h - horizon);
    const alpha = Math.min(1, ratio * 2);
    
    ctx.strokeStyle = \`hsla(320, 100%, 60%, \${alpha * 0.6})\`;
    ctx.lineWidth = ratio > 0.5 ? 1.5 : 0.5;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  
  // Vertical lines (converging)
  for (let i = -gridLines; i <= gridLines; i++) {
    const spacing = i * (w / gridLines);
    ctx.strokeStyle = \`hsla(280, 100%, 60%, \${0.3 - Math.abs(i) * 0.008})\`;
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(vanishX, horizon);
    ctx.lineTo(vanishX + spacing, h);
    ctx.stroke();
  }
  
  // Glow sun
  const grad = ctx.createRadialGradient(vanishX, horizon, 0, vanishX, horizon, 120);
  grad.addColorStop(0, 'rgba(255, 100, 200, 0.4)');
  grad.addColorStop(1, 'transparent');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
}`,
    language: 'JavaScript',
    category: 'Creative Coding',
    author: 'SynthWave90',
    isFeatured: true,
  },
  {
    title: 'CSS Galaxy',
    description: 'A pure CSS animated galaxy created with box-shadows and transforms. No JavaScript required — just the raw power of modern CSS.',
    code: `.galaxy {
  width: 1px;
  height: 1px;
  background: transparent;
  box-shadow:
    224px 89px #fff,
    197px 201px #fff,
    112px 148px #fff,
    /* ... thousands of stars ... */
    847px 423px rgba(255,200,100,0.8),
    923px 301px rgba(150,100,255,0.9);
  animation: rotate 100s linear infinite;
}

.galaxy::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 2px;
  height: 2px;
  border-radius: 50%;
  box-shadow:
    0 0 20px 5px rgba(255,255,255,0.5),
    0 0 60px 20px rgba(100,150,255,0.3),
    0 0 100px 40px rgba(200,100,255,0.15);
  transform: translate(-50%, -50%);
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}`,
    language: 'CSS',
    category: 'Creative Coding',
    author: 'PureCSSArtisan',
    isFeatured: false,
  },
  {
    title: 'Mandelbrot Rust',
    description: 'A high-performance Mandelbrot set renderer in Rust. Uses SIMD-friendly iteration counting with smooth coloring for stunning fractal depth.',
    code: `fn mandelbrot(cx: f64, cy: f64, max_iter: u32) -> f64 {
    let mut x = 0.0_f64;
    let mut y = 0.0_f64;
    let mut i = 0;

    while x * x + y * y <= 4.0 && i < max_iter {
        let xtemp = x * x - y * y + cx;
        y = 2.0 * x * y + cy;
        x = xtemp;
        i += 1;
    }

    // Smooth coloring
    if i < max_iter {
        let log_zn = (x * x + y * y).ln() / 2.0;
        let nu = (log_zn / 2_f64.ln()).ln() / 2_f64.ln();
        i as f64 + 1.0 - nu
    } else {
        max_iter as f64
    }
}

fn hsl_to_rgb(h: f64, s: f64, l: f64) -> (u8, u8, u8) {
    let c = (1.0 - (2.0 * l - 1.0).abs()) * s;
    let x = c * (1.0 - ((h / 60.0) % 2.0 - 1.0).abs());
    let m = l - c / 2.0;
    
    let (r, g, b) = match (h / 60.0) as u8 {
        0 => (c, x, 0.0),
        1 => (x, c, 0.0),
        2 => (0.0, c, x),
        3 => (0.0, x, c),
        4 => (x, 0.0, c),
        _ => (c, 0.0, x),
    };
    
    (
        ((r + m) * 255.0) as u8,
        ((g + m) * 255.0) as u8,
        ((b + m) * 255.0) as u8,
    )
}`,
    language: 'Rust',
    category: 'Data Visualization',
    author: 'RustFractal',
    isFeatured: false,
  },
  {
    title: 'Particle Constellation',
    description: 'Interactive particle system where nearby particles connect with luminous lines, forming ever-changing constellations. Mouse proximity creates gravitational pull.',
    code: `class Particle {
  constructor(canvas) {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.8;
    this.vy = (Math.random() - 0.5) * 0.8;
    this.radius = Math.random() * 1.5 + 0.5;
    this.alpha = Math.random() * 0.5 + 0.3;
  }

  update(canvas, mouse) {
    // Gravitational pull toward mouse
    if (mouse.x && mouse.y) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200) {
        const force = (200 - dist) / 200 * 0.02;
        this.vx += (dx / dist) * force;
        this.vy += (dy / dist) * force;
      }
    }

    // Damping
    this.vx *= 0.99;
    this.vy *= 0.99;

    this.x += this.vx;
    this.y += this.vy;

    // Wrap around edges
    if (this.x < 0) this.x = canvas.width;
    if (this.x > canvas.width) this.x = 0;
    if (this.y < 0) this.y = canvas.height;
    if (this.y > canvas.height) this.y = 0;
  }
}`,
    language: 'JavaScript',
    category: 'Interactive',
    author: 'ConstellationCoder',
    isFeatured: true,
  },
  {
    title: 'Wave Function Collapse',
    description: 'An implementation of the Wave Function Collapse algorithm for procedural generation. Generates complex tileable patterns from simple adjacency rules.',
    code: `def wfc(width: int, height: int, tiles: dict) -> list:
    """Wave Function Collapse - procedural generation."""
    grid = [[set(tiles.keys()) for _ in range(width)] 
            for _ in range(height)]
    collapsed = [[False] * width for _ in range(height)]
    
    def entropy(x, y):
        options = len(grid[y][x])
        if options <= 1: return float('inf')
        return options
    
    def propagate(x, y):
        tile = next(iter(grid[y][x]))
        for dx, dy, allowed in tiles[tile]['neighbors']:
            nx, ny = x + dx, y + dy
            if 0 <= nx < width and 0 <= ny < height:
                if not collapsed[ny][nx]:
                    grid[ny][nx] &= set(allowed)
                    if len(grid[ny][nx]) == 0:
                        return False  # Contradiction
        return True
    
    while True:
        # Find cell with lowest entropy
        min_ent = min(
            entropy(x, y) 
            for y in range(height) 
            for x in range(width) 
            if not collapsed[y][x]
        )
        if min_ent == float('inf'):
            break
        
        # Collapse the cell
        cx, cy = min(
            ((x, y) for y in range(height) 
             for x in range(width) 
             if not collapsed[y][x] 
             and entropy(x, y) == min_ent),
            key=lambda p: entropy(*p)
        )
        
        grid[cy][cx] = {random.choice(list(grid[cy][cx]))}
        collapsed[cy][cx] = True
        if not propagate(cx, cy):
            return None  # Failed
    
    return [[next(iter(grid[y][x])) for x in range(width)]
            for y in range(height)]`,
    language: 'Python',
    category: 'Algorithms',
    author: 'ProceduralSage',
    isFeatured: false,
  },
  {
    title: 'Aurora Borealis',
    description: 'A WebGL shader simulating the Northern Lights. Layered noise functions create the flowing, ethereal curtains of light dancing across the night sky.',
    code: `precision highp float;
uniform float u_time;
uniform vec2 u_resolution;

// Simplex noise function
vec3 mod289(vec3 x) { return x - floor(x / 289.0) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x / 289.0) * 289.0; }
vec3 permute(vec3 x) { return mod289((x * 34.0 + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                     -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
       + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                          dot(x12.zw,x12.zw)), 0.0);
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
    language: 'GLSL',
    category: 'Shaders',
    author: 'AuroraShader',
    isFeatured: false,
  },
  {
    title: 'Easing Collection',
    description: 'A comprehensive set of custom CSS easing functions for fluid, natural-feeling animations. Each curve is carefully tuned for specific motion types.',
    code: `/* === CURATED EASING FUNCTIONS === */

/* Spring bounce — playful entrances */
:root {
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  
  /* Smooth decelerate — content reveals */
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  
  /* Gentle acceleration — departures */
  --ease-in-expo: cubic-bezier(0.7, 0, 0.84, 0);
  
  /* Soft overshoot — micro-interactions */
  --ease-overshoot: cubic-bezier(0.22, 1.8, 0.36, 1);
  
  /* Dramatic entrance — hero animations */
  --ease-dramatic: cubic-bezier(0.11, 0, 0.5, 0);
  
  /* Liquid smooth — continuous motion */
  --ease-liquid: cubic-bezier(0.45, 0, 0.15, 1);
}

/* Usage examples */
.card:hover {
  transform: scale(1.05) translateY(-2px);
  transition: all 0.4s var(--ease-spring);
}

.modal-enter {
  animation: slideIn 0.5s var(--ease-out-expo) both;
}

@keyframes slideIn {
  from { 
    opacity: 0; 
    transform: translateY(20px) scale(0.98); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0) scale(1); 
  }
}`,
    language: 'CSS',
    category: 'UI/UX',
    author: 'MotionDesigner',
    isFeatured: false,
  },
];

async function seed() {
  console.log('🌱 Seeding Code Aesthetic Gallery...');
  
  // Clear existing data
  await db.codeSnippet.deleteMany();
  
  // Insert snippets
  for (const snippet of snippets) {
    await db.codeSnippet.create({ data: snippet });
  }
  
  const count = await db.codeSnippet.count();
  console.log(`✅ Seeded ${count} code snippets`);
}

seed()
  .catch(console.error)
  .finally(() => process.exit(0));
