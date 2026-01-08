#!/bin/bash
# Quick start script for FitQR with Stripe

echo "🚀 Starting FitQR with Stripe Integration"
echo ""

# Check if stripe CLI is installed
if ! command -v stripe &> /dev/null; then
    echo "⚠️  Stripe CLI not installed. Running without webhooks..."
    echo "   Install it later for webhook testing: brew install stripe/stripe-cli/stripe"
    echo ""
    npm run dev
else
    # Check if keys are configured
    if grep -q "sk_test_your_secret_key_here" .env.local 2>/dev/null; then
        echo "⚠️  Please configure your Stripe keys in .env.local first!"
        echo ""
        exit 1
    fi
    
    echo "✅ Stripe configured!"
    echo ""
    echo "Starting in 2 terminals:"
    echo "  1. Next.js dev server"
    echo "  2. Stripe webhook listener"
    echo ""
    
    # Start Next.js in background
    npm run dev &
    NEXT_PID=$!
    
    # Wait for Next.js to start
    sleep 3
    
    # Start Stripe listener
    echo ""
    echo "🎧 Starting Stripe webhook listener..."
    echo "   Press Ctrl+C to stop both servers"
    echo ""
    
    stripe listen --forward-to localhost:3000/api/webhooks/stripe
    
    # Cleanup on exit
    kill $NEXT_PID 2>/dev/null
fi
