#!/bin/bash

# Life Hub - NAS Setup Script
# Dieses Script erstellt alle notwendigen Verzeichnisse auf dem NAS

echo "🔧 Life Hub - NAS Verzeichnisse erstellen..."

# Hauptverzeichnis
MAIN_DIR="/volume1/docker/Life-Hub-Data"

# Erstelle Hauptverzeichnis falls nicht vorhanden
if [ ! -d "$MAIN_DIR" ]; then
    echo "📁 Erstelle Hauptverzeichnis: $MAIN_DIR"
    mkdir -p "$MAIN_DIR"
else
    echo "✅ Hauptverzeichnis existiert bereits: $MAIN_DIR"
fi

# Erstelle Postgres Datenverzeichnis
POSTGRES_DIR="$MAIN_DIR/postgres"
if [ ! -d "$POSTGRES_DIR" ]; then
    echo "📁 Erstelle Postgres-Verzeichnis: $POSTGRES_DIR"
    mkdir -p "$POSTGRES_DIR"
    chmod 700 "$POSTGRES_DIR"
    echo "✅ Postgres-Verzeichnis erstellt mit Berechtigungen 700"
else
    echo "✅ Postgres-Verzeichnis existiert bereits: $POSTGRES_DIR"
fi

# Setze Besitzer für Postgres (UID 999 ist Standard für postgres in Docker)
echo "🔐 Setze Berechtigungen für Postgres-Verzeichnis..."
chown -R 999:999 "$POSTGRES_DIR" 2>/dev/null || echo "⚠️  Konnte Besitzer nicht ändern (benötigt sudo)"

# Zeige Verzeichnisstruktur
echo ""
echo "📂 Verzeichnisstruktur:"
ls -la "$MAIN_DIR"

echo ""
echo "✅ Setup abgeschlossen!"
echo ""
echo "Nächste Schritte:"
echo "1. Starte Docker Container: cd ~/life-hub && docker-compose up -d"
echo "2. Prüfe Container-Status: docker-compose ps"
echo "3. Prüfe Logs: docker-compose logs -f postgres"
