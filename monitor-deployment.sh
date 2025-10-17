#!/bin/bash

# Life Hub Monitoring Script
# Zeigt Status aller Auto-Deployment Komponenten

echo "========================================="
echo "🔍 Life Hub Auto-Deployment Status"
echo "========================================="
echo ""

# Git Status
echo "📦 Git Repository:"
cd /volume1/docker/Life-Hub
CURRENT_COMMIT=$(git rev-parse --short HEAD)
BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "   Branch: $BRANCH"
echo "   Commit: $CURRENT_COMMIT"
echo "   $(git log -1 --pretty=format:'%h - %s (%ar)')"
echo ""

# Cronjobs
echo "⏰ Aktive Cronjobs:"
crontab -l | grep -v "^#" | grep -v "^$"
echo ""

# Log Files
echo "📄 Log-Dateien:"
if [ -f /volume1/docker/Life-Hub-Data/git-pull.log ]; then
    PULL_SIZE=$(du -h /volume1/docker/Life-Hub-Data/git-pull.log | cut -f1)
    PULL_LINES=$(wc -l < /volume1/docker/Life-Hub-Data/git-pull.log)
    echo "   git-pull.log: $PULL_SIZE ($PULL_LINES Zeilen)"
    echo "   Letzte Aktivität: $(tail -n 1 /volume1/docker/Life-Hub-Data/git-pull.log)"
else
    echo "   ⚠️  git-pull.log nicht gefunden!"
fi

if [ -f /volume1/docker/Life-Hub-Data/rebuild.log ]; then
    REBUILD_SIZE=$(du -h /volume1/docker/Life-Hub-Data/rebuild.log | cut -f1)
    REBUILD_LINES=$(wc -l < /volume1/docker/Life-Hub-Data/rebuild.log)
    echo "   rebuild.log: $REBUILD_SIZE ($REBUILD_LINES Zeilen)"
    echo "   Letzte Aktivität: $(tail -n 1 /volume1/docker/Life-Hub-Data/rebuild.log)"
else
    echo "   ⚠️  rebuild.log nicht gefunden!"
fi
echo ""

# Docker Container
echo "🐳 Docker Container:"
docker-compose -f /volume1/docker/Life-Hub/docker-compose.yml ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
echo ""

# Letzte Rebuild-Info
if [ -f /volume1/docker/Life-Hub-Data/.last_commit ]; then
    LAST_REBUILD_COMMIT=$(cat /volume1/docker/Life-Hub-Data/.last_commit)
    echo "🔄 Letzter Rebuild:"
    echo "   Commit: $LAST_REBUILD_COMMIT"
    if [ "$CURRENT_COMMIT" = "$LAST_REBUILD_COMMIT" ]; then
        echo "   ✅ Up-to-date!"
    else
        echo "   ⚠️  Rebuild ausstehend (nächster Check in max. 5 Min)"
    fi
else
    echo "⚠️  Noch kein Rebuild durchgeführt"
fi
echo ""

echo "========================================="
echo "💡 Nützliche Befehle:"
echo "   tail -f /volume1/docker/Life-Hub-Data/git-pull.log"
echo "   tail -f /volume1/docker/Life-Hub-Data/rebuild.log"
echo "   /volume1/docker/Life-Hub/auto-rebuild.sh (manuell)"
echo "========================================="
