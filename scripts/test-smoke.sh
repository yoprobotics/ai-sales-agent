#!/bin/bash

# AI Sales Agent - Smoke Test Script
# Quick validation that all test suites are working

set -e

echo "🔥 Running Smoke Tests for AI Sales Agent"
echo "========================================="

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Test results
RESULTS=()

# Function to run a test command
run_test() {
  local name=$1
  local command=$2
  
  echo -e "\n🧪 Testing: ${name}"
  
  if eval "$command" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ ${name} PASSED${NC}"
    RESULTS+=("✅ ${name}")
    return 0
  else
    echo -e "${RED}❌ ${name} FAILED${NC}"
    RESULTS+=("❌ ${name}")
    return 1
  fi
}

# Check Node.js version
echo "🔍 Checking environment..."
node_version=$(node -v)
echo "Node.js version: $node_version"

if [[ ! "$node_version" =~ ^v(1[89]|[2-9][0-9]) ]]; then
  echo -e "${RED}❌ Node.js 18+ required${NC}"
  exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm ci
fi

# Run smoke tests for each package
echo -e "\n🏃 Running smoke tests..."

# Core package
run_test "Core Utils" "npx jest packages/core/src/__tests__/utils.test.ts --silent" || true

# Ingest package
run_test "CSV Parser" "npx jest packages/ingest --testNamePattern='should parse valid CSV' --silent" || true

# Qualify package  
run_test "Scoring Engine" "npx jest packages/qualify --testNamePattern='calculateBANTScore' --silent" || true

# API Authentication
run_test "Auth API" "npx jest apps/api --testNamePattern='should register a new user' --silent" || true

# Security
run_test "Security" "npx jest apps/api --testNamePattern='Rate Limiting' --silent" || true

# Summary
echo -e "\n========================================="
echo "📊 SMOKE TEST SUMMARY"
echo "========================================="

for result in "${RESULTS[@]}"; do
  echo "$result"
done

# Check if all passed
if [[ "${RESULTS[@]}" == *"❌"* ]]; then
  echo -e "\n${RED}⚠️  Some smoke tests failed. Run full test suite for details:${NC}"
  echo "npm test"
  exit 1
else
  echo -e "\n${GREEN}🎉 All smoke tests passed!${NC}"
  echo "Run full test suite with: npm test"
  exit 0
fi
