const coin = document.getElementById("coin");

let x = window.innerWidth / 2;
let y = window.innerHeight / 2;
let targetX = x;
let targetY = y;

let dragging = false;
let gone = false;
let offsetX = 0;
let offsetY = 0;

function showCoin() {
  coin.style.display = "block";
  coin.style.left = x + "px";
  coin.style.top = y + "px";
}

function render() {
  x += (targetX - x) * 0.45;
  y += (targetY - y) * 0.45;

  coin.style.left = x + "px";
  coin.style.top = y + "px";

  requestAnimationFrame(render);
}

function startDrag(clientX, clientY) {
  if (gone) return;

  dragging = true;
  offsetX = clientX - targetX;
  offsetY = clientY - targetY;
}

function moveDrag(clientX, clientY) {
  if (!dragging || gone) return;

  targetX = clientX - offsetX;
  targetY = clientY - offsetY;

  const rect = coin.getBoundingClientRect();
  const margin = 80;

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

coin.addEventListener("touchstart", e => {
  e.preventDefault();
  const t = e.touches[0];
  startDrag(t.clientX, t.clientY);
}, { passive: false });

document.addEventListener("touchmove", e => {
  e.preventDefault();
  const t = e.touches[0];
  moveDrag(t.clientX, t.clientY);
}, { passive: false });

document.addEventListener("touchend", () => {
  dragging = false;
});

window.addEventListener("load", () => {
  setTimeout(showCoin, 200);
  render();
});
