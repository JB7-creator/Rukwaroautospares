# Supabase Setup — Rukwaro Autospares

The storefront and admin run fully in **local mode** out of the box.
Follow these steps to switch on the backend.

## 1. Create the project
1. Go to **https://database.new** (or supabase.com → New project)
2. Name: `rukwaro-autospares`
3. Region: **Europe (Frankfurt/London)** or **Middle East (Bahrain)** — closest reliable latency for Nairobi
4. Save the database password somewhere safe

## 2. Run the schema
Open **SQL Editor** → New query → paste the entire contents of
`supabase/schema.sql` → **Run**.

Then run `supabase/seed-products.sql` the same way to import the
full 31-product catalog (re-runnable; updates prices/stock on conflict).

This creates: `products`, `orders`, `order_items`, `leads`, `admin_users`,
RLS policies, the `product-images` storage bucket and update triggers.

## 3. Create the admin user
**Authentication → Users → Add user** → email + password.
Then in SQL Editor:

```sql
insert into public.admin_users (user_id, email)
select id, email from auth.users where email = 'YOUR-ADMIN-EMAIL';
```

## 4. Give me the keys
**Project Settings → API** — copy:
- `Project URL` (https://xxxx.supabase.co)
- `anon` / `public` key

Send both. I will:
- Create `.env.local` with `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`
- Wire product reads, order inserts and admin auth into the app
- Import the 31-product catalog into your database (SQL seed)

> The `anon` key is safe to share — it is protected by Row Level Security.
> Never share the `service_role` key.

## 5. Auth callback (later)
For password-reset emails, add your deployed URL under
**Authentication → URL Configuration → Redirect URLs**.
