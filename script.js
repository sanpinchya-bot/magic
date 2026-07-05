const coin = document.getElementById("coin");

let coinSize = 0;
let targetX = 0;
let targetY = 0;
let x = 0;
let y = 0;

let dragging = false;
let offsetX = 0;
let offsetY = 0;
let gone = false;

function init() {
    coin.style.display = "block";

    coinSize = coin.getBoundingClientRect().width;

    targetX = window.innerWidth / 2 - coinSize / 2;
    targetY = window.innerHeight / 2 - coinSize / 2;

    x = targetX;
    y = targetY;

    coin.style.left = x + "px";
    coin.style.top = y + "px";
    coin.classList.add("pop");

    requestAnimationFrame(render);
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

    const margin = 80;

    if (
        targetX < -coinSize - margin ||
        targetX > window.innerWidth + margin ||
        targetY < -coinSize - margin ||
        targetY > window.innerHeight + margin
    ) {
        gone = true;
        dragging = false;
        coin.classList.add("vanish");

        setTimeout(() => {
            coin.style.display = "none";
        }, 250);
    }
}

coin.addEventListener("touchstart", (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    startDrag(touch.clientX, touch.clientY);
}, { passive: false });

document.addEventListener("touchmove", (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    moveDrag(touch.clientX, touch.clientY);
}, { passive: false });

document.addEventListener("touchend", () => {
    dragging = false;
});

coin.addEventListener("mousedown", (e) => {
    startDrag(e.clientX, e.clientY);
});

document.addEventListener("mousemove", (e) => {
    moveDrag(e.clientX, e.clientY);
});

document.addEventListener("mouseup", () => {
    dragging = false;
});

window.addEventListener("load", () => {
    setTimeout(init, 200);
});
