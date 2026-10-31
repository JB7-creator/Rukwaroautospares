# Rukwaro Autospares — Auto-Parts E-commerce Research Report
Sources: RockAuto, AutoZone, EuroCarParts, FCP Euro, PartSouq, Baymard Automotive Parts UX Benchmark 2026, Kenyan players (SasaParts, AutoJiji, SparesWorld, Jumia KE, Slurg), WhatsApp/M-Pesa commerce case studies.

## 1. Top 10 MVP Features Rukwaro Lacks (ranked by conversion impact)
1. **Persistent "My Garage" vehicle selector** — sites with strong YMM search convert 2.5–3× higher; selection must persist across catalog/product/cart (RockAuto, AutoJiji: "add your car once"). → Store in localStorage/context; show chip in header; filter catalog client-side.
2. **Fitment confirmation on product page** — "✓ Fits your 2015 Toyota NZE141 1.5L" badge at add-to-cart kills the #1 objection ("will it fit?"). → `selectedVehicle fits product.fitment` conditional badge, green/red, near CTA.
3. **Part-number / OEM search** — SasaParts, RockAuto, PartSouq all lead with "paste a number like 90915-03001". Fuzzy-match OEM + cross-refs. → Normalize + search partNo/OEM/crossRefs fields in the same search bar, with typeahead.
4. **Stock per branch + pickup framing** — AutoZone's same-day pickup is a core conversion feature; 3 branches is Rukwaro's advantage. → Per-product "In stock: Nairobi ✓ / Nakuru ✗" row + "Ready today" tag; cheap to render.
5. **Multi-brand options per part** — RockAuto lists genuine/aftermarket tiers of the same part side by side ("choose your price/quality balance"). → Group variants by `partId`; tab or tiered card row (Genuine / Premium / Budget).
6. **Real multi-angle photos + installed views** — Baymard: product lists/PDPs fail on "physical context"; Jumia KE listings are stock-photo soup. → Photo gallery with zoom; label install shots ("On vehicle").
7. **"Complete the job" related-parts block** — pads→discs, filter→oil bundle upsell; drove +38% AOV in a Kenyan case study. → `relatedPartIds` array rendered as horizontal scroll row on PDP/cart.
8. **Qty-per-car + side/position labels** — RockAuto: "Front Left OR Right — order qty 2", "sold as axle set". → Fields `qtyPerCar`, `position`; render as badges, auto-suggest qty at add-to-cart.
9. **Reviews with counts + photos** — 95% of users rely on reviews; 53% seek negative ones. Even 2–3 reviews beats none. → Simple star row on cards + review list in PDP modal; seed with walk-in customer quotes.
10. **Delivery estimate by location + "order via WhatsApp" per product** — SasaParts' whole funnel is "search → order in one WhatsApp message". → WhatsApp deep link prefilled with product name, part no, vehicle, branch.

## 2. Retention / Daily-Return Mechanics (ranked by fit for small Kenyan parts brand)
1. **WhatsApp service reminders** (top pick) — "Your oil change was ~5,000 km ago / 3 months ago" based on purchase history; AutoZone's service history + Kenya's WhatsApp-first market. → Capture phone+vehicle at checkout; manual broadcast list is enough at MVP.
2. **Restock / back-in-stock alerts** — "Notify me" replaces dead ends; standard in Kenyan retail stacks (Pinch Africa). → Collect phone on out-of-stock products; notify via WhatsApp when restocked.
3. **Weekly deals page + flash timer** — Jumia KE's Black Friday framing works; honest weekly rotation (e.g., "Service Item Fridays") drives check-ins. → `deals[]` with `endsAt`; countdown component; don't fake-scarce.
4. **Simple points loyalty** — AutoZone: 5 purchases → $20 reward; KenZobe case study moved repeat rate 18%→47% with "KES 1 = 1 point". → Defer backend; MVP = stamped WhatsApp card ("buy 5 oil changes, 6th filter free") rendered as progress UI.
5. **Price-drop alerts** — "Track this part" for expensive items (bumpers, ECUs). → Lowest priority; needs notification plumbing; fold into #2 later.
(Skip: daily-login gamification, subscription boxes — wrong cadence for repair-driven purchases.)

## 3. Product Page Best Practices (what parts buyers check before buying)
- **Fitment block first**: confirmed fit OR "check fit" input; explicit exceptions ("not Type-R / not hybrid") — RockAuto puts fitment notes in every listing.
- **Position & side**: Front/Rear, Left/Right, upper/lower — the #1 source of wrong orders.
- **OEM / part number + cross-references**, monospace, copyable (mechanics paste these into searches).
- **Genuine vs aftermarket grade badge** with plain-English meaning (AutoJiji flags fakes; SparesWorld leads with authenticity).
- **Warranty line per product**: months covered + what it covers (EuroCarParts: min 12 months, manufacturing defects).
- **Stock per branch** + "ready today at X branch" framing.
- **Qty per car** and pack contents ("price is per piece"; "pads = full axle set").
- **Installed/real photos**, not only catalog renders.
- **Return policy visible near the CTA** — 44% of sites hide it; buyers of high-cost items actively look (Baymard).
- **Reviews**: rating distribution, negative reviews present, merchant replies (37% of users factor replies into trust).

## 4. Trust Signals That Matter for Parts
- **Genuine-parts guarantee** stated sitewide ("No second-hand, no imitations" — SasaParts).
- **Warranty + returns**: clear window (Kenya norm 3–14 days per AutoJiji), how-to-return in one step, refund to M-Pesa.
- **Physical proof**: branch addresses, photos, hours, phone numbers (already have 3 branches — show them with maps).
- **"Pay on delivery / M-Pesa after confirmation"** — AutoJiji holds vendor payment until delivery; massive trust lever in Kenya.
- **Review counts everywhere** + responses to negative reviews (89% of sites don't reply — replying is a cheap differentiator).
- **Human reachable in 1 tap**: WhatsApp with response-time promise ("we reply in minutes 8am–7pm").
- **Part verification help**: "Not sure? Send us your VIN/chassis number on WhatsApp" (SparesWorld's chassis→quote flow).

## 5. Anti-Patterns to Avoid
- **Dense text-only catalog UI** (RockAuto function, 1998 look): parts data without scannable cards/images loses modern buyers.
- **Fitment filter that doesn't persist or doesn't pre-filter listings** — the most common failure Baymard found; a hero widget alone isn't enough.
- **Hiding stock/shipping until cart** — show branch stock and delivery promise on the PDP.
- **Requiring accounts to buy or review** (60% of sites over-require; kills review volume).
- **Stock photos / unrelated products in categories** (Jumia KE auto-parts listings contain game expansion packs) — destroys credibility instantly.
- **Fake countdown timers / fake scarcity** — parts buyers are repeat, technical, and will notice.
- **Search that only matches product names** — no part-number search = mechanics bounce to SasaParts.
- **Vague "genuine" claims without grading** — label Genuine/OEM/Aftermarket per SKU or don't claim it.
- **Auto-playing hero carousels & heavy imagery** — mobile, data-conscious Kenyan users; keep hero <100KB.
