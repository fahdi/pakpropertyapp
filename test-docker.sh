#!/bin/bash

echo "🧪 Running PakProperty Tests in Docker"
echo "======================================"

# Function to run backend tests in Docker
run_backend_tests_docker() {
    echo "📦 Running Backend Tests in Docker..."
    
    # Build and run backend tests
    docker-compose -f docker-compose.test.yml up --build test-server --abort-on-container-exit
    
    # Get exit code
    BACKEND_EXIT_CODE=$?
    
    if [ $BACKEND_EXIT_CODE -eq 0 ]; then
        echo "✅ Backend tests passed!"
    else
        echo "❌ Backend tests failed!"
    fi
    
    return $BACKEND_EXIT_CODE
}

# Function to run frontend tests in Docker
run_frontend_tests_docker() {
    echo "🎨 Running Frontend Tests in Docker..."
    
    # Build and run frontend tests
    docker-compose -f docker-compose.test.yml up --build test-client --abort-on-container-exit
    
    # Get exit code
    FRONTEND_EXIT_CODE=$?
    
    if [ $FRONTEND_EXIT_CODE -eq 0 ]; then
        echo "✅ Frontend tests passed!"
    else
        echo "❌ Frontend tests failed!"
    fi
    
    return $FRONTEND_EXIT_CODE
}

# Function to run all tests in Docker
run_all_tests_docker() {
    echo "🚀 Running All Tests in Docker..."
    
    # Start test database
    docker-compose -f docker-compose.test.yml up -d test-mongo
    
    # Run backend tests
    run_backend_tests_docker
    BACKEND_RESULT=$?
    
    # Run frontend tests
    run_frontend_tests_docker
    FRONTEND_RESULT=$?
    
    # Clean up
    docker-compose -f docker-compose.test.yml down
    
    # Report results
    if [ $BACKEND_RESULT -eq 0 ] && [ $FRONTEND_RESULT -eq 0 ]; then
        echo "🎉 All tests passed!"
        exit 0
    else
        echo "💥 Some tests failed!"
        exit 1
    fi
}

# Check command line arguments
case "$1" in
    "backend"|"server")
        run_backend_tests_docker
        ;;
    "frontend"|"client")
        run_frontend_tests_docker
        ;;
    "all"|"")
        run_all_tests_docker
        ;;
    *)
        echo "Usage: $0 [backend|frontend|all]"
        echo "  backend  - Run only backend tests in Docker"
        echo "  frontend - Run only frontend tests in Docker"
        echo "  all      - Run all tests in Docker (default)"
        exit 1
        ;;
esac 