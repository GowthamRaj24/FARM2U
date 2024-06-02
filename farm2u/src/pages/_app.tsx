import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { useEffect } from 'react';
import TagManager from 'react-gtm-module'
export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    TagManager.initialize({ gtmId: `${process.env.NEXT_PUBLIC_gtmId}` });
}, []);
  return (
  <SessionProvider>
    <Component {...pageProps} />
    </SessionProvider>)
}
