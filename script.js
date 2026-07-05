const coin = document.getElementById("coin");

let targetX = window.innerWidth / 2 - coin.offsetWidth / 2;
let targetY = window.innerHeight / 2 - coin.offsetHeight / 2;
let x = targetX;
let y = targetY;

let dragging = false;
let offsetX = 0;
let offsetY = 0;
let gone = false;

function showCoin() {
  coin.style.display = "block";
  coin.style.left = targetX + "px";
  coin.style.top = targetY + "px";
  coin.classList.add("pop");
}

setTimeout(showCoin, 200);

function render() {
  x += (targetX - x) * 0.38;
  y += (targetY - y) * 0.38;

  coin.style.left = x + "px";
  coin.style.top = y + "px";

  requestAnimationFrame(render);
}

render();

coin.addEventListener("touchstart", (e) => {
  if (gone) return;

  dragging = true;
  const touch = e.touches[0];

  offsetX = touch.clientX - targetX;
  offsetY = touch.clientY - targetY;
}, { passive: false });

document.addEventListener("touchmove", (e) => {
  if (!dragging || gone) return;

  e.preventDefault();

  const touch = e.touches[0];

  targetX = touch.clientX - offsetX;
  targetY = touch.clientY - offsetY;

  const margin = 80;

  if (
    targetX < -coin.offsetWidth - margin ||
    targetX > window.innerWidth + margin ||
    targetY < -coin.offsetHeight - margin ||
    targetY > window.innerHeight + margin
  ) {
    gone = true;
    dragging = false;
    coin.classList.add("vanish");

    setTimeout(() => {
      coin.style.display = "none";
    }, 250);
  }
}, { passive: false });

document.addEventListener("touchend", () => {
  dragging = false;
});
