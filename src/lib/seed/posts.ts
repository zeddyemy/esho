/** Seed articles. Placeholder writing in the owner's voice; edit or unpublish in the admin. */
import { img } from '@/lib/seed/images'
import type { Post } from '@/types'

export const seedPosts: Array<Post> = [
  {
    id: 'seed-post-ledger',
    slug: 'never-store-a-balance',
    title: 'Never store a balance',
    excerpt: 'Why every wallet I build now uses a double-entry ledger, and the five lines of code that make it work.',
    cover: img.financeApp,
    tags: ['Fintech', 'Databases'],
    published: true,
    publishedAt: '2026-08-14T09:00:00.000Z',
    readingMinutes: 4,
    updatedAt: '2026-10-22T00:00:00.000Z',
    body: `The first wallet I built stored the balance as a number on the user row. It worked until two requests updated it at the same time, and a customer was briefly richer than they should have been.

## Balances are a query, not a column

In a double-entry ledger, every movement of money writes two entries that sum to zero. A balance is never stored. It is calculated from the entries.

\`\`\`sql
select coalesce(sum(amount), 0) as balance
from ledger_entries
where account_id = $1;
\`\`\`

That one decision removes a whole class of bugs. You cannot forget to update the balance, because there is nothing to update.

## What you get for free

- **An audit trail.** Every change has a reference, a time and a counterpart.
- **Reconciliation.** Totals per account should match the payment provider. When they do not, you know exactly which day to look at.
- **Safe retries.** Make the reference unique and a replayed webhook simply fails to insert.

## When it is overkill

If nothing in your product holds value between transactions, you do not need this. The moment users can top up, hold or withdraw, you do.`,
  },
  {
    id: 'seed-post-dashboards',
    slug: 'a-dashboard-is-a-decision',
    title: 'A dashboard is a decision, not a chart',
    excerpt: 'Most dashboards fail before the first query. Start with the decision someone needs to make on Monday morning.',
    cover: img.dashboardTiles,
    tags: ['Data', 'BI'],
    published: true,
    publishedAt: '2026-06-02T09:00:00.000Z',
    readingMinutes: 3,
    updatedAt: '2026-10-22T00:00:00.000Z',
    body: `I have built dashboards nobody opened. They were accurate, fast and quite pretty. They just did not help anyone decide anything.

## Start from the meeting

Before touching data, I ask one question: **what decision will this help you make, and when?** If the answer is "the Monday ops meeting, deciding which routes need more riders", the dashboard has a clear job.

## Agree on definitions first

Revenue, active customer, delivered order. Every team has a slightly different meaning for each. Write the definitions down, get them signed off, then encode them once in SQL views that every chart reuses.

## Fewer charts, clearer owners

A good dashboard has a handful of numbers and a named person who acts on each one. Everything else belongs in an ad-hoc report.`,
  },
  {
    id: 'seed-post-ai-agents',
    slug: 'shipping-with-ai-in-the-loop',
    title: 'Shipping with AI in the loop',
    excerpt: 'How I use coding agents day to day without losing track of what the code actually does.',
    cover: img.typing,
    tags: ['AI', 'Process'],
    published: true,
    publishedAt: '2026-09-20T09:00:00.000Z',
    readingMinutes: 4,
    updatedAt: '2026-10-22T00:00:00.000Z',
    body: `AI agents write a meaningful share of my code now. They have not made me less careful. They have changed where the care goes.

## Plans before prompts

For anything bigger than a small fix, I write a short plan first: the goal, the files involved, what done looks like. The agent works from the plan, and the plan becomes documentation.

## Small, verifiable steps

I ask for one change at a time and run the type checker, tests and build after each. An agent that can verify its own work is far more useful than one that writes a lot of code quickly.

## I still read every diff

Generated code is still my code. If I cannot explain a change in review, it does not ship.

## Where it shines

Boilerplate, migrations between library versions, test scaffolding and first drafts of admin screens. Where it needs the most supervision: security boundaries, money and anything involving time zones.`,
  },
]
