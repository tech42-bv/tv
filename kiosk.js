/* TizenBrew injects this into every execution context of the page after it loads.
   Written as ES5: the 2019 Tizen 5.0 engine is Chromium 63. Polyfills the page needs live in the
   page itself (pixelkantoor), because this script arrives after the page's own scripts. */
(function () {
  // Kiosk behavior: only the top window manages reloads.
  if (window.top !== window || window.__tvKiosk) return;
  window.__tvKiosk = true;

  // Diagnostics overlay: the TV has no devtools, so errors and page state are shown on screen.
  // shortcut: always on while we get the page running; remove once the TV shows the page reliably.
  var lines = ["kiosk.js geladen", navigator.userAgent];
  function show(text) {
    lines.push(text);
    var box = document.getElementById("tv-kiosk-diag");
    if (!box && document.body) {
      box = document.createElement("pre");
      box.id = "tv-kiosk-diag";
      box.style.cssText = "position:fixed;left:0;right:0;bottom:0;z-index:2147483647;margin:0;padding:8px;max-height:45vh;overflow:hidden;background:rgba(0,0,0,.85);color:#ff0;font:16px monospace;white-space:pre-wrap";
      document.body.appendChild(box);
    }
    if (box) box.textContent = lines.slice(-25).join("\n");
  }
  window.addEventListener("error", function (e) {
    show("ERROR: " + e.message + " @ " + (e.filename || "").split("/").pop() + ":" + e.lineno + ":" + e.colno);
  }, true);
  window.addEventListener("unhandledrejection", function (e) {
    show("REJECTION: " + (e.reason && (e.reason.stack || e.reason.message) || e.reason));
  });
  setTimeout(function () {
    var app = document.getElementById("app");
    show("na 10s: #app kinderen=" + (app ? app.children.length : "geen #app") +
      " grootte=" + (app ? app.offsetWidth + "x" + app.offsetHeight : "-") +
      " scripts=" + document.scripts.length + " body=" + (document.body ? document.body.offsetWidth + "x" + document.body.offsetHeight : "-"));
  }, 10000);

  var RELOAD_EVERY_MS = 60 * 60 * 1000; // full reload against slow memory leaks in the TV browser
  var OFFLINE_RETRY_MS = 30 * 1000;

  function reload() {
    location.reload();
  }

  setTimeout(function tick() {
    // Reloading while offline would leave an error page that never recovers.
    if (navigator.onLine) reload();
    else setTimeout(tick, OFFLINE_RETRY_MS);
  }, RELOAD_EVERY_MS);

  window.addEventListener("online", reload);

  // If the page itself failed to load (e.g. TV booted before the network), keep retrying.
  // Checked after a delay: at injection time the document is still empty.
  setTimeout(function () {
    if (!document.body || document.body.children.length === 0) reload();
  }, OFFLINE_RETRY_MS);
})();
