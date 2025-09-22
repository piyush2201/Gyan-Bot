import { ChatHistory } from '@/components/chat/chat-history';
import { ChatPanel } from '@/components/chat/chat-panel';
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { NewChatButton } from '@/components/chat/new-chat-button';


export default function Home() {
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
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-8 h-8 text-primary drop-shadow-[0_0_4px_hsl(var(--primary))]"
                >
                  <path d="M17 9.5a2.5 2.5 0 0 1 0 5" />
                  <path d="M21 12a6.5 6.5 0 0 1-11.8 4.5" />
                  <path d="M3.2 16.5A6.5 6.5 0 0 1 12 7.5a6.5 6.5 0 0 1 7.2 4.5" />
                  <path d="M7 14.5a2.5 2.5 0 0 1 0-5" />
                </svg>
                <h1 className="text-2xl font-bold font-headline tracking-wider text-primary-foreground">
                  Query Bot
                </h1>
              </div>
              <NewChatButton />
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
