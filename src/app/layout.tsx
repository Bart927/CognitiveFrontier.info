import type { Metadata } from 'next';
import '@/assets/styles/global.scss';

export const metadata: Metadata = {
  title: 'CognitiveFrontier.info',
  description:
    'Exploring the frontier between human cognition and artificial intelligence',
  keywords: [
    'cognitive science',
    'artificial intelligence',
    'neuroscience',
    'psychology',
    'machine learning',
    'consciousness',
  ],
  authors: [{ name: 'CognitiveFrontier Team' }],
  creator: 'CognitiveFrontier Team',
  publisher: 'CognitiveFrontier.info',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://cognitivefrontier.info'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'CognitiveFrontier.info',
    description:
      'Exploring the frontier between human cognition and artificial intelligence',
    url: 'https://cognitivefrontier.info',
    siteName: 'CognitiveFrontier.info',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CognitiveFrontier.info',
    description:
      'Exploring the frontier between human cognition and artificial intelligence',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
