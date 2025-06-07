import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import '@/assets/styles/global.scss';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

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
  authors: [{ name: 'e-Nicko' }],
  creator: 'e-Nicko',
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
  readonly children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
