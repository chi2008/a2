import "./style.css";
const aInput = document.getElementById('a') as HTMLInputElement;
const bInput = document.getElementById('b') as HTMLInputElement;
const cInput = document.getElementById('c') as HTMLInputElement;
const dInput = document.getElementById('d') as HTMLInputElement;
const solveButton = document.getElementById('solveclick') as HTMLButtonElement;
const resultDiv = document.getElementById('result') as HTMLDivElement;
const canvas = document.getElementById('graph') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

function roundTenth(num: number): number {
  return Math.round(num * 10) / 10;
}

// Solve cubic equation using Cardano's formula
function solveCubic(a: number, b: number, c: number, d: number): number[] {
  if (a === 0) return [];

  const f = ((3 * a * c) - (b ** 2)) / (3 * a ** 2);
  const g = ((2 * b ** 3) - (9 * a * b * c) + (27 * a ** 2 * d)) / (27 * a ** 3);
  const h = (g ** 2) / 4 + (f ** 3) / 27;

  const roots: number[] = [];

  if (h > 0) {
    const R = -(g / 2) + Math.sqrt(h);
    const S = Math.cbrt(R);
    const T = -(g / 2) - Math.sqrt(h);
    const U = Math.cbrt(T);
    roots.push(roundTenth(S + U - b/(3*a)));
  } else if (f === 0 && g === 0 && h === 0) {
    const x = -Math.cbrt(d / a);
    roots.push(roundTenth(x), roundTenth(x), roundTenth(x));
  } else {
    const i = Math.sqrt((g ** 2)/4 - h);
    const j = Math.cbrt(i);
    const k = Math.acos(-(g/(2*i)));
    const L = -j;
    const P = -b/(3*a);
    roots.push(
      roundTenth(2*j*Math.cos(k/3) - b/(3*a)),
      roundTenth(L*(Math.cos(k/3) + Math.sqrt(3)*Math.sin(k/3)) + P),
      roundTenth(L*(Math.cos(k/3) - Math.sqrt(3)*Math.sin(k/3)) + P)
    );
  }
  return roots;
}

function q(a: number, b:number, c: number, d: number){
  return roundTenth((27*a**2*d - 9*a*b*c + 2*b**3)/(27*a**3))
}
function p(a: number, b:number, c: number, d: number){
  return roundTenth((3*a*c-b*b)/(3*a**2))
}
function discriminant(a: number, b: number, c: number, d: number): number {
  return roundTenth(18*a*b*c*d - 4*b**3*d + b**2*c**2 - 4*a*c**3 - 27*a**2*d**2);
}
function y(a: number, b: number, c: number, d: number, x: number): number {
  return roundTenth(a*x**3 + b*x**2 + c*x + d);
}

// Draw cubic curve and axes matching CSS grid
function drawCubic(a: number, b: number, c: number, d: number, roots: number[]) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  
  const scaleX = 19; 
  const scaleY = 19;

  // Draw axes in black on top of grid
  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2);
  ctx.lineTo(canvas.width, canvas.height / 2);
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();

  // Draw cubic curve
  ctx.strokeStyle = "red";
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let px = -canvas.width/2; px < canvas.width/2; px += 0.5) {
    const x = px / scaleX;
    const y = a*x**3 + b*x**2 + c*x + d;
    const py = -y * scaleY;
    if (px === -canvas.width/2) ctx.moveTo(canvas.width/2 + px, canvas.height/2 + py);
    else ctx.lineTo(canvas.width/2 + px, canvas.height/2 + py);
  }
  ctx.stroke();

  // Draw roots as blue dots
  ctx.fillStyle = "blue";
  roots.forEach(r => {
    ctx.beginPath();
    ctx.arc(canvas.width/2 + r*scaleX, canvas.height/2, 4, 0, 2*Math.PI);
    ctx.fill();
  });
}

// Handle solve button click
solveButton.addEventListener('click', () => {
  const a = parseFloat(aInput.value);
  const b = parseFloat(bInput.value);
  const c = parseFloat(cInput.value);
  const d = parseFloat(dInput.value);

  if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d)) {
    alert("Please enter all coefficients.");
    return;
  }

  const roots = solveCubic(a, b, c, d);
  const delta = discriminant(a, b, c, d);
  const qv = q(a,b,c,d)
  const pv = p(a,b,c,d)

  // Display equation, discriminant, roots in a box to the right
  resultDiv.innerHTML = `
   <div style="
      display:inline-block;
      text-align:left;
      color:orange;
      border:none;
      padding:12px;
      margin-left:20px;
      vertical-align:top;
    ">
      <div><strong>Equation:</strong> ${a}x³ + ${b}x² + ${c}x + ${d} = 0</div>
      <div><strong>Discriminant:</strong> ${delta}</div>
      <div><strong>Roots:</strong> ${roots.join(', ')}</div>
      <div><strong>q:</strong> ${qv}</div>
      <div><strong>p:</strong> ${pv}</div>
    </div>
  `;
resultDiv.innerHTML = `
  <div style="
      display:inline-block;
      text-align:left;
      color:black;
      border:none;
      padding:12px;
      margin-left:20px;
      vertical-align:top;
    ">
  <div class="result-box">
    <div class="row"><span>p</span><span>${pv}</span></div>
    <div class="row"><span>q</span><span>${qv}</span></div>
    <div class="row"><span>Discriminant</span><span>${delta}</span></div>

    <div class="row header">
      <span>Value</span>
      <span>x</span>
      <span>y</span>
    </div>

    ${roots.map((r, i) => `
      <div class="row">
        <span>${i + 1}</span>
        <span>${r}</span>
        <span>${y(a,b,c,d,r)}</span>
      </div>
    `).join("")}
  </div>
`;
  drawCubic(a, b, c, d, roots);
});