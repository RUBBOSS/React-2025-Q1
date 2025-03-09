import React from 'react';
import '../styles/globals.css';
import '../styles/base.css';
import { Providers } from './providers';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pokemon Explorer',
  description: 'Explore Pokemon with our interactive app'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
