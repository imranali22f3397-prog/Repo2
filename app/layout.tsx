import './globals.css';
import type { Metadata } from 'next';
import { Caveat } from 'next/font/google';
const caveat = Caveat({ weight: ['400', '600'], subsets: ['latin'], variable: '--font-hand', display: 'swap' });
export const metadata: Metadata = { title: 'Birthday Bloom | Make a wish come true', description: 'Create a personal birthday experience.' };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en"><head><link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin=""/><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;1,500&display=swap"/></head><body className={caveat.variable}>{children}</body></html>; }
