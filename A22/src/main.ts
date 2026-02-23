import './style.css'
// src/main.ts
const aInput = document.getElementById("a") as HTMLInputElement;
const bInput = document.getElementById("b") as HTMLInputElement;
const cInput = document.getElementById("c") as HTMLInputElement;
const dInput = document.getElementById("d") as HTMLInputElement;
const solveButton = document.getElementById("solveclick") as HTMLButtonElement;
const resultDiv = document.getElementById("result") as HTMLDivElement;
const canvas = document.getElementById("graph") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

// Solve cubic using Cardano's formula
function solveCubic(a: number, b: number, c: number, d: number): number[] {
  if (a === 0) return []; // Not cubic
  // Normalize
  const p = (3 * a * c - b * b) / (3 * a * a);
  const q = (2 * b * b * b - 9 * a * b * c + 27 * a * a * d) / (27 * a * a * a);
  const discriminant = (q * q) / 4 + (p * p * p) / 27;

  const roots: number[] = [];

  if (discriminant > 0) {
    // One real root
    const u = Math.cbrt(-q / 2 + Math.sqrt(discriminant));
    const v = Math.cbrt(-q / 2 - Math.sqrt(discriminant));
    roots.push(u + v - b / (3 * a));
  } else if (discriminant === 0) {
    const u = Math.cbrt(-q / 2);
    roots.push(2 * u - b / (3 * a));
    roots.push(-u - b / (3 * a));
  } else {
    // Three real roots
    const r = Math.sqrt(-p * p * p / 27);
    const phi = Math.acos(-q / (2 * r));
    const t = 2 * Math.cbrt(r);
    roots.push(t * Math.cos(phi / 3) - b / (3 * a));
    roots.push(t * Math.cos((phi + 2 * Math.PI) / 3) - b / (3 * a));
    roots.push(t * Math.cos((phi + 4 * Math.PI) / 3) - b / (3 * a));
  }

  return roots;
}

// Draw cubic graph
function drawCubic(a: number, b: number, c: number, d: number) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw axes
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2);
  ctx.lineTo(canvas.width, canvas.height / 2);
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();

  // Plot cubic
  ctx.strokeStyle = "red";
  ctx.lineWidth = 2;
  ctx.beginPath();
  const scaleX = 20; // pixels per x unit
  const scaleY = 20; // pixels per y unit
  for (let px = 0; px <= canvas.width; px++) {
    const x = (px - canvas.width / 2) / scaleX;
    const y = a * x ** 3 + b * x ** 2 + c * x + d;
    const py = canvas.height / 2 - y * scaleY;
    if (px === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();
}

// Handle button click
solveButton.addEventListener("click", () => {
  const a = parseFloat(aInput.value);
  const b = parseFloat(bInput.value);
  const c = parseFloat(cInput.value);
  const d = parseFloat(dInput.value);

  if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d)) {
    resultDiv.textContent = "Please enter all coefficients.";
    return;
  }

  const roots = solveCubic(a, b, c, d);
  resultDiv.textContent = `Roots: ${roots.map(r => r.toFixed(4)).join(", ")}`;
  drawCubic(a, b, c, d);
});