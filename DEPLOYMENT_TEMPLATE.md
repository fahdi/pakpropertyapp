# PakProperty App Deployment Guide Template

This guide will help you deploy the PakProperty application to your server.

## Prerequisites

Before starting the deployment, ensure you have:

1. **sshpass** installed on your local machine:
   ```bash
   # On Ubuntu/Debian
   sudo apt-get install sshpass
   
   # On macOS
   brew install hudochenkov/sshpass/sshpass
   ```

2. **Domain DNS Configuration**: Ensure that your subdomain points to your server IP.

3. **Server Access**: You need root access to your server with SSH.

## Configuration

Before running the deployment scripts, you need to update the server configuration in the deployment scripts:

1. **Update `deploy.sh`**:
   ```bash
   # Server Configuration
   SERVER_IP="YOUR_SERVER_IP"
   SERVER_USER="YOUR_SERVER_USER"
   SERVER_PASSWORD="YOUR_SERVER_PASSWORD"
   DOMAIN="YOUR_DOMAIN"
   SUBDOMAIN="YOUR_SUBDOMAIN"
   ```

2. **Update `setup-server.sh`**:
   ```bash
   # Server Configuration
   SERVER_IP="YOUR_SERVER_IP"
   SERVER_USER="YOUR_SERVER_USER"
   SERVER_PASSWORD="YOUR_SERVER_PASSWORD"
   ```

3. **Update `check-status.sh`**:
   ```bash
   # Server Configuration
   SERVER_IP="YOUR_SERVER_IP"
   SERVER_USER="YOUR_SERVER_USER"
   SERVER_PASSWORD="YOUR_SERVER_PASSWORD"
   DOMAIN="YOUR_DOMAIN"
   SUBDOMAIN="YOUR_SUBDOMAIN"
   ```

## Deployment Steps

### Step 1: Server Setup (First time only)

Run the server setup script to prepare the server environment:

```bash
chmod +x setup-server.sh
./setup-server.sh
```

This script will:
- Update system packages
- Install Docker and Docker Compose
- Configure Nginx
- Set up firewall rules
- Create monitoring and backup scripts
- Configure SSL certificates

### Step 2: Deploy the Application

Run the deployment script to deploy the application:

```bash
chmod +x deploy.sh
./deploy.sh
```

This script will:
- Copy all application files to the server
- Build and start Docker containers
- Configure SSL certificates
- Set up automatic health checks

## Application Structure

The deployed application consists of:

- **Frontend (React)**: Served on port 3000
- **Backend API (Node.js)**: Served on port 5001
- **MongoDB**: Database on port 27017
- **MongoDB Express**: Admin interface on port 8081

## Access URLs

After successful deployment, you can access:

- **Main Application**: https://YOUR_SUBDOMAIN.YOUR_DOMAIN
- **API Endpoint**: https://YOUR_SUBDOMAIN.YOUR_DOMAIN/api
- **MongoDB Admin**: https://YOUR_SUBDOMAIN.YOUR_DOMAIN/mongo-express
  - Username: `admin`
  - Password: `password123`

## Monitoring and Maintenance

### Health Checks

The application includes automatic health checks that run every 5 minutes. If services go down, they will be automatically restarted.

### Logs

Application logs are stored in:
- `/opt/pakproperty/logs/monitor.log` - Health check logs
- Docker container logs can be viewed with: `docker-compose logs`

### Backups

Daily backups are automatically created at 2 AM and stored in `/opt/pakproperty/backups/`. Only the last 7 backups are kept.

### Manual Commands

To manage the application manually:

```bash
# SSH into the server
ssh YOUR_USER@YOUR_SERVER_IP

# Navigate to app directory
cd /opt/pakproperty

# View running services
docker-compose ps

# View logs
docker-compose logs

# Restart services
docker-compose restart

# Stop services
docker-compose down

# Start services
docker-compose up -d

# Update application
git pull
docker-compose build --no-cache
docker-compose up -d
```

## Troubleshooting

### Common Issues

1. **SSL Certificate Issues**
   ```bash
   # Renew SSL certificate
   certbot renew
   systemctl reload nginx
   ```

2. **Docker Services Not Starting**
   ```bash
   # Check Docker status
   systemctl status docker
   
   # Restart Docker
   systemctl restart docker
   ```

3. **Nginx Issues**
   ```bash
   # Test nginx configuration
   nginx -t
   
   # Restart nginx
   systemctl restart nginx
   ```

4. **Port Conflicts**
   ```bash
   # Check what's using the ports
   netstat -tulpn | grep :3000
   netstat -tulpn | grep :5001
   ```

### Log Locations

- **Application logs**: `/opt/pakproperty/logs/`
- **Nginx logs**: `/var/log/nginx/`
- **System logs**: `journalctl -u pakproperty.service`

## Security Considerations

1. **Change default passwords** for MongoDB and admin accounts
2. **Update environment variables** in production
3. **Regular security updates** for the server
4. **Monitor access logs** for suspicious activity

## Performance Optimization

1. **Enable caching** for static assets
2. **Monitor resource usage** with the monitoring script
3. **Scale containers** if needed based on traffic
4. **Use CDN** for static assets in production

## Support

For deployment issues or questions, check:
1. The logs in `/opt/pakproperty/logs/`
2. Docker container status: `docker-compose ps`
3. Nginx error logs: `/var/log/nginx/error.log`

## Environment Variables

Key environment variables that should be configured in production:

- `NODE_ENV=production`
- `MONGODB_URI=mongodb://admin:password123@mongo:27017/pakproperty?authSource=admin`
- `SESSION_SECRET=your-secure-session-secret`
- `JWT_SECRET=your-secure-jwt-secret`
- `FRONTEND_URL=https://YOUR_SUBDOMAIN.YOUR_DOMAIN`

## Update Process

To update the application:

1. Pull the latest code
2. Run the deployment script again
3. The script will automatically rebuild and restart containers

```bash
git pull
./deploy.sh
```

The deployment is designed to be zero-downtime with automatic health checks and restart capabilities.

## Quick Deploy

For a complete deployment in one command:

```bash
./quick-deploy.sh
```

## Status Check

To check the status of your deployment:

```bash
./check-status.sh
```

## Important Notes

- **Security**: The deployment scripts contain sensitive server information and should not be committed to version control
- **Docker Files**: The Docker configuration files (`docker-compose.yml`, `docker-compose.prod.yml`, `Dockerfile`) are safe to commit
- **Environment**: Always test the deployment in a staging environment first
- **Backups**: Regular backups are automatically created, but verify they work correctly 