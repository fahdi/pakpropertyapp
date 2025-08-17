#!/bin/bash

BACKUP_DIR="/opt/pakproperty/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="pakproperty_backup_$DATE.tar.gz"

mkdir -p "$BACKUP_DIR"

# Stop services
cd /opt/pakproperty
docker-compose down

# Create backup
tar -czf "$BACKUP_DIR/$BACKUP_FILE"     --exclude=node_modules     --exclude=.git     --exclude=backups     --exclude=logs     .

# Start services
docker-compose up -d

# Keep only last 7 backups
cd "$BACKUP_DIR"
ls -t | tail -n +8 | xargs -r rm

echo "Backup created: $BACKUP_FILE"
