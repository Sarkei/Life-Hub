#!/bin/bash

# Postgres Backup Script für tmpfs-Setup
# Speichert Postgres-Daten auf dem NAS trotz tmpfs

BACKUP_DIR="/volume1/docker/Life-Hub-Data/postgres-backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/lifehub_$TIMESTAMP.sql"
LATEST_LINK="$BACKUP_DIR/latest.sql"

# Erstelle Backup-Verzeichnis
mkdir -p "$BACKUP_DIR"

# Erstelle SQL Dump
echo "📦 Erstelle Postgres Backup..."
docker exec lifehub-db pg_dump -U lifehub lifehub > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Backup erfolgreich: $BACKUP_FILE"
    
    # Erstelle Symlink auf neuestes Backup
    ln -sf "$BACKUP_FILE" "$LATEST_LINK"
    
    # Lösche Backups älter als 7 Tage
    find "$BACKUP_DIR" -name "lifehub_*.sql" -mtime +7 -delete
    echo "🧹 Alte Backups bereinigt (älter als 7 Tage)"
else
    echo "❌ Backup fehlgeschlagen!"
    exit 1
fi
