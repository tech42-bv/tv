# Kantoor-TV via TizenBrew

TizenBrew-module die één webpagina fullscreen toont op de Samsung UE50RU7100 (Tizen 5.0, 2019), zonder adresbalk of cursor. `kiosk.js` herlaadt elk uur, na netwerkherstel en als de pagina leeg bleef.

Waarom TizenBrew en geen eigen .wgt: TizenBrew installeer je één keer; de module (deze repo) haalt hij via jsDelivr van GitHub. Pagina-URL wijzigen = `package.json` pushen, niets opnieuw signen. Op Tizen < 7 is er geen Samsung-certificaat nodig.

## Installatie (eenmalig, ~20 min)

1. Tv: **Apps** openen, `12345` intoetsen, **Developer mode** op **On**, **Host PC IP** = IP van de Mac, tv herstarten.
2. Mac: `TizenBrewInstaller-macos-arm64` downloaden van https://github.com/reisxd/TizenBrewInstaller/releases/latest, `chmod +x` en starten. Kies **Install TizenBrew**.
3. Tv: **Apps** > `12345` > **Host PC IP** = `127.0.0.1`, tv herstarten (aan/uit ingedrukt tot het Samsung-logo). TizenBrew debugt de tv zelf via SDB; met het IP van de Mac geeft hij "kon niet verbinden met SDB Daemon". Voor herinstallatie tijdelijk terug naar het IP van de Mac.
4. Tv: open **TizenBrew**, voeg module toe: `gh/tech42-bv/tv-kiosk-tizenbrew`.
5. TizenBrew **Settings > Autolaunch**: kies **Kantoor-TV**.
6. Tv **Settings > General > Smart Features > Autorun Last App** aan; **Eco Solution > Auto Power Off** uit.
7. Home Assistant: `home-assistant-automation.yaml` als automation toevoegen (start TizenBrew als de tv aangaat).

## Pagina-URL wijzigen

`websiteURL` in `package.json` aanpassen en pushen. jsDelivr cachet `gh/`-bestanden tot 12 uur; direct verversen: https://purge.jsdelivr.net/gh/tech42-bv/tv-kiosk-tizenbrew/package.json openen, daarna TizenBrew herstarten.

## Grenzen

- De repo moet publiek zijn (jsDelivr), dus de URL is openbaar.
- Een firmware-update of Developer mode uit kan TizenBrew verwijderen: dan stap 2 opnieuw.
- Pagina moet werken op een oude Chromium: geen moderne JS/CSS zonder transpileren.
