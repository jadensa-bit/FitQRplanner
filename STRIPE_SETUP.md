# Stripe Integration Setup Guide

## 🚀 Quick Start

Your Stripe integration is ready! Follow these steps to activate payments:

---

## 1️⃣ Get Your Stripe API Keys

### Test Mode (Development)
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Copy your **Secret key** (starts with `sk_test_`)

### Add Keys to `.env.local`
```bash
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
```

---

## 2️⃣ Set Up Stripe Webhook (IMPORTANT!)

Webhooks let Stripe notify your app when payments succeed.

### Local Development (Testing)
1. Install Stripe CLI:
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe
   
   # Linux
   wget https://github.com/stripe/stripe-cli/releases/download/v1.19.4/stripe_1.19.4_linux_x86_64.tar.gz
   tar -xvf stripe_1.19.4_linux_x86_64.tar.gz
   sudo mv stripe /usr/local/bin
   ```

2. Login to Stripe:
   ```bash
   stripe login
   ```

3. Forward webhooks to your local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. Copy the webhook signing secret (starts with `whsec_`) and add to `.env.local`:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
   ```

### Production Deployment
1. Go to [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **"Add endpoint"**
3. Enter your production URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **Signing secret** and add to production environment variables

---

## 3️⃣ Create Supabase Tables (Optional but Recommended)

If using Supabase for order tracking:

```sql
-- Orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stripe_session_id TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT,
  customer_email TEXT,
  customer_name TEXT,
  plan_id TEXT,
  notes TEXT,
  amount_total INTEGER,
  payment_status TEXT,
  mode TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT,
  status TEXT,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust based on your auth setup)
CREATE POLICY "Enable read for all users" ON orders FOR SELECT USING (true);
CREATE POLICY "Enable read for all users" ON subscriptions FOR SELECT USING (true);
```

---

## 4️⃣ Test the Integration

### Start Development Server
```bash
npm run dev
```

### In Another Terminal, Start Stripe Webhook Listener
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### Test Payment Flow
1. Go to `http://localhost:3000`
2. Select a plan
3. Click "See Plans" or checkout button
4. Use Stripe test card: `4242 4242 4242 4242`
5. Any future expiry date, any CVC, any ZIP
6. Complete checkout

### Verify Webhook Received
Check your webhook listener terminal - you should see events logged.

---

## 5️⃣ Pricing Configuration

Current pricing in `route.ts`:
- **Subscription**: $9/month (`amount: 900`)
- **Workout Plan**: $8 one-time (`amount: 800`)
- **Meal Plan**: $5 one-time (`amount: 500`)
- **All-in-One**: $12 one-time (default fallback)

To change prices, edit `/src/app/api/checkout/route.ts`:
```typescript
const planPricing = {
  subscription: { amount: 900, ... }, // Amount in cents
  workout: { amount: 800, ... },
  meals: { amount: 500, ... }
};
```

---

## 6️⃣ Go Live Checklist

Before launching to production:

### Stripe Dashboard
- [ ] Switch to **Live mode** in Stripe dashboard
- [ ] Get live API keys (`pk_live_...` and `sk_live_...`)
- [ ] Set up production webhook endpoint
- [ ] Enable required payment methods
- [ ] Configure tax settings (if needed)

### Environment Variables
- [ ] Update `.env.local` with live keys
- [ ] Add webhook secret from production webhook
- [ ] Set all environment variables in hosting platform (Vercel, Railway, etc.)

### Testing
- [ ] Test full checkout flow in production
- [ ] Verify webhooks are received
- [ ] Check order data in Supabase
- [ ] Test subscription creation
- [ ] Test subscription cancellation

### Security
- [ ] Never commit `.env.local` to git (already in `.gitignore`)
- [ ] Use environment variables for all secrets
- [ ] Enable Stripe webhook signature verification (already implemented)

---

## 📊 What Happens When Someone Pays?

### One-Time Payment Flow
1. User clicks checkout → redirected to Stripe
2. User completes payment
3. Stripe sends `checkout.session.completed` webhook
4. Your app stores order in Supabase
5. User redirected to success page
6. *(You manually create their plan)*

### Subscription Flow
1. User subscribes → Stripe creates subscription
2. `customer.subscription.created` webhook fires
3. Subscription stored in database
4. Each month: `invoice.payment_succeeded` webhook
5. *(You can auto-generate new monthly plan)*

---

## 🔧 Troubleshooting

### "Missing STRIPE_SECRET_KEY"
- Check `.env.local` exists in project root
- Ensure key starts with `sk_test_` or `sk_live_`
- Restart dev server after adding keys

### Webhook Not Receiving Events
- Make sure Stripe CLI is running: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
- Check webhook secret matches in `.env.local`
- Verify endpoint URL is correct

### Payment Succeeds But No Data Saved
- Check webhook listener logs for errors
- Verify Supabase tables exist
- Check Supabase connection in console

---

## 💡 Next Steps

1. **Customize success page**: Edit `/src/app/success/page.tsx`
2. **Send confirmation emails**: Integrate SendGrid/Resend
3. **Auto-generate plans**: Hook into webhook to trigger plan creation
4. **Customer portal**: Add Stripe Customer Portal for subscription management
5. **Analytics**: Track conversions in Stripe Dashboard

---

## 📚 Resources

- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)
- [Next.js + Stripe Guide](https://stripe.com/docs/checkout/quickstart?lang=node)

---

## 🆘 Need Help?

Check Stripe logs:
- [Stripe Events](https://dashboard.stripe.com/test/events)
- [Stripe Webhooks](https://dashboard.stripe.com/test/webhooks)

Your app logs:
```bash
# Check Next.js console for errors
npm run dev

# Check webhook listener
stripe listen --forward-to localhost:3000/api/webhooks/stripe --print-json
```
