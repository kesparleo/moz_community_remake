import { useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import '../styles/globals.css';
import Head from 'next/head';

export default function MyApp({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light';
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return(
    <>
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </Head>

      <Component {...pageProps} theme={theme} setTheme={setTheme} />
    </>
  );
}
