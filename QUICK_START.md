# FitQR Quick Start - Get Customer Data Flowing!

## What You Need

1. **Supabase Account** - Free tier is perfect to start
2. **5 minutes** to set up the database

## Setup Steps

### 1. Create Supabase Project (2 min)

1. Go to [supabase.com](https://supabase.com) → Sign in → New Project
2. Name it "FitQR Planner" (or whatever you want)
3. Generate a password and **save it**
4. Choose a region near you
5. Click "Create new project" and wait ~2 minutes

### 2. Get Your Keys (1 min)

Once project is ready:

1. Click **Settings** (gear icon) → **API**
2. Copy two things:
   - **Project URL** (like `https://abcxyz.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

### 3. Add to .env.local (30 sec)

Open `/workspaces/FitQRplanner/.env.local` and update:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id-here.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your_long_key_here
```

### 4. Create Database Tables (1 min)

1. In Supabase, click **SQL Editor** → **New Query**
2. Copy/paste this SQL and click **Run**:

```sql
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stripe_session_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  payment_status TEXT,
  amount_total INTEGER,
  mode TEXT,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  plan_id TEXT NOT NULL,
  subscribe BOOLEAN DEFAULT FALSE,
  routine_type TEXT,
  notes TEXT,
  fitness_goal TEXT,
  fitness_level TEXT,
  equipment TEXT,
  time_per_workout TEXT,
  medical_history TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  status TEXT NOT NULL,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_orders_email ON orders(customer_email);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service role full access to orders"
  ON orders FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Allow service role full access to subscriptions"
  ON subscriptions FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Allow anonymous insert to orders"
  ON orders FOR INSERT TO anon WITH CHECK (true);
```

### 5. Restart Your Server (30 sec)

```bash
# In terminal, press Ctrl+C to stop current server
# Then:
npm run dev
```

## You're Done! 🎉

Now when customers fill out your form:

1. **Their info saves immediately** to Supabase (even if they don't pay)
2. **Payment confirmation** updates the same record
3. **You can see everything** in Supabase → Table Editor → orders

## View Customer Data

### In Supabase Dashboard:

1. Click **Table Editor** in sidebar
2. Click **orders** table
3. See all customer submissions with their fitness goals!

### See Most Recent Orders:

Click **SQL Editor** → New Query → Run this:

```sql
SELECT 
  customer_name,
  customer_email,
  plan_id,
  fitness_goal,
  fitness_level,
  routine_type,
  payment_status,
  created_at
FROM orders
ORDER BY created_at DESC
LIMIT 20;
```

### Filter Only Paid Customers:

```sql
SELECT * FROM orders
WHERE payment_status = 'paid'
ORDER BY created_at DESC;
```

## What Gets Saved

Every time someone submits the form:

- ✅ Name & Email
- ✅ Plan choice (subscription/workout/meals)
- ✅ Fitness goal
- ✅ Fitness level
- ✅ Equipment available
- ✅ Time per workout
- ✅ Medical history
- ✅ Routine type (home/gym)
- ✅ Special notes
- ✅ Payment status (pending → paid)
- ✅ Stripe payment details

## Next Steps

- [Full Supabase Setup Guide](./SUPABASE_SETUP.md) - More details & troubleshooting
- [Stripe Setup](./STRIPE_SETUP.md) - If you haven't set up payments yet

## Need Help?

Check the console logs:
- `npm run dev` terminal shows what's being saved
- Supabase → Logs shows database activity
