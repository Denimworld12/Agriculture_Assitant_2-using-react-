#!/bin/bash

# Fix ESLint issues
echo "Fixing ESLint issues..."
npx eslint . --fix

# Fix TypeScript issues
echo "Checking TypeScript..."
npx tsc --noEmit

# Fix formatting
echo "Formatting code..."
npx prettier --write .

echo "Done! Please check the output above for any remaining issues." 