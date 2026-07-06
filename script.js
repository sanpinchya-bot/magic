(() => {
  "use strict";

  const coin = document.getElementById("coin");
  const coinSound = document.getElementById("coinSound");

  const state = {
    x: 0,
    y: 0,
    dragging: false,
    offsetX: 0,
    offsetY: 0,
    hidden: true,
    started: false,
  };

  function preventDefault(event) {
    if (event.cancelable) {
      event.preventDefault();
    }
  }

  function getViewportSize() {
    return {
      width: window.innerWidth || document.documentElement.clientWidth,
      height: window.innerHeight || document.documentElement.clientHeight,
    };
  }

  function getCoinSize() {
    const rect = coin.getBoundingClientRect();

    return {
      width: rect.width || 90,
      height: rect.height || 90,
    };
  }

  function setCoinPosition(x, y) {
    state.x = x;
    state.y = y;

    coin.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
  }

  function centerCoin() {
    if (state.dragging) return;

    const viewport = getViewportSize();
    const size = getCoinSize();

    const x = (viewport.width - size.width) / 2;
    const y = (viewport.height - size.height) / 2;

    setCoinPosition(x, y);
  }

  function playCoinSound() {
    if (!coinSound) return;

    try {
      coinSound.pause();
      coinSound.currentTime = 0;
      coinSound.volume = 1;
    } catch (error) {
      return;
    }

    const playPromise = coinSound.play();

    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        // iPhone Safariなどでブロックされた場合は何もしない
      });
    }
  }

  function showCoin() {
    state.hidden = false;

    coin.classList.remove("is-hidden");
    coin.classList.add("is-visible");

    playCoinSound();
  }

  function hideCoin() {
    state.hidden = true;
    state.dragging = false;

    coin.classList.remove("is-visible");
    coin.classList.remove("is-dragging");
    coin.classList.add("is-hidden");
  }

  function startApp() {
    if (state.started) return;

    state.started = true;

    centerCoin();
    showCoin();
  }

  function isCoinOutsideScreen() {
    const viewport = getViewportSize();
    const size = getCoinSize();

    const margin = Math.min(size.width, size.height) * 0.35;

    return (
      state.x + size.width < -margin ||
      state.y + size.height < -margin ||
      state.x > viewport.width + margin ||
      state.y > viewport.height + margin
    );
  }

  function startDrag(clientX, clientY) {
    if (!state.started) {
      startApp();
      return;
    }

    if (state.hidden) return;

    const rect = coin.getBoundingClientRect();

    state.dragging = true;
    state.offsetX = clientX - rect.left;
    state.offsetY = clientY - rect.top;

    coin.classList.add("is-dragging");
  }

  function moveDrag(clientX, clientY) {
    if (!state.dragging) return;

    const x = clientX - state.offsetX;
    const y = clientY - state.offsetY;

    setCoinPosition(x, y);

    if (isCoinOutsideScreen()) {
      hideCoin();
    }
  }

  function endDrag() {
    if (!state.dragging) return;

    state.dragging = false;
    coin.classList.remove("is-dragging");

    if (isCoinOutsideScreen()) {
      hideCoin();
    }
  }

  function getTouchPoint(event) {
    const touch = event.touches[0] || event.changedTouches[0];

    return {
      x: touch.clientX,
      y: touch.clientY,
    };
  }

  /*
   * iPhone Safari 対策：
   * 最初の画面タップでコイン登場＋音再生。
   */
  window.addEventListener(
    "touchstart",
    (event) => {
      preventDefault(event);

      const point = getTouchPoint(event);
      startDrag(point.x, point.y);
    },
    { passive: false }
  );

  window.addEventListener(
    "touchmove",
    (event) => {
      preventDefault(event);

      if (!state.dragging) return;

      const point = getTouchPoint(event);
      moveDrag(point.x, point.y);
    },
    { passive: false }
  );

  window.addEventListener(
    "touchend",
    (event) => {
      preventDefault(event);
      endDrag();
    },
    { passive: false }
  );

  window.addEventListener(
    "touchcancel",
    (event) => {
      preventDefault(event);
      endDrag();
    },
    { passive: false }
  );

  /*
   * PCブラウザ用マウス操作
   */
  window.addEventListener("mousedown", (event) => {
    preventDefault(event);
    startDrag(event.clientX, event.clientY);
  });

  window.addEventListener("mousemove", (event) => {
    if (!state.dragging) return;

    preventDefault(event);
    moveDrag(event.clientX, event.clientY);
  });

  window.addEventListener("mouseup", (event) => {
    preventDefault(event);
    endDrag();
  });

  /*
   * ページ全体のスクロール・長押しメニュー対策
   */
  document.addEventListener("touchmove", preventDefault, { passive: false });

  window.addEventListener("contextmenu", (event) => {
    preventDefault(event);
  });

  /*
   * 初期表示：
   * コイン画像の読み込み後、中央位置に準備して非表示にする。
   */
  function initialize() {
    centerCoin();
    hideCoin();
  }

  if (coin.complete) {
    initialize();
  } else {
    coin.addEventListener("load", initialize, { once: true });
  }

  /*
   * 画面回転・アドレスバー変化対策
   */
  let resizeTimer = null;

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {
      centerCoin();
    }, 200);
  });

  window.addEventListener("orientationchange", () => {
    setTimeout(() => {
      centerCoin();
    }, 400);
  });
})();
