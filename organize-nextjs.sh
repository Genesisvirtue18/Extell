#!/bin/bash

# Move components to correct location
if [ ! -d "src/components" ]; then
  mv src-backup/components src/components
fi

# Move admin folder
if [ ! -d "src/admin" ]; then
  mv src-backup/admin src/admin
fi

# Move lib and other utilities
if [ ! -d "src/lib" ]; then
  mkdir -p src/lib
  cp -r src-backup/lib/* src/lib/ 2>/dev/null || true
fi

# Move upsCalc
if [ ! -d "src/upsCalc" ]; then
  mv src-backup/upsCalc src/upsCalc
fi

# Copy CSS files
cp src-backup/*.css src/ 2>/dev/null || true

# Create middleware for admin auth
mkdir -p src/middleware

echo "File reorganization complete"
