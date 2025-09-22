'use client';

import { ChatHistory } from '@/components/chat/chat-history';
import { ChatPanel } from '@/components/chat/chat-panel';
import { Sidebar, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { NewChatButton } from '@/components/chat/new-chat-button';
import { LanguageSelector } from '@/components/language-selector';
import { useLanguage } from '@/hooks/use-language';
import { translations } from '@/lib/translations';

export default function Home() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background text-foreground">
        <Sidebar>
          <ChatHistory />
        </Sidebar>
        <div className="flex flex-col flex-1">
          <header className="p-4 border-b border-border shadow-md">
            <div className="container mx-auto flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <SidebarTrigger />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-8 h-8 text-primary drop-shadow-[0_0_4px_hsl(var(--primary))]"
                >
                  <path d="M12 8V4H8" />
                  <rect width="16" height="12" x="4" y="8" rx="2" />
                  <path d="M2 14h2" />
                  <path d="M20 14h2" />
                  <path d="M15 13v2" />
                  <path d="M9 13v2" />
                </svg>
                <h1 className="text-2xl font-bold font-headline tracking-wider text-primary-foreground">
                  {t.title}
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <LanguageSelector />
                <NewChatButton />
              </div>
            </div>
          </header>
          <main className="flex-1 flex items-center justify-center p-4">
            <ChatPanel />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
