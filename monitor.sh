#!/bin/bash

LOG_FILE="/opt/pakproperty/logs/monitor.log"
APP_DIR="/opt/pakproperty"

# Log function
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
}

# Check if services are running
check_services() {
    cd "$APP_DIR"
    
    if ! docker-compose ps | grep -q "Up"; then
        log "Services are down, restarting..."
        docker-compose down
        docker-compose up -d
        log "Services restarted"
    else
        log "All services are running"
    fi
}

# Check disk space
check_disk() {
    DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
    if [ "$DISK_USAGE" -gt 80 ]; then
        log "Warning: Disk usage is $DISK_USAGE%"
    fi
}

# Check memory usage
check_memory() {
    MEMORY_USAGE=$(free | awk 'NR==2{printf "%.2f", $3*100/$2}')
    if (( $(echo "$MEMORY_USAGE > 80" | bc -l) )); then
        log "Warning: Memory usage is $MEMORY_USAGE%"
    fi
}

# Main execution
log "Starting health check"
check_services
check_disk
check_memory
log "Health check completed"
