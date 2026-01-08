# Supabase Setup Guide for FitQR Planner

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" or "New Project"
3. Sign in with GitHub
4. Create a new organization (if needed)
5. Click "New Project"
   - Name: `FitQR Planner` (or your choice)
   - Database Password: Generate a strong password (save it!)
   - Region: Choose closest to you
   - Click "Create new project"

## Step 2: Get Your API Keys

Once your project is created:

1. Go to **Project Settings** (gear icon in sidebar)
2. Click **API** in the left menu
3. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

## Step 3: Add Keys to .env.local

Update your `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your_anon_key_here
```

## Step 4: Create Database Tables

1. In Supabase dashboard, click **SQL Editor** (database icon in sidebar)
2. Click **New Query**
3. Paste the SQL below and click **Run**

```sql
-- Customer intake/orders table
-- This stores all customer information from the intake form
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Stripe data
  stripe_session_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  payment_status TEXT,
  amount_total INTEGER,
  mode TEXT,
  
  -- Customer info
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  
  -- Plan selection
  plan_id TEXT NOT NULL, -- "subscription", "workout", or "meals"
  subscribe BOOLEAN DEFAULT FALSE,
  routine_type TEXT, -- "home" or "gym"
  notes TEXT,
  
  -- Fitness intake data
  fitness_goal TEXT,
  fitness_level TEXT,
  equipment TEXT,
  time_per_workout TEXT,
  medical_history TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions table
-- Tracks active/cancelled subscriptions
CREATE TABLE subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  status TEXT NOT NULL, -- "active", "cancelled", "past_due", etc.
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX idx_orders_email ON orders(customer_email);
CREATE INDEX idx_orders_stripe_session ON orders(stripe_session_id);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_subscriptions_customer ON subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- Enable Row Level Security (RLS)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies to allow service role access
CREATE POLICY "Allow service role full access to orders"
  ON orders
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow service role full access to subscriptions"
  ON subscriptions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Optional: Allow anon to insert orders (for form submissions)
CREATE POLICY "Allow anonymous insert to orders"
  ON orders
  FOR INSERT
  TO anon
  WITH CHECK (true);
```

## Step 5: Verify Tables Created

1. Click **Table Editor** in the sidebar
2. You should see:
   - ✅ `orders` table
   - ✅ `subscriptions` table

## Step 6: Test the Connection

Restart your dev server to pick up the new env variables:

```bash
# Kill current server (Ctrl+C) then:
npm run dev
```

Now when customers submit the form, their data will be saved to Supabase!

## Viewing Customer Data

### In Supabase Dashboard:

1. Click **Table Editor**
2. Click **orders** table
3. You'll see all customer submissions with their intake info

### Useful Queries in SQL Editor:

```sql
-- View all recent orders
SELECT 
  customer_name,
  customer_email,
  plan_id,
  fitness_goal,
  fitness_level,
  created_at
FROM orders
ORDER BY created_at DESC
LIMIT 20;

-- View only paid orders
SELECT * FROM orders
WHERE payment_status = 'paid'
ORDER BY created_at DESC;

-- View all active subscriptions
SELECT 
  s.status,
  o.customer_name,
  o.customer_email,
  o.fitness_goal,
  s.current_period_end
FROM subscriptions s
JOIN orders o ON s.stripe_customer_id = o.stripe_customer_id
WHERE s.status = 'active'
ORDER BY s.current_period_end;
```

## Troubleshooting

**Error: "Invalid supabaseUrl"**
- Make sure URL starts with `https://` and ends with `.supabase.co`
- Check for extra spaces in `.env.local`

**Data not saving:**
- Check dev server logs for errors
- Verify tables exist in Table Editor
- Check RLS policies are created

**Can't see data:**
- Click "Refresh" in Table Editor
- Make sure you're looking at the right table
