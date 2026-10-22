/**
 * Seed projects. Titles come from the owner's GitHub; summaries, metrics and
 * case-study text are placeholders written to show the layout and must be
 * replaced with real detail from the admin.
 */
import { img } from '@/lib/seed/images'
import type { Project } from '@/types'

export const seedProjects: Array<Project> = [
  {
    id: 'seed-folio-builder',
    slug: 'folio-builder',
    title: 'Folio Builder',
    summary: 'A CMS that lets photographers, designers and studios publish a fast portfolio site without hiring a developer.',
    role: 'Founder and lead engineer',
    client: 'Own product',
    year: 2025,
    tags: ['Product', 'SaaS'],
    stack: ['TypeScript', 'React', 'TanStack Start', 'PostgreSQL', 'Cloudinary'],
    links: [{ label: 'Source', url: 'https://github.com/zeddyemy/Folio-Builder' }],
    metrics: [
      { value: '< 10 min', label: 'from sign-up to a live site' },
      { value: '95+', label: 'Lighthouse performance on published sites' },
    ],
    cover: img.blueprint,
    gallery: [img.wireframing, img.deskSetup],
    body: `## The problem

Creative people kept asking me for the same thing: a portfolio that looks considered, loads fast on a phone, and can be updated without calling a developer. Website builders were either slow, generic, or both.

## What I built

Folio Builder is a multi-tenant CMS with a small set of opinionated templates. Owners upload work, reorder it with drag and drop, and edit every line of copy in place. Images go straight to a CDN with responsive sizes generated on the fly.

- Tenant-aware data model with row-level security, so one database serves every site safely
- Direct browser uploads with signed requests, keeping large files off the app server
- Server-rendered pages cached at the edge, so a published site stays fast without extra work

## Decisions worth noting

I kept the template count deliberately low. Every extra template multiplies testing and support, and most users want a good default more than they want choice.

\`\`\`ts
// Every query is scoped by tenant before it reaches the database
const projects = await db.from('projects').select('*').eq('site_id', site.id).eq('published', true)
\`\`\`

## Where it is now

The product runs my own client sites and is being prepared for a small public beta.`,
    featured: true,
    published: true,
    sortOrder: 1,
  },
  {
    id: 'seed-storezed',
    slug: 'storezed',
    title: 'StoreZed',
    summary: 'A commerce platform with a built-in wallet, so merchants can take payments, hold balances and pay out in one place.',
    role: 'Lead backend engineer',
    client: 'StoreZed',
    year: 2023,
    tags: ['Fintech', 'Commerce'],
    stack: ['Python', 'Flask', 'PostgreSQL', 'Redis', 'Paystack'],
    links: [{ label: 'Source', url: 'https://github.com/zeddyemy/StoreZed' }],
    metrics: [
      { value: '0', label: 'balance mismatches after the ledger rewrite' },
      { value: '3x', label: 'faster checkout API after caching' },
    ],
    cover: img.financeApp,
    gallery: [img.checkout, img.laptopPhone],
    body: `## The problem

Merchants were reconciling sales against payouts by hand. Balances drifted because the wallet was a single number on a user row, updated from several places.

## What I built

I replaced the balance column with a double-entry ledger. Every movement of money is two rows that must sum to zero, and a wallet balance is simply a query over those rows.

\`\`\`python
def transfer(debit: Account, credit: Account, amount: Decimal, ref: str) -> None:
    with db.transaction():
        Entry.create(account=debit, amount=-amount, reference=ref)
        Entry.create(account=credit, amount=amount, reference=ref)
\`\`\`

- Idempotent payment webhooks keyed on the provider reference
- Payouts queued and retried with backoff, never fired twice
- Daily reconciliation report comparing the ledger with the payment provider

## Outcome

Support tickets about missing money stopped. Finance could close the month from one report instead of three spreadsheets.`,
    featured: true,
    published: true,
    sortOrder: 2,
  },
  {
    id: 'seed-revenue-insights',
    slug: 'revenue-insights',
    title: 'Revenue Insights',
    summary: 'A reporting layer that replaced five weekly spreadsheets with one dashboard the leadership team trusts.',
    role: 'Data and BI engineer',
    client: 'Logistics company, Lagos',
    year: 2024,
    tags: ['Data', 'BI'],
    stack: ['SQL', 'Python', 'PostgreSQL', 'Metabase'],
    links: [],
    metrics: [
      { value: '5 to 1', label: 'weekly reports consolidated' },
      { value: 'Daily', label: 'refresh, previously weekly' },
    ],
    cover: img.dashboardDark,
    gallery: [img.dashboardTiles, img.chartPaper],
    body: `## The problem

Every Monday, three people spent half a day merging exports into spreadsheets. By the time leadership saw the numbers they were a week old, and nobody agreed on what "revenue" meant.

## What I built

- A small warehouse in PostgreSQL fed nightly from the operations database and the accounting tool
- A shared set of metric definitions, written down and reviewed with finance before any chart was built
- A dashboard per audience: leadership, operations and sales, each answering the questions that team actually asks

## Decisions worth noting

The hard part was not the tooling. It was agreeing on definitions. I ran two short workshops to settle what counts as a delivered order and when revenue is recognised, then encoded those rules in SQL views so every chart uses the same logic.

## Outcome

The Monday spreadsheet ritual ended, and the weekly leadership meeting now starts from the dashboard.`,
    featured: true,
    published: true,
    sortOrder: 3,
  },
  {
    id: 'seed-chatcommerce',
    slug: 'chatcommerce',
    title: 'ChatCommerce',
    summary: 'Selling inside WhatsApp: catalogue, cart and payment links in a chat thread, with an AI assistant answering product questions.',
    role: 'Full-stack engineer',
    client: 'Own product',
    year: 2026,
    tags: ['AI', 'Commerce'],
    stack: ['TypeScript', 'Node.js', 'WhatsApp Cloud API', 'Claude', 'PostgreSQL'],
    links: [{ label: 'Source', url: 'https://github.com/zeddyemy/ChatCommerce' }],
    metrics: [],
    cover: img.laptopPhone,
    gallery: [img.typing],
    body: `## The problem

Many small sellers already run their business on WhatsApp. They lose sales answering the same questions late at night and copying prices by hand.

## What I built

A WhatsApp assistant connected to the seller's catalogue. It answers product questions from real stock data, builds a cart in the conversation and sends a payment link. When it is not sure, it hands the chat to a human.

- Retrieval over the catalogue, so answers quote real prices and stock
- Strict tool calls for cart actions, never free-text guesses
- An evaluation set of real customer questions, run on every prompt change

## Status

In private testing with a handful of sellers.`,
    featured: false,
    published: true,
    sortOrder: 4,
  },
  {
    id: 'seed-quas',
    slug: 'quas',
    title: 'QUAS',
    summary: 'An open-source Flask starter and utility kit for standing up production-ready APIs in hours instead of days.',
    role: 'Author and maintainer',
    client: 'Open source',
    year: 2023,
    tags: ['Open source', 'Developer tools'],
    stack: ['Python', 'Flask', 'SQLAlchemy', 'Docker'],
    links: [
      { label: 'Source', url: 'https://github.com/zeddyemy/QUAS' },
      { label: 'Utilities', url: 'https://github.com/zeddyemy/quas-utils' },
    ],
    metrics: [],
    cover: img.pythonCode,
    gallery: [img.codeClose],
    body: `## Why it exists

I kept rebuilding the same foundation for every Flask API: auth, config, error handling, pagination, logging. QUAS packages those decisions once.

## What is inside

- App factory with environment-based config
- JWT auth, role checks and consistent JSON error responses
- Pagination and filtering helpers for SQLAlchemy queries
- Docker setup for local development and deployment

\`\`\`python
@bp.get("/orders")
@roles_required("admin")
def list_orders():
    return paginate(Order.query.order_by(Order.created_at.desc()))
\`\`\``,
    featured: false,
    published: true,
    sortOrder: 5,
  },
  {
    id: 'seed-kyb',
    slug: 'kyb-verification',
    title: 'KYB Verification',
    summary: 'Business verification inside a merchant onboarding flow, integrating a third-party KYB API into a Laravel app.',
    role: 'Backend engineer',
    client: 'Fintech client',
    year: 2024,
    tags: ['Fintech', 'Integrations'],
    stack: ['PHP', 'Laravel', 'MySQL', 'YouVerify API'],
    links: [{ label: 'Source', url: 'https://github.com/zeddyemy/kyb' }],
    metrics: [],
    cover: img.patchPanel,
    gallery: [],
    body: `## The problem

Merchant onboarding stalled while the compliance team checked registration documents by hand.

## What I built

An automated check against the company registry during sign-up. Clear matches are approved straight away; anything ambiguous goes to a review queue with the evidence attached.

- Webhook-driven status updates, so the merchant sees progress without refreshing
- Every verification response stored for audit
- Graceful fallback to manual review when the provider is down`,
    featured: false,
    published: true,
    sortOrder: 6,
  },
]
