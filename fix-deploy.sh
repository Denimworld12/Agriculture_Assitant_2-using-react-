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

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
  echo "Creating .env file..."
  cp .env.local .env
fi

echo "Done! Please check the output above for any remaining issues." 