#!/bin/bash
# Script para criar o primeiro usuário admin

export DATABASE_URL="postgresql://postgres:postgres@postgres:5432/iaounao"

cd /app

npx tsx scripts/setup-admin.ts << EOF
Admin Master
admin@iaounao.com
admin123456
admin123456
EOF
