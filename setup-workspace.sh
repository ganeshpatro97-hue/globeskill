#!/usr/bin/env bash
# =============================================================================
# GlobeSkill Workspace Setup & Architecture Verification Script
# =============================================================================

set -e

echo "🌍 Initializing GlobeSkill Full-Stack Workspace..."

# 1. Check Node & npm
echo "📦 Checking Node.js and npm versions..."
node -v
npm -v

# 2. Install dependencies
echo "📥 Installing dependencies..."
npm install

# 3. Verify Environment Configuration
if [ ! -f ".env.local" ]; then
    echo "⚙️ Creating .env.local from template (.env.local.example)..."
    cp .env.local.example .env.local
    echo "⚠️ Please update .env.local with your live Supabase and Gemini keys!"
else
    echo "✅ .env.local configuration file detected."
fi

# 4. Verify Next.js Production Build
echo "🏗️ Testing production build compilation..."
npm run build

echo "🎉 GlobeSkill workspace setup complete! Run 'npm run dev' to start."
