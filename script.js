const coin = document.getElementById("coin");

let targetX = window.innerWidth / 2 - coin.offsetWidth / 2;
let targetY = window.innerHeight / 2 - coin.offsetHeight / 2;
let x = targetX;
let y = targetY;

let dragging = false;
let offsetX = 0;
let offsetY = 0;
let gone = false;

// 反応エリア：赤枠イメージ
function getActiveArea() {
  return {
    left: window.innerWidth * 0.18,
    right: window.innerWidth * 0.86,
    top: window.innerHeight * 0.12,
    bottom: window.innerHeight * 0.78
  };
}

function isInsideActiveArea(touch) {
  const area = getActiveArea();
  return (
    touch.clientX >= area.left &&
    touch.clientX <= area.right &&
    touch.clientY >= area.top &&
    touch.clientY <= area.bottom
  );
}

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

  const touch = e.touches[0];

  // 赤枠エリア外では反応しない
  if (!isInsideActiveArea(touch)) return;

  dragging = true;

  offsetX = touch.clientX - targetX;
  offsetY = touch.clientY - targetY;
}, { passive: false });

document.addEventListener("touchmove", (e) => {
  if (!dragging || gone) return;

  const touch = e.touches[0];

  // 画面下など、赤枠エリア外では動かさない
  if (!isInsideActiveArea(touch)) return;

  e.preventDefault();

  targetX = touch.clientX - offsetX;
  targetY = touch.clientY - offsetY;

  const margin = 80;

  // 画面外へ出したら消える
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
