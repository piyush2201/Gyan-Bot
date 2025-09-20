import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ChatHistoryProvider } from '@/hooks/use-chat-history';

export const metadata: Metadata = {
  title: 'GyanBot',
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ChatHistoryProvider>
          {children}
        </ChatHistoryProvider>
        <Toaster />
      </body>
    </html>
  );
}
