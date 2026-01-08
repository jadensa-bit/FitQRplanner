#!/bin/bash

# FitQR Stripe Quick Setup Script
# Run this to quickly test your Stripe integration

echo "🎯 FitQR Stripe Integration Setup"
echo "=================================="
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local not found!"
    echo "📝 Creating .env.local from example..."
    cp .env.example .env.local
    echo "✅ Created .env.local"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env.local and add your Stripe keys!"
    echo "   Get them from: https://dashboard.stripe.com/test/apikeys"
    echo ""
    exit 1
fi

# Check if Stripe keys are set
if grep -q "sk_test_your_secret_key_here" .env.local; then
    echo "⚠️  Stripe keys not configured yet!"
    echo ""
    echo "To set up:"
    echo "1. Go to https://dashboard.stripe.com/test/apikeys"
    echo "2. Copy your keys"
    echo "3. Edit .env.local and replace the placeholder values"
    echo ""
    exit 1
fi

echo "✅ .env.local exists and appears configured"
echo ""

# Check if Stripe CLI is installed
if ! command -v stripe &> /dev/null; then
    echo "⚠️  Stripe CLI not installed"
    echo ""
    echo "Install it with:"
    echo "  macOS: brew install stripe/stripe-cli/stripe"
    echo "  Linux: See STRIPE_SETUP.md"
    echo ""
    echo "After installing, run:"
    echo "  stripe login"
    echo "  stripe listen --forward-to localhost:3000/api/webhooks/stripe"
    echo ""
else
    echo "✅ Stripe CLI is installed"
    echo ""
    echo "Start webhook listener with:"
    echo "  stripe listen --forward-to localhost:3000/api/webhooks/stripe"
    echo ""
fi

echo "🚀 Ready to start!"
echo ""
echo "In one terminal:"
echo "  npm run dev"
echo ""
echo "In another terminal:"
echo "  stripe listen --forward-to localhost:3000/api/webhooks/stripe"
echo ""
echo "Test card: 4242 4242 4242 4242"
echo ""
echo "📖 Full guide: See STRIPE_SETUP.md"
