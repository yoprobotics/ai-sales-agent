#!/bin/bash

# AI Sales Agent - Test Validation Script
# Validates that all test infrastructure is properly set up

set -e

echo "🔍 AI Sales Agent - Test Infrastructure Validation"
echo "=================================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Validation results
ERRORS=0
WARNINGS=0

# Function to check if file exists
check_file() {
  local file=$1
  local description=$2
  
  if [ -f "$file" ]; then
    echo -e "${GREEN}✅ $description${NC}"
    return 0
  else
    echo -e "${RED}❌ $description - File not found: $file${NC}"
    ((ERRORS++))
    return 1
  fi
}

# Function to check if directory exists
check_dir() {
  local dir=$1
  local description=$2
  
  if [ -d "$dir" ]; then
    echo -e "${GREEN}✅ $description${NC}"
    return 0
  else
    echo -e "${RED}❌ $description - Directory not found: $dir${NC}"
    ((ERRORS++))
    return 1
  fi
}

# Function to check package.json script
check_script() {
  local script=$1
  local description=$2
  
  if grep -q "\"$script\":" package.json; then
    echo -e "${GREEN}✅ npm script '$script' exists${NC}"
    return 0
  else
    echo -e "${YELLOW}⚠️  npm script '$script' not found${NC}"
    ((WARNINGS++))
    return 1
  fi
}

echo -e "\n📁 Checking test configuration files..."
check_file "jest.config.js" "Root Jest configuration"
check_file "jest.preset.js" "Jest preset configuration"
check_file "test-setup.js" "Global test setup"
check_file ".env.test" "Test environment variables"
check_file "turbo.json" "Turbo configuration with test pipeline"

echo -e "\n📦 Checking package test configurations..."
check_file "packages/core/jest.config.js" "Core package Jest config"
check_file "packages/ingest/jest.config.js" "Ingest package Jest config"
check_file "packages/qualify/jest.config.js" "Qualify package Jest config"
check_file "apps/web/jest.config.js" "Web app Jest config"
check_file "apps/web/jest.setup.js" "Web app Jest setup"
check_file "apps/api/jest.config.js" "API Jest config"
check_file "apps/api/jest.setup.js" "API Jest setup"

echo -e "\n🧪 Checking test directories..."
check_dir "packages/core/src/__tests__" "Core package tests"
check_dir "packages/ingest/src/__tests__" "Ingest package tests"
check_dir "packages/qualify/src/__tests__" "Qualify package tests"
check_dir "apps/api/src/__tests__" "API integration tests"
check_dir "e2e/tests" "E2E test files"
check_dir "e2e/fixtures" "E2E test fixtures"

echo -e "\n🎭 Checking E2E configuration..."
check_file "e2e/playwright.config.ts" "Playwright configuration"
check_file "e2e/global-setup.ts" "E2E global setup"
check_file "e2e/global-teardown.ts" "E2E global teardown"
check_file "e2e/fixtures/prospects.csv" "Test CSV fixture"

echo -e "\n🔄 Checking CI/CD test configuration..."
check_file ".github/workflows/test.yml" "Test workflow"
check_file ".github/workflows/ci.yml" "CI workflow"

echo -e "\n📜 Checking npm scripts..."
check_script "test" "Main test script"
check_script "test:unit" "Unit tests"
check_script "test:integration" "Integration tests"
check_script "test:e2e" "E2E tests"
check_script "test:coverage" "Coverage report"
check_script "test:watch" "Watch mode"

echo -e "\n📚 Checking documentation..."
check_file "TEST_README.md" "Test documentation"

echo -e "\n📊 Checking test coverage..."
# Count test files
UNIT_TESTS=$(find packages -name "*.test.ts" -o -name "*.spec.ts" 2>/dev/null | wc -l)
INTEGRATION_TESTS=$(find apps/api -name "*.test.ts" -o -name "*.spec.ts" 2>/dev/null | wc -l)
E2E_TESTS=$(find e2e -name "*.spec.ts" 2>/dev/null | wc -l)

echo "Unit test files: $UNIT_TESTS"
echo "Integration test files: $INTEGRATION_TESTS"
echo "E2E test files: $E2E_TESTS"

TOTAL_TESTS=$((UNIT_TESTS + INTEGRATION_TESTS + E2E_TESTS))
echo -e "${GREEN}Total test files: $TOTAL_TESTS${NC}"

echo -e "\n🔍 Checking key test implementations..."

# Check for security tests
if grep -r "describe.*Security" apps/api/src/__tests__/ > /dev/null 2>&1; then
  echo -e "${GREEN}✅ Security tests implemented${NC}"
else
  echo -e "${YELLOW}⚠️  Security tests not found${NC}"
  ((WARNINGS++))
fi

# Check for Stripe tests
if grep -r "describe.*Stripe" apps/api/src/__tests__/ > /dev/null 2>&1; then
  echo -e "${GREEN}✅ Stripe integration tests implemented${NC}"
else
  echo -e "${YELLOW}⚠️  Stripe tests not found${NC}"
  ((WARNINGS++))
fi

# Check for SendGrid tests
if grep -r "describe.*SendGrid\|Email Service" apps/api/src/__tests__/ > /dev/null 2>&1; then
  echo -e "${GREEN}✅ SendGrid integration tests implemented${NC}"
else
  echo -e "${YELLOW}⚠️  SendGrid tests not found${NC}"
  ((WARNINGS++))
fi

# Check for auth tests
if grep -r "describe.*Authentication" apps/api/src/__tests__/ > /dev/null 2>&1; then
  echo -e "${GREEN}✅ Authentication tests implemented${NC}"
else
  echo -e "${RED}❌ Authentication tests not found${NC}"
  ((ERRORS++))
fi

# Check for E2E workflow test
if [ -f "e2e/tests/workflow-complete.spec.ts" ]; then
  echo -e "${GREEN}✅ Complete E2E workflow test exists${NC}"
else
  echo -e "${YELLOW}⚠️  Complete E2E workflow test not found${NC}"
  ((WARNINGS++))
fi

echo -e "\n=================================================="
echo "📊 VALIDATION SUMMARY"
echo "=================================================="

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
  echo -e "${GREEN}🎉 Perfect! All test infrastructure is properly configured.${NC}"
  echo -e "${GREEN}Total test files: $TOTAL_TESTS${NC}"
  echo -e "\nYou can now run tests with:"
  echo "  npm test              # Run all tests"
  echo "  npm run test:unit     # Run unit tests"
  echo "  npm run test:e2e      # Run E2E tests"
  echo "  npm run test:coverage # Generate coverage report"
  exit 0
elif [ $ERRORS -eq 0 ]; then
  echo -e "${YELLOW}✅ Test infrastructure is functional with $WARNINGS warnings.${NC}"
  echo -e "${GREEN}Total test files: $TOTAL_TESTS${NC}"
  echo -e "\nConsider addressing the warnings for complete coverage."
  exit 0
else
  echo -e "${RED}❌ Test infrastructure has $ERRORS errors and $WARNINGS warnings.${NC}"
  echo -e "\nPlease fix the errors before running tests."
  exit 1
fi
