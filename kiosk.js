/* TizenBrew injects this into every execution context of the page after each load.
   Written as ES5: the 2019 Tizen 5.0 engine is an old Chromium. */
(function () {
  // Also injected into iframes; only the top window manages reloads.
  if (window.top !== window || window.__tvKiosk) return;
  window.__tvKiosk = true;

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
  // Checked after a delay: at injection time the document can still be empty.
  setTimeout(function () {
    if (!document.body || document.body.children.length === 0) reload();
  }, OFFLINE_RETRY_MS);
})();
