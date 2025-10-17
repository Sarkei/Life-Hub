#!/bin/bash

# Life Hub Auto-Rebuild Script
# Prüft auf Git-Änderungen und rebuilt Container automatisch

SCRIPT_DIR="/volume1/docker/Life-Hub"
LOG_FILE="/volume1/docker/Life-Hub-Data/rebuild.log"
LAST_COMMIT_FILE="/volume1/docker/Life-Hub-Data/.last_commit"

cd "$SCRIPT_DIR" || exit 1

# Hole aktuellen Commit-Hash
CURRENT_COMMIT=$(git rev-parse HEAD)

# Prüfe ob vorheriger Commit gespeichert ist
if [ ! -f "$LAST_COMMIT_FILE" ]; then
    echo "$CURRENT_COMMIT" > "$LAST_COMMIT_FILE"
    echo "$(date '+%Y-%m-%d %H:%M:%S') - Initial commit saved: $CURRENT_COMMIT" >> "$LOG_FILE"
    exit 0
fi

LAST_COMMIT=$(cat "$LAST_COMMIT_FILE")

# Vergleiche Commits
if [ "$CURRENT_COMMIT" != "$LAST_COMMIT" ]; then
    echo "$(date '+%Y-%m-%d %H:%M:%S') - Changes detected! Rebuilding..." >> "$LOG_FILE"
    echo "$(date '+%Y-%m-%d %H:%M:%S') - Old commit: $LAST_COMMIT" >> "$LOG_FILE"
    echo "$(date '+%Y-%m-%d %H:%M:%S') - New commit: $CURRENT_COMMIT" >> "$LOG_FILE"
    
    # Rebuild und Restart
    docker-compose build --no-cache backend frontend >> "$LOG_FILE" 2>&1
    docker-compose up -d >> "$LOG_FILE" 2>&1
    
    # Speichere neuen Commit
    echo "$CURRENT_COMMIT" > "$LAST_COMMIT_FILE"
    
    echo "$(date '+%Y-%m-%d %H:%M:%S') - Rebuild completed successfully!" >> "$LOG_FILE"
    echo "-----------------------------------" >> "$LOG_FILE"
else
    echo "$(date '+%Y-%m-%d %H:%M:%S') - No changes detected. Commit: $CURRENT_COMMIT" >> "$LOG_FILE"
fi
