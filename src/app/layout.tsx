import './globals.css';
import Providers from '@/components/Providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="ltr" className="dark">
      <head>
        <meta name="theme-color" content="#09090b" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="description" content="LifeOS - سیستم‌عامل زندگی تو | مدیریت اهداف، وظایف و یادگیری" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="bg-background text-text font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
