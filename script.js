const coin = document.getElementById("coin");

let x = window.innerWidth / 2;
let y = window.innerHeight / 2;
let targetX = x;
let targetY = y;

let dragging = false;
let gone = false;
let offsetX = 0;
let offsetY = 0;
let scale = 1;
let opacity = 1;

function updateCoin() {
  coin.style.left = x + "px";
  coin.style.top = y + "px";
  coin.style.opacity = opacity;
  coin.style.transform = `translate(-50%, -50%) scale(${scale})`;
}

function animate() {
  x += (targetX - x) * 0.6;
  y += (targetY - y) * 0.6;
  updateCoin();
  requestAnimationFrame(animate);
}

function startDrag(e) {
  if (gone) return;
  e.preventDefault();

  const p = e.touches ? e.touches[0] : e;
  dragging = true;

  offsetX = p.clientX - targetX;
  offsetY = p.clientY - targetY;
}

function moveDrag(e) {
  if (!dragging || gone) return;
  e.preventDefault();

  const p = e.touches ? e.touches[0] : e;

  targetX = p.clientX - offsetX;
  targetY = p.clientY - offsetY;

  const rect = coin.getBoundingClientRect();
  const margin = 120;

  if (
    rect.right < -margin ||
    rect.left > window.innerWidth + margin ||
    rect.bottom < -margin ||
    rect.top > window.innerHeight + margin
  ) {
    gone = true;
    dragging = false;
    coin.style.display = "none";
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
  coin.style.display = "block";
  updateCoin();
  animate();
});
