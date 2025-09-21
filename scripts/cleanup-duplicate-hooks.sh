#!/bin/bash
# Script to remove the duplicate use-i18n.ts file that causes circular import

echo "Removing duplicate use-i18n.ts file..."
rm -f apps/web/src/hooks/use-i18n.ts
echo "Done! Only use-i18n.tsx remains."
