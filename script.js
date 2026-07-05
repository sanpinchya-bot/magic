const coin = document.getElementById("coin");

let x = window.innerWidth / 2;
let y = window.innerHeight / 2;
let targetX = x;
let targetY = y;

let dragging = false;
let gone = false;
let visible = false;

let offsetX = 0;
let offsetY = 0;
let scale = 0.2;
let opacity = 0;

function updateCoin() {
  coin.style.left = x + "px";
  coin.style.top = y + "px";
  coin.style.opacity = opacity;
  coin.style.transform = `translate(-50%, -50%) scale(${scale})`;
}

function appear() {
  visible = true;
  opacity = 1;
  scale = 1;
  updateCoin();
}

function animate() {
  x += (targetX - x) * 0.55;
  y += (targetY - y) * 0.55;
  updateCoin();
  requestAnimationFrame(animate);
}

function getPoint(e) {
  if (e.touches && e.touches.length > 0) {
    return e.touches[0];
  }
  return e;
}

function startDrag(e) {
  if (gone || !visible) return;
  e.preventDefault();

  const p = getPoint(e);
  dragging = true;

  offsetX = p.clientX - targetX;
  offsetY = p.clientY - targetY;
}

function moveDrag(e) {
  if (!dragging || gone) return;
  e.preventDefault();

  const p = getPoint(e);

  targetX = p.clientX - offsetX;
  targetY = p.clientY - offsetY;

  const margin = 100;
  const rect = coin.getBoundingClientRect();

  if (
    rect.right < -margin ||
    rect.left > window.innerWidth + margin ||
    rect.bottom < -margin ||
    rect.top > window.innerHeight + margin
  ) {
    gone = true;
    dragging = false;
    opacity = 0;
    scale = 0.2;
    updateCoin();
  }
}

function endDrag() {
  dragging = false;
}

coin.addEventListener("touchstart", startDrag, { passive: false });
document.addEventListener("touchmove", moveDrag, { passive: false });
document.addEventListener("touchend", endDrag);

coin.addEventListener("mousedown", startDrag);
document.addEventListener("mousemove", moveDrag);
document.addEventListener("mouseup", endDrag);

window.addEventListener("load", () => {
  animate();
  setTimeout(appear, 300);
});
