import type { Metadata, Viewport } from 'next'
import { Chakra_Petch } from 'next/font/google'
import type { ReactNode } from 'react'
import '../styles/reset.css'
import '../index.css'
import '../styles/motion.css'
import '../styles/site.css'
import '../styles/home.css'
import '../styles/about.css'
import '../styles/partners.css'
import { SiteLayoutTemplate } from '../components/templates/SiteLayoutTemplate'
import { AppErrorBoundary } from '../components/providers/AppErrorBoundary'
import { siteName } from '../config/site'
import { PlayerProvider } from '../context/PlayerContext'

// Self-hosted by Next.js at build time (no request to Google from visitors), preloaded, no layout shift.
// Light (300) is not used anywhere, so only 400–700 are loaded.
const chakraPetch = Chakra_Petch({ subsets: ['latin'], weight: ['400', '500', '600', '700'], display: 'swap', variable: '--font-chakra-petch' })

export const metadata: Metadata = {
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: 'Bloodlust Philippines: a Philippine esports organization recruiting CODM and Honor of Kings players.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0707',
  colorScheme: 'dark',
}

// Runs before first paint: marks the page as JS-enabled so ScrollReveal can hide content until it animates in.
const bootstrap = "document.documentElement.classList.add('js')"

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="dark" className={chakraPetch.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootstrap }} />
      </head>
      <body suppressHydrationWarning>
        <noscript>
          <style>{'.reveal,[data-reveal]{opacity:1!important;transform:none!important;visibility:visible!important;clip-path:none!important}'}</style>
        </noscript>
        {/* #root is kept because index.css styles and animates it. */}
        <div id="root">
          <PlayerProvider>
            <AppErrorBoundary>
              <SiteLayoutTemplate>{children}</SiteLayoutTemplate>
            </AppErrorBoundary>
          </PlayerProvider>
        </div>
      </body>
    </html>
  )
}
