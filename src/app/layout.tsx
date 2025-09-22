import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ChatHistoryProvider } from '@/hooks/use-chat-history';
import { LanguageProvider } from '@/hooks/use-language';

export const metadata: Metadata = {
  title: 'Query Bot',
  description: 'An AI-powered FAQ chatbot.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🤖</text></svg>"
        />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <LanguageProvider>
          <ChatHistoryProvider>
            {children}
          </ChatHistoryProvider>
        </LanguageProvider>
        <Toaster />
      </body>
    </html>
  );
}
