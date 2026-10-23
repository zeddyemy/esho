/**
 * Default site settings and page copy. Used to seed the database and as a
 * per-section fallback if a row is missing. Everything here is editable in
 * the admin; facts marked "placeholder" in brain.md must be confirmed.
 */
import { DEFAULT_APPEARANCE } from '@/lib/appearance'
import { img } from '@/lib/seed/images'
import type {
  AboutContent,
  ContactContent,
  HomeContent,
  PageHeaderContent,
  SiteSettings,
} from '@/types'

export const seedSettings: SiteSettings = {
  brandName: 'Esho',
  ownerName: 'Emmanuel Olowu',
  roleTitle: 'Senior full-stack product engineer',
  tagline: 'Product engineering, from schema to screen.',
  logo: null,
  portrait: img.portrait,
  availability: 'Taking on new projects from January 2027',
  openToWork: true,
  email: 'zeddyemy@gmail.com',
  phones: [],
  whatsapp: '',
  location: 'Lagos, Nigeria',
  socials: {
    github: 'https://github.com/zeddyemy',
    linkedin: 'https://www.linkedin.com/in/emmanuel-olowu',
    x: 'https://x.com/EmmanuelZeddy',
  },
  resume: null,
  footerNote: 'Designed and built by Emmanuel Olowu in Lagos.',
  showWriting: true,
  showTestimonials: true,
  showResume: true,
  appearance: DEFAULT_APPEARANCE,
  seo: {
    title: 'Esho | Emmanuel Olowu, full-stack product engineer',
    description:
      'Emmanuel Olowu is a senior full-stack product engineer in Lagos, designing, building and shipping web products, data systems and AI-assisted tools.',
    image: null,
  },
}

export const seedHome: HomeContent = {
  hero: {
    headline: 'Product engineering, from schema to screen.',
    subheadline:
      'I design, build and ship web products, data systems and AI-assisted tools for teams that need them to hold up.',
    primaryCta: 'Start a project',
    secondaryCta: 'See the work',
  },
  intro: {
    statement:
      'Most of my work sits where product, engineering and business meet. I care about the data model as much as the button, and about whether the numbers on the dashboard are true.',
    body: 'I have shipped commerce platforms, fintech onboarding, content systems and analytics for teams in Nigeria and the UK. A background in business information systems means I ask what a feature is worth before I ask how to build it.',
  },
  capabilities: {
    heading: 'Where I am most useful',
    items: [
      {
        title: 'Product engineering',
        body: 'Taking an idea from a rough brief to a product people pay for, with the design, frontend and backend built as one thing.',
        points: ['Discovery and scoping', 'Design systems', 'Web and mobile apps'],
        image: img.wireframing,
      },
      {
        title: 'Platforms and APIs',
        body: 'Backends that stay calm under load: payments, wallets, integrations and the boring parts that hold money.',
        points: ['API design', 'Payments and ledgers', 'Third-party integrations'],
        image: img.serverRack,
      },
      {
        title: 'Data and BI',
        body: 'Turning scattered spreadsheets into one source of truth, then into dashboards people actually open.',
        points: ['Data modelling', 'Reporting pipelines', 'Dashboards'],
        image: img.dashboardDark,
      },
      {
        title: 'AI-assisted delivery',
        body: 'Using AI where it earns its place, in the product and in how the team ships, with evals instead of vibes.',
        points: ['LLM features', 'Agents and automation', 'Faster delivery'],
        image: null,
      },
    ],
  },
  cta: {
    heading: 'Have something worth building?',
    body: 'Tell me what you are working on. I reply to every message within two working days.',
  },
}

export const seedAbout: AboutContent = {
  heading: 'Engineer by trade, analyst by habit.',
  lead: 'I am Emmanuel Olowu, a senior full-stack product engineer based in Lagos. I build software end to end and stay with it after launch.',
  story: [
    'I started out building websites for small businesses, which taught me early that software only matters if it moves something for the person paying for it.',
    'Since then I have worked across the stack and across industries: commerce, fintech, logistics and media. I am as comfortable designing a Postgres schema as I am tuning an animation, and I pick tools for the problem rather than the other way round.',
    'Alongside engineering I am studying Information Technology and Business Information Systems at Middlesex University London. It shapes how I work: I want to know the business question before writing the first line, and I want the data to prove the answer.',
  ].join('\n\n'),
  image: img.portraitAlt,
  facts: [
    { label: 'Based in', value: 'Lagos, working worldwide' },
    { label: 'Focus', value: 'Product, platforms, data' },
    { label: 'Studying', value: 'BSc (Hons) IT & BIS, Middlesex University London' },
    { label: 'Building since', value: '2019' },
  ],
  principles: [
    { title: 'Start with the question', body: 'Every build begins with what the business needs to learn or earn. Features follow.' },
    { title: 'Boring where it counts', body: 'Money, auth and data get proven tools. Novelty goes where users can feel it.' },
    { title: 'Ship, then measure', body: 'Small releases, real usage numbers, and changes based on what people actually do.' },
    { title: 'Leave it better documented', body: 'The next engineer, or the next me, should not need to guess.' },
  ],
}

export const seedContact: ContactContent = {
  heading: 'Start a project',
  body: 'Share a few details about what you are building. The more context, the more useful my first reply will be.',
  responseNote: 'I reply within two working days.',
  projectTypes: ['New product', 'Existing product', 'Data and dashboards', 'AI feature', 'Consulting', 'Full-time role'],
  budgets: ['Under $5k', '$5k to $15k', '$15k to $40k', '$40k and above', 'Not sure yet'],
}

export const seedWorkHeader: PageHeaderContent = {
  heading: 'Selected work',
  body: 'Products, platforms and data systems I have designed and built, with notes on the decisions behind them.',
}

export const seedWritingHeader: PageHeaderContent = {
  heading: 'Writing',
  body: 'Notes on building software, working with data, and shipping with AI in the loop.',
}
