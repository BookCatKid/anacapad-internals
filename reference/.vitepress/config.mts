import { defineConfig } from 'vitepress'
import container from 'markdown-it-container'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

// The sidebar is discovered from the generated reference tree at
// config-eval time, so new pages gendocs.py emits are picked up
// automatically. Labels come from each file's first H1 where possible.

const ROOT = join(__dirname, '..')

function h1Label(file: string, fallback: string): string {
  try {
    const head = readFileSync(file, 'utf8').slice(0, 4096)
    const m = head.match(/^#\s+(.+)$/m)
    if (m) {
      let t = m[1].trim()
      // "State variables: `X`" / "muse resources: X" -> use the tail
      const c = t.indexOf(':')
      if (c > 0 && c < 40) t = t.slice(c + 1).trim()
      return t.replace(/^`+|`+$/g, '')
    }
  } catch {}
  return fallback
}

// items for every *.md in a dir (excluding `exclude`); link base is the
// site path for that dir
function dirItems(
  relDir: string,
  linkBase: string,
  exclude: Set<string> = new Set(),
): { text: string; link: string }[] {
  const abs = join(ROOT, relDir)
  try {
    return readdirSync(abs)
      .filter(f => f.endsWith('.md') && !exclude.has(f.slice(0, -3)))
      .sort()
      .map(f => {
        const slug = f.slice(0, -3)
        return {
          text: h1Label(join(abs, f), slug),
          link: `${linkBase}/${slug}`,
        }
      })
  } catch {
    return []
  }
}

// files inside soap/ that are topic pages rather than service pages
const SOAP_TOP = new Set([
  'index', 'events', 'errors', 'uri-formats', 'payload-formats',
  'availability-matrix', 'state-variables',
])

const BASE = '/anacapad-internals/'

function buildSidebar() {
  return [
    {
      text: 'Guide',
      items: [
        { text: 'Overview', link: '/' },
        { text: 'Architecture', link: '/architecture' },
        { text: 'Firmware differences', link: '/firmware-differences' },
      ],
    },
    {
      text: 'SOAP / UPnP',
      items: [
        { text: 'Overview', link: '/soap/' },
        {
          text: 'Services',
          collapsed: true,
          items: dirItems('soap', '/soap', SOAP_TOP),
        },
        {
          text: 'State variables',
          collapsed: true,
          items: [
            { text: 'Index', link: '/soap/state-variables' },
            ...dirItems('soap/state-variables',
                        '/soap/state-variables'),
          ],
        },
        { text: 'Events', link: '/soap/events' },
        { text: 'Errors', link: '/soap/errors' },
        { text: 'URI formats', link: '/soap/uri-formats' },
        { text: 'Payload formats', link: '/soap/payload-formats' },
        { text: 'Availability matrix', link: '/soap/availability-matrix' },
      ],
    },
    {
      text: 'muse API (v1)',
      items: [
        { text: 'Overview', link: '/muse/' },
        { text: 'Outbound client', link: '/muse/outbound' },
        {
          text: 'Resources',
          collapsed: true,
          items: dirItems('muse/resources', '/muse/resources'),
        },
        { text: 'Spec streams', link: '/muse/spec-streams' },
      ],
    },
    {
      text: 'HTTP layer',
      items: [
        { text: 'Overview', link: '/http/' },
        ...dirItems('http', '/http', new Set(['index'])),
      ],
    },
    {
      text: 'Subsystems',
      items: [
        { text: 'All subsystems', link: '/subsystems/' },
        { text: 'Open work', link: '/subsystems/open-work' },
        ...dirItems('subsystems', '/subsystems',
                    new Set(['index', 'open-work'])),
      ],
    },
    {
      text: 'Firmware artifacts',
      items: [
        { text: 'Index', link: '/artifacts/' },
        ...dirItems('artifacts', '/artifacts', new Set(['index'])),
      ],
    },
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
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${BASE}favicon.svg` }],
  ],
  themeConfig: {
    logo: { src: `${BASE}logo.svg`, alt: 'anacapad internals logo' },
    nav: [
      { text: 'SOAP', link: '/soap/' },
      { text: 'muse', link: '/muse/' },
      { text: 'Artifacts', link: '/artifacts/' },
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
