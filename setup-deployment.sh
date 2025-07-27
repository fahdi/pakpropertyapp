#!/bin/bash

# Setup Deployment Script for PakProperty App
# This script helps you set up the deployment files from templates

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  PakProperty Deployment Setup${NC}"
    echo -e "${BLUE}================================${NC}"
}

print_header

print_status "Setting up deployment files from templates..."

# Check if template files exist
TEMPLATE_FILES=("deploy.sh.template" "setup-server.sh.template" "quick-deploy.sh.template" "check-status.sh.template")

for template in "${TEMPLATE_FILES[@]}"; do
    if [ ! -f "$template" ]; then
        print_error "Template file $template not found!"
        exit 1
    fi
done

print_status "All template files found. Proceeding..."

# Copy template files
print_status "Copying template files..."

cp deploy.sh.template deploy.sh
cp setup-server.sh.template setup-server.sh
cp quick-deploy.sh.template quick-deploy.sh
cp check-status.sh.template check-status.sh

# Make them executable
chmod +x deploy.sh setup-server.sh quick-deploy.sh check-status.sh

print_status "✅ Template files copied successfully!"

print_warning "⚠️  IMPORTANT: You need to configure the server details in the copied files:"
echo ""
echo "  📝 Edit the following files and update the server configuration:"
echo "     - deploy.sh"
echo "     - setup-server.sh"
echo "     - check-status.sh"
echo ""
echo "  🔧 Update these variables in each file:"
echo "     - SERVER_IP=\"YOUR_SERVER_IP\""
echo "     - SERVER_USER=\"YOUR_SERVER_USER\""
echo "     - SERVER_PASSWORD=\"YOUR_SERVER_PASSWORD\""
echo "     - DOMAIN=\"YOUR_DOMAIN\""
echo "     - SUBDOMAIN=\"YOUR_SUBDOMAIN\""
echo ""

print_status "📚 For detailed instructions, see DEPLOYMENT_TEMPLATE.md"
print_status ""

print_status "🚀 Once configured, you can run:"
echo "     ./quick-deploy.sh    # Complete deployment"
echo "     ./check-status.sh    # Check deployment status"
echo ""

print_status "✅ Setup completed! Configure your server details and deploy."
print_header 