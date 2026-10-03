import { defineConfig } from 'vitepress'
import container from 'markdown-it-container'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

// Page order for the top-level reference pages; anything else in the
// sidebar is discovered from the filesystem at config-eval time so new
// generated pages are picked up automatically.
const PAGE_ORDER: [string, string][] = [
  ['index', 'Overview'],
  ['architecture', 'Architecture'],
  ['availability-matrix', 'Availability matrix'],
  ['state-variables', 'State variables'],
  ['events', 'Events'],
  ['errors', 'Errors'],
  ['uri-formats', 'URI formats'],
  ['payload-formats', 'Payload formats'],
  ['http-api', 'HTTP / non-SOAP'],
  ['muse-api', 'muse API (v1)'],
  ['firmware-differences', 'Firmware differences'],
  ['artifacts', 'Firmware artifacts'],
  ['muse_spec_streams', 'Muse spec streams'],
  ['subsystems', 'Subsystems'],
]

const SERVICES_DIR = join(__dirname, '..', 'services')

function serviceLabel(file: string, slug: string): string {
  try {
    const head = readFileSync(join(SERVICES_DIR, file), 'utf8').slice(0, 4096)
    const m = head.match(/^#\s+`?([A-Za-z]+)/m)
    if (m) return m[1]
  } catch {}
  return slug
}

const BASE = '/anacapad-internals/'

function buildSidebar() {
  const pages = PAGE_ORDER
    .filter(([slug]) => slug !== 'index')
    .map(([slug, label]) => ({ text: label, link: `/${slug}` }))

  let services: { text: string; link: string }[] = []
  try {
    services = readdirSync(SERVICES_DIR)
      .filter(f => f.endsWith('.md'))
      .sort()
      .map(f => {
        const slug = f.slice(0, -3)
        return { text: serviceLabel(f, slug), link: `/services/${slug}` }
      })
  } catch {}

  return [
    { text: 'Reference', items: pages },
    { text: 'UPnP services', collapsed: true, items: services },
  ]
}

export default defineConfig({
  title: 'anacapad internals',
  description:
    'Reverse-engineered internals of the Sonos anacapad daemon, build 86.10-80260 (model-9 / Playbar): SOAP/UPnP, the muse v1 REST API, native subsystems, and the firmware artifacts themselves',
  base: BASE,
  cleanUrls: true,
  srcDir: '.',
  outDir: '../site',
  cacheDir: './.vitepress/cache',
  ignoreDeadLinks: [/^files\//, /^\.\.\/files\//, /^\/files\//],
  themeConfig: {
    nav: [
      { text: 'Reference', link: '/architecture' },
      { text: 'Artifacts', link: '/artifacts' },
      { text: 'Repo', link: 'https://github.com/BookCatKid/anacapad-internals' },
    ],
    sidebar: buildSidebar(),
    search: { provider: 'local' },
    outline: { level: [2, 3], label: 'On this page' },
    docFooter: { prev: 'Previous page', next: 'Next page' },
  },
  markdown: {
    // Technical strings in the dataset contain literal <tag> text (XML
    // fragments) and some data lines even *start* with one. Turning off
    // both html rules means every stray <tag> renders as plain text and
    // nothing reaches the Vue template compiler. Real embeds go through
    // markdown constructs instead: ![]() for images and the custom
    // ::: audio container below for sound files.
    config: (md) => {
      md.disable([
        // dataset strings contain literal <tag> XML and {+0x0 ...} brace
        // records; html rules + curly attributes would feed them to the
        // Vue compiler
        'html_inline', 'html_block', 'curly_attributes',
        // do not rewrite technical text: smartquotes/replacements would
        // reintroduce typographic dashes and curly quotes, emoji would
        // eat :name: patterns, github-alerts hijacks > [!x] blockquotes
        'smartquotes', 'replacements', 'emoji', 'github-alerts',
      ])
      md.use(container, 'audio', {
        render(tokens: any[], idx: number) {
          const tok = tokens[idx]
          if (tok.nesting === 1) {
            const src = tok.info.trim().replace(/^audio\s*/, '').trim()
                .replace(/^\/+/, '')
            return `<div class="artifact-audio"><audio controls ` +
                   `preload="none" src="${BASE}${src}"></audio></div>\n`
          }
          return ''
        },
      })
    },
  },
})
