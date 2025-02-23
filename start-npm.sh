#!/bin/bash

# NVM initialisieren
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # NVM laden

# Node Version auswählen
nvm use 20.18.3  # Stelle sicher, dass du die richtige Version verwendest

# NPM starten
cd /Users/macstudiofv/fitness8103ch  # Wechsel in das Verzeichnis deiner App
npm run dev  # Starte die App


