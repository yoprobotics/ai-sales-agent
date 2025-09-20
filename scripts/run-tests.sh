#!/bin/bash

# AI Sales Agent - Complete Test Runner
# This script runs all test suites and generates a report

set -e

echo "🧪 AI Sales Agent - Running Complete Test Suite"
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test results
UNIT_RESULT=0
INTEGRATION_RESULT=0
E2E_RESULT=0

# Function to run tests with nice output
run_test_suite() {
  local suite_name=$1
  local command=$2
  
  echo -e "\n${YELLOW}▶ Running ${suite_name}...${NC}"
  echo "----------------------------------------"
  
  if eval "$command"; then
    echo -e "${GREEN}✅ ${suite_name} PASSED${NC}"
    return 0
  else
    echo -e "${RED}❌ ${suite_name} FAILED${NC}"
    return 1
  fi
}

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm ci
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run db:generate

# Unit Tests
run_test_suite "Unit Tests" "npm run test:unit" || UNIT_RESULT=$?

# Integration Tests (requires database)
if [ -n "$DATABASE_URL" ]; then
  # Setup test database
  echo "🗄️  Setting up test database..."
  npm run db:migrate:prod
  
  run_test_suite "Integration Tests" "npm run test:integration" || INTEGRATION_RESULT=$?
else
  echo -e "${YELLOW}⚠️  Skipping Integration Tests (DATABASE_URL not set)${NC}"
fi

# E2E Tests (optional, takes longer)
if [ "$RUN_E2E" = "true" ]; then
  # Install Playwright browsers if not present
  if [ ! -d "$HOME/.cache/ms-playwright" ]; then
    echo "🌐 Installing Playwright browsers..."
    npx playwright install --with-deps
  fi
  
  run_test_suite "E2E Tests" "npm run test:e2e" || E2E_RESULT=$?
else
  echo -e "${YELLOW}ℹ️  E2E Tests skipped (set RUN_E2E=true to run)${NC}"
fi

# Generate coverage report
if [ -f "coverage/lcov.info" ]; then
  echo -e "\n📊 Coverage Report:"
  echo "----------------------------------------"
  npx nyc report --reporter=text-summary
fi

# Summary
echo -e "\n================================================"
echo "📋 TEST RESULTS SUMMARY"
echo "================================================"

if [ $UNIT_RESULT -eq 0 ]; then
  echo -e "${GREEN}✅ Unit Tests: PASSED${NC}"
else
  echo -e "${RED}❌ Unit Tests: FAILED${NC}"
fi

if [ -n "$DATABASE_URL" ]; then
  if [ $INTEGRATION_RESULT -eq 0 ]; then
    echo -e "${GREEN}✅ Integration Tests: PASSED${NC}"
  else
    echo -e "${RED}❌ Integration Tests: FAILED${NC}"
  fi
fi

if [ "$RUN_E2E" = "true" ]; then
  if [ $E2E_RESULT -eq 0 ]; then
    echo -e "${GREEN}✅ E2E Tests: PASSED${NC}"
  else
    echo -e "${RED}❌ E2E Tests: FAILED${NC}"
  fi
fi

# Exit with failure if any tests failed
if [ $UNIT_RESULT -ne 0 ] || [ $INTEGRATION_RESULT -ne 0 ] || [ $E2E_RESULT -ne 0 ]; then
  echo -e "\n${RED}❌ Some tests failed. Please fix the issues and try again.${NC}"
  exit 1
else
  echo -e "\n${GREEN}🎉 All tests passed successfully!${NC}"
  exit 0
fi
