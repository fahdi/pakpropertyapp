#!/bin/bash

echo "🧪 Running PakProperty Test Suite"
echo "=================================="

# Function to run backend tests
run_backend_tests() {
    echo "📦 Running Backend Tests..."
    cd server
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        echo "Installing backend dependencies..."
        npm install
    fi
    
    # Run tests
    npm test
    
    cd ..
}

# Function to run frontend tests
run_frontend_tests() {
    echo "🎨 Running Frontend Tests..."
    cd client
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        echo "Installing frontend dependencies..."
        npm install
    fi
    
    # Run tests
    npm test -- --coverage --watchAll=false
    
    cd ..
}

# Function to run all tests
run_all_tests() {
    echo "🚀 Running All Tests..."
    
    # Run backend tests
    run_backend_tests
    
    # Run frontend tests
    run_frontend_tests
    
    echo "✅ All tests completed!"
}

# Check command line arguments
case "$1" in
    "backend"|"server")
        run_backend_tests
        ;;
    "frontend"|"client")
        run_frontend_tests
        ;;
    "all"|"")
        run_all_tests
        ;;
    *)
        echo "Usage: $0 [backend|frontend|all]"
        echo "  backend  - Run only backend tests"
        echo "  frontend - Run only frontend tests"
        echo "  all      - Run all tests (default)"
        exit 1
        ;;
esac 