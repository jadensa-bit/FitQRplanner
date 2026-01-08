# 💳 Stripe Payment Integration

## Quick Start

1. **Get Stripe API Keys**
   - Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
   - Copy your test keys

2. **Add to `.env.local`**
   ```bash
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```

3. **Install Stripe CLI** (for webhook testing)
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe
   
   # Login
   stripe login
   ```

4. **Start Development**
   ```bash
   # Terminal 1: Start app
   npm run dev
   
   # Terminal 2: Listen for webhooks
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

5. **Test Payment**
   - Use test card: `4242 4242 4242 4242`
   - Any future date, any CVC, any ZIP

## 📖 Full Documentation

See [STRIPE_SETUP.md](./STRIPE_SETUP.md) for complete setup guide.

## 🎯 What's Included

✅ **Checkout Integration** - `/api/checkout/route.ts`
- One-time payments ($8, $5, $12)
- Monthly subscriptions ($9/month)
- Secure payment processing

✅ **Webhook Handler** - `/api/webhooks/stripe/route.ts`
- Payment confirmations
- Subscription lifecycle events
- Automatic database updates

✅ **Price Configuration**
- Subscription: $9/month
- Workout Plan: $8 one-time
- Meal Plan: $5 one-time
- All-in-One: $12 one-time

## 🔐 Security

- Webhook signature verification ✅
- Environment variable protection ✅
- No API keys in code ✅
- Supabase order storage ✅

## Test Cards

| Card Number | Description |
|------------|-------------|
| 4242 4242 4242 4242 | Success |
| 4000 0025 0000 3155 | 3D Secure required |
| 4000 0000 0000 9995 | Declined |

---

**Need help?** Check the [full setup guide](./STRIPE_SETUP.md) or [Stripe docs](https://stripe.com/docs).
