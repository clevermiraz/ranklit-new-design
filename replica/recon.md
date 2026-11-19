# Recon map: Local SEO Bot (localseobot.com)

Sources: public pages only (home, /pricing, /features, /local-business, /terms, /privacy, /sms-terms, /blog), read 2026-11-06. No login, no bundles, no network inspection. The app itself (app.localseobot.com) was NOT seen, so every in-app screen below is inferred from marketing mockups. Treat as medium/low confidence.

## Scope (assumed, confirm)
- Platform: web. Slice: core loop = connect Google Business Profile -> weekly geo-grid rank scan -> automated posts + review replies -> reports. Audience: a product to sell to local businesses.
- Terms check: no clause forbids building a competing product. Section 5 bars reverse engineering and resale. We do neither.

## Core loop
Connect GBP (OAuth) -> business review -> editable strategy (keywords) -> pick automations -> weekly rank scan (49-point map) + 3 posts/week + AI replies to 4-5 star reviews -> weekly rank update, monthly report.
Happy path to first value: sign up, pay/trial, connect Google, add keyword = about 5 steps.

## Sources
| source | url |
| --- | --- |
| pricing | https://www.localseobot.com/pricing/ |
| features | https://www.localseobot.com/features/ |
| how it works | https://www.localseobot.com/local-business/ |
| terms / privacy | https://www.localseobot.com/terms/ , /privacy/ |
| blog (~150 posts) | https://www.localseobot.com/blog/ |
| not read | /agencies/, /rank-tracker/, /tools/, /case-studies/ |

## Screens (S) - inferred
| ID | screen | route | purpose | key components | states |
| --- | --- | --- | --- | --- | --- |
| S01 | Landing | / | sell | hero, pricing cards, FAQ | seen |
| S02 | Pricing | /pricing | plans, monthly/annual toggle, location selector | toggle, plan cards | seen |
| S03 | Login / signup | /login | auth | form | inferred |
| S04 | Checkout | /checkout?plan= | payments, 3-day trial (we use Polar; original uses Stripe) | Polar Checkout | inferred |
| S05 | Connect Google | onboarding | OAuth to GBP | button, location picker | inferred |
| S06 | Business review / strategy | onboarding | audit + keyword plan, editable | keyword list | inferred |
| S07 | Automations | onboarding/settings | toggles: posts, review replies | toggles | inferred |
| S08 | Dashboard / activity feed | /dashboard | what the agent did | feed items, KPI tiles | seen in mockup |
| S09 | Rank scans | /scans | 49-point heat map, avg rank, top-3 spots, "Check again" | map grid, legend 1-3/4-10/11+ | seen in mockup |
| S10 | Posts | /posts | queue, approve/edit, history | list, editor | inferred |
| S11 | Reviews | /reviews | inbox, AI reply drafts, request campaigns (Growth) | list, composer | inferred |
| S12 | Review landing page + QR | public | collect reviews | QR, star page | inferred |
| S13 | Listings / citations | /listings | status of 500+ citations, logins | table | inferred |
| S14 | GBP audit | /audit | hours, photos, services, categories + auto-fix | checklist | inferred |
| S15 | Reports | /reports | weekly rank, monthly PDF/email | report view | inferred |
| S16 | AI visibility | /ai | ChatGPT/Claude/Perplexity/Google AI mentions (Growth) | query table | inferred |
| S17 | Billing / plan / locations | /billing | change plan, add location, scan credits top-up | Stripe portal | inferred |
| S18 | Settings | /settings | profile, SMS opt-in, disconnect Google | form | inferred |
| S19 | Agency white-label portal | custom domain | client portal, own logo/colors | theming | out of MVP |

Empty/loading/error states to record when building: no scans yet, scan running, Google disconnected/revoked, no reviews, payment failed.

## Flows
- F01 Visitor to subscriber: S01 -> S02 -> S04 -> S03 -> S05 -> S06 -> S07 -> S08. Edge: Google account has no GBP, multiple locations, trial ends, card fails.
- F02 Weekly rank scan: cron -> 49 SERP checks -> store -> S09 -> weekly email. Edge: credits exhausted, API failure, business moved.
- F03 Auto-post: schedule 3/week -> LLM draft -> (optional approval) -> publish via GBP API -> feed. Edge: policy rejection, token revoked.
- F04 Review reply: poll new reviews -> 4-5 star only -> LLM reply -> publish. 1-3 star left for owner.
- F05 Review request: S12 QR/link; email campaign (Growth, 250/mo).
- F06 Monthly audit + report: check profile -> auto-fix -> report email.
- F07 Change plan / add location: S17.

## Components
Plan card, billing toggle, location selector, geo-grid heat map (green/amber/red), KPI tile, activity feed item, toggle, data table, toast, modal, QR card, email templates (rank update, report, review request).

## Inferred data model
| entity | fields | confidence |
| --- | --- | --- |
| User | id, email, name, phone?, sms_consent | high |
| Account/Org | id, stripe_customer_id, plan, status, trial_ends_at | high |
| Location | id, org_id, gbp_location_id, name, address, lat, lng, categories, oauth_token_ref | high |
| Keyword | id, location_id, text | high |
| Scan | id, location_id, keyword_id, grid_size (7x7=49), radius, ran_at, credits_used | high |
| ScanPoint | scan_id, lat, lng, rank (null = 20+) | high |
| Post | id, location_id, body, image_url, scheduled_at, status, gbp_post_id | high |
| Review | id, location_id, gbp_review_id, rating, text, reply_status, reply_text | high |
| ReviewRequest | id, location_id, email, sent_at, clicked | medium |
| Citation | id, location_id, site, status, placed_by (auto/hand), login_ref | medium |
| AuditCheck | id, location_id, check, status, fixed_at | medium |
| AIVisibilityCheck | id, location_id, engine, query, mentioned, raw | medium |
| Report | id, location_id, period, url | medium |
| ActivityEvent | id, location_id, type, payload, at | high |
| Credit ledger | org_id, delta, reason | medium |

## Hard parts
1. Google Business Profile API access: needs Google approval for API quota plus OAuth verification. Biggest schedule risk, and it is outside our control.
2. Geo-grid rank scans: cost per scan via a SERP/Maps API (49 points x keywords x weekly). Needs a credit system and a cost model.
3. Citations at scale (500+ listings, hand-placed premium): this is a human service or paid aggregator API, not software.

## Cannot be cloned / skip
- Human account managers and hand-placed premium citations (service, not code).
- Their 500+ citation network and partner deals (use an aggregator vendor or skip).
- Their customer base and reviews. The ranking guarantee is a business risk.
- Facebook/Instagram posting ("coming soon" even for them).

## Size
~19 screens, 7 flows, 15 entities. MVP (S01-S09, F01-F04): M. Full Growth plan parity: L. White-label agency: later (XL on its own).

## Gaps to confirm
Real app screens (need your own trial account), scan credit allowances per plan, per-location price breaks.
