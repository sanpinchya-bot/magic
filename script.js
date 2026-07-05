const coin = document.getElementById("coin");

let x = 0;
let y = 0;
let targetX = 0;
let targetY = 0;

let dragging = false;
let gone = false;
let offsetX = 0;
let offsetY = 0;

function screenWidth() {
  return window.visualViewport ? window.visualViewport.width : window.innerWidth;
}

function screenHeight() {
  return window.visualViewport ? window.visualViewport.height : window.innerHeight;
}

function coinSize() {
  return coin.getBoundingClientRect().width;
}

function setCoinPosition() {
  const size = coinSize();
  coin.style.transform =
    `translate3d(${x - size / 2}px, ${y - size / 2}px, 0)`;
}

function centerCoin() {
  x = screenWidth() / 2;
  y = screenHeight() / 2;
  targetX = x;
  targetY = y;
  setCoinPosition();
}

function animate() {
  x += (targetX - x) * 0.65;
  y += (targetY - y) * 0.65;
  setCoinPosition();
  requestAnimationFrame(animate);
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

  const size = coinSize();
  const margin = 80;

  if (
    targetX < -size - margin ||
    targetX > screenWidth() + size + margin ||
    targetY < -size - margin ||
    targetY > screenHeight() + size + margin
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

    coin.style.left = "50%";
    coin.style.top = "50%";
    coin.style.transform = "translate(-50%,-50%)";

});
