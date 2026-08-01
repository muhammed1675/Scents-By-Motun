# Scent by Motun — Setup

The storefront is Vite + React + TypeScript. All data access lives in
`src/services/` and talks to **Supabase** (Postgres + Auth + Storage + one Edge
Function for Paystack).

---

## 1. LOCAL SETUP (test on your machine first)

### 1.1 Install and run

```bash
npm install
cp .env.example .env      # then fill in the values below
npm run dev               # http://localhost:5173
```

### 1.2 Environment variables (`.env`)

| Variable | Where to get it |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase dashboard → Project Settings → API → Project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase dashboard → Project Settings → API → `anon` public key |
| `VITE_PAYSTACK_PUBLIC_KEY` | Paystack dashboard → Settings → API Keys & Webhooks → **Test** public key (`pk_test_…`) |

All three are public/browser-safe. The Paystack **secret** key never goes in
`.env` — it lives as a Supabase Edge Function secret (step 1.5).

### 1.3 Run the database migrations

In the Supabase dashboard → **SQL Editor**, run the files in
`supabase/migrations/` **in order**:

1. `0001_schema.sql` — all tables, indexes, grants, `redeem_coupon()`
2. `0002_rls.sql` — Row Level Security policies + `is_admin()`
3. `0003_profiles_trigger.sql` — auto-creates a `profiles` row on signup
4. `0004_storage.sql` — public `product-images` bucket, admin-only write
5. `0005_seed.sql` — the demo catalogue (products, categories, coupons,
   testimonials, store locations)

Or, with the Supabase CLI linked to your project:

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

### 1.4 Supabase dashboard settings needed before login works

- **Authentication → Providers → Email**: enabled (it is on by default).
- **Authentication → Providers → Email → Confirm email**: while testing
  locally it is easiest to turn *Confirm email* **off** so signup signs you in
  immediately. With it on, signup shows "check your inbox" and you sign in
  after clicking the confirmation link.
- **Authentication → URL Configuration → Site URL**: `http://localhost:5173`
  for local testing (add your Vercel URL later).
- **Make yourself an admin** (needed for `/admin`): sign up in the app first,
  then run in the SQL editor:
  ```sql
  update public.profiles set role = 'admin' where email = 'ayoolamuhammed05@gmail.com';
  ```

### 1.5 Storage bucket

`0004_storage.sql` creates the public **`product-images`** bucket and its
policies. Verify under **Storage** that the bucket exists and is marked
*Public*. If your project blocks SQL bucket creation, create the bucket
manually with the same name and set it public, then re-run `0004_storage.sql`
for the policies.

### 1.6 Paystack (test mode) — Edge Function

Online checkout opens the Paystack popup with your public key, then the Edge
Function verifies the charge with the secret key and moves the order to
`processing`.

```bash
supabase secrets set PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxx
supabase functions deploy paystack-webhook --no-verify-jwt
```

The function URL is:

```
https://<your-project-ref>.supabase.co/functions/v1/paystack-webhook
```

In the Paystack dashboard → **Settings → API Keys & Webhooks**, paste that URL
into the **Test Webhook URL** field.

If `VITE_PAYSTACK_PUBLIC_KEY` is empty, online checkout still creates the order
but leaves it `pending` and skips the payment popup — handy while you are only
testing the catalogue.

WhatsApp checkout needs no backend configuration: the order is stored as
`pending` and `buildWhatsAppLink()` opens the wa.me message.

### 1.7 Quick smoke test

1. Home page shows products → database + RLS read access works.
2. Sign up, then Account → Addresses → add one → owner RLS works.
3. Contact form + newsletter submit → public insert works.
4. Checkout with **Pay online** using Paystack test card
   `4084 0840 8408 4081`, any future expiry, CVV `408`, OTP `123456` →
   order flips to `processing` in **Table Editor → orders**.
5. Checkout with **WhatsApp** → order stays `pending` and WhatsApp opens.
6. `/admin` after setting `role = 'admin'` → dashboard, products, orders load.

---

## 2. VERCEL DEPLOYMENT (later, after local testing)

### 2.1 Environment variables

Vercel → your project → **Settings → Environment Variables**. Add the same
three names as `.env.example`, for **Production** (and Preview if you use it):

| Name | Value |
| --- | --- |
| `VITE_SUPABASE_URL` | `https://<your-project-ref>.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | your `anon` public key |
| `VITE_PAYSTACK_PUBLIC_KEY` | `pk_test_…` while testing, `pk_live_…` when live |

Vite only exposes variables prefixed with `VITE_`, and they are baked in at
build time — after changing one, **redeploy**.

### 2.2 Build settings (Vite)

| Setting | Value |
| --- | --- |
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |
| Node version | 18 or 20 |

Because this is a single-page app with client-side routing, deep links need a
rewrite to `index.html`. `vercel.json` in the repo already does this:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

Also add your Vercel domain in Supabase → **Authentication → URL
Configuration → Site URL / Redirect URLs**, otherwise email confirmation links
bounce back to localhost.

### 2.3 The Paystack webhook needs nothing on Vercel

The webhook is a **Supabase Edge Function**, so its URL is tied to the Supabase
project, not to Vercel:

```
https://<your-project-ref>.supabase.co/functions/v1/paystack-webhook
```

Deploying to Vercel does not change it, and no Vercel environment variable or
route is involved. Just confirm the Paystack dashboard webhook URL still points
at that Supabase URL.

### 2.4 Switching Paystack from test to live

Two places, both must be switched together:

1. **Secret key (Edge Function):**
   ```bash
   supabase secrets set PAYSTACK_SECRET_KEY=sk_live_xxxxxxxxxxxx
   supabase functions deploy paystack-webhook --no-verify-jwt
   ```
2. **Public key (Vercel):** change `VITE_PAYSTACK_PUBLIC_KEY` to `pk_live_…`
   in Vercel → Settings → Environment Variables, then redeploy.

Finally, in the Paystack dashboard switch from Test to Live mode and set the
**Live Webhook URL** to the same Edge Function URL.

---

## Reference

| Path | What it is |
| --- | --- |
| `src/services/supabase.ts` | Supabase client + Paystack public key |
| `src/services/catalog.ts` | Products, categories, price range |
| `src/services/commerce.ts` | Cart, coupons, `createOrder`, WhatsApp link |
| `src/services/auth.ts` | Auth, profile, addresses, my orders |
| `src/services/content.ts` | Testimonials, store locations, contact, newsletter |
| `src/services/admin.ts` | Admin console + `checkAdminAccess()` + image upload |
| `src/services/paystack.ts` | Paystack popup + verify call |
| `supabase/migrations/` | All SQL (schema, RLS, trigger, storage, seed) |
| `supabase/functions/paystack-webhook/` | Edge Function (webhook + verify) |
