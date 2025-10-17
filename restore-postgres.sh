#!/bin/bash

# Postgres Restore Script
# Stellt Datenbank aus Backup wieder her

BACKUP_DIR="/volume1/docker/Life-Hub-Data/postgres-backups"
LATEST_BACKUP="$BACKUP_DIR/latest.sql"

if [ ! -f "$LATEST_BACKUP" ]; then
    echo "❌ Kein Backup gefunden: $LATEST_BACKUP"
    exit 1
fi

echo "📥 Stelle Datenbank wieder her von: $LATEST_BACKUP"
cat "$LATEST_BACKUP" | docker exec -i lifehub-db psql -U lifehub lifehub

if [ $? -eq 0 ]; then
    echo "✅ Wiederherstellung erfolgreich!"
else
    echo "❌ Wiederherstellung fehlgeschlagen!"
    exit 1
fi
