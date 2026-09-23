import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

export const theme = extendTheme({
  config,
  breakpoints: {
    sm: '30em',
    md: '48em',
    lg: '62em',
    xl: '80em',
    '2xl': '96em',
    '3xl': '120em',
    '4xl': '150em',
  },
  colors: {
    brand: {
      50: '#f9ebef',
      100: '#f0dce0',
      200: '#e5bcc3',
      300: '#d08a98',
      400: '#b8586a',
      500: '#7a1420',
      600: '#6d101b',
      700: '#4f0d15',
      800: '#2d090d',
      900: '#180005',
    },
    accent: {
      500: '#c9a227',
    },
    ink: {
      50: '#f5f5f5',
      100: '#ececec',
      200: '#d9d9d9',
      500: '#1f1f1f',
      600: '#141414',
      700: '#0f0f0f',
    },
  },
  fonts: {
    heading: 'var(--font-sans)',
    body: 'var(--font-sans)',
    mono: 'var(--font-sans)',
    brand: 'var(--font-sans)',
  },
  fontWeights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  styles: {
    global: (props: any) => {
      const colorMode = props.colorMode ?? 'dark'

      return {
        html: {
          fontSize: '16px',
          scrollBehavior: 'smooth',
        },
        body: {
          bg: colorMode === 'dark' ? 'var(--bg)' : 'var(--bg)',
          color: colorMode === 'dark' ? 'var(--text)' : 'var(--text)',
          backgroundImage: colorMode === 'dark'
            ? 'radial-gradient(circle at top, rgba(122,20,32,0.17), transparent 35%), linear-gradient(135deg, rgba(201,162,39,0.08), transparent 40%)'
            : 'radial-gradient(circle at top, rgba(122,20,32,0.12), transparent 35%), linear-gradient(135deg, rgba(201,162,39,0.05), transparent 40%)',
          backgroundAttachment: 'fixed',
          transition: 'background-color 0.2s ease, color 0.2s ease',
          minHeight: '100dvh',
          fontFamily: 'var(--font-sans)',
          fontWeight: 400,
          lineHeight: 1.7,
          letterSpacing: 0,
        },
        'h1, h2': {
          fontFamily: 'var(--font-sans)',
          letterSpacing: '0.025em',
          lineHeight: 0.98,
          fontWeight: 700,
          textTransform: 'uppercase',
        },
        'h1': {
          fontSize: 'clamp(3.6rem, 12vw, 10.5rem)',
          fontWeight: 700,
        },
        'h2': {
          fontSize: 'clamp(2.4rem, 6vw, 5rem)',
          fontWeight: 700,
        },
        'h3, h4, h5, h6': {
          fontFamily: 'var(--font-sans)',
          fontWeight: 600,
          lineHeight: 1.05,
        },
        'button, nav a, label': {
          fontFamily: 'var(--font-sans)',
          fontWeight: 500,
        },
        'input, textarea, select': {
          fontFamily: 'inherit',
          fontWeight: 400,
        },
        // No global max-width here: it squeezed list items and headline spans. Running text opts in with .bx-prose (index.css).
        'p, li, span, td, blockquote': {
          fontFamily: 'var(--font-sans)',
        },
        'strong, b': {
          fontWeight: 600,
          fontFamily: 'var(--font-sans)',
        },
        'code, pre, kbd, samp': {
          fontFamily: 'var(--font-sans)',
        },
        '#root': {
          minHeight: '100dvh',
        },
        a: {
          _hover: { textDecoration: 'none' },
        },
      }
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'brand',
      },
      baseStyle: {
        borderRadius: 0,
        fontFamily: 'var(--font-sans)',
        fontWeight: 500,
      },
      variants: {
        solid: (props: any) => props.colorScheme === 'brand' ? {
          bg: 'brand.500',
          color: 'white',
          _hover: { bg: 'brand.400', color: 'white' },
        } : {},
      },
    },
    Heading: {
      baseStyle: {
        fontFamily: 'var(--font-sans)',
        fontWeight: 700,
        letterSpacing: '0.025em',
        lineHeight: 0.98,
        textTransform: 'uppercase',
      },
    },
    Text: {
      baseStyle: {
        fontFamily: 'var(--font-sans)',
        fontWeight: 400,
      },
    },
    FormLabel: {
      baseStyle: {
        fontFamily: 'var(--font-sans)',
        fontWeight: 500,
      },
    },
    Card: {
      baseStyle: {
        container: { borderRadius: 0, bg: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'none' },
      },
    },
    // Site palette for Chakra's pop-ups, so none of them fall back to Chakra's slate-grey dark mode.
    Modal: {
      baseStyle: {
        overlay: { bg: 'rgba(0, 0, 0, 0.72)' },
        dialog: { bg: 'var(--surface)', color: 'var(--text)', borderRadius: 0, border: '1px solid var(--border)' },
      },
    },
    Drawer: {
      baseStyle: {
        dialog: { bg: 'var(--surface)', color: 'var(--text)' },
      },
    },
    Menu: {
      baseStyle: {
        list: { bg: 'var(--surface)', borderColor: 'var(--border)', borderRadius: 0 },
        item: { bg: 'transparent', _hover: { bg: 'var(--surface-2)' }, _focus: { bg: 'var(--surface-2)' } },
      },
    },
    Popover: {
      baseStyle: {
        content: { bg: 'var(--surface)', borderColor: 'var(--border)', borderRadius: 0 },
      },
    },
    Tooltip: {
      baseStyle: { bg: 'var(--surface-3)', color: 'var(--text)', borderRadius: 0, '--popper-arrow-bg': 'var(--surface-3)' },
    },
    Badge: {
      baseStyle: { borderRadius: 0 },
    },
  },
})
