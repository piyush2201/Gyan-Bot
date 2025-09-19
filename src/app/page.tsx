import { ChatPanel } from '@/components/chat/chat-panel';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="p-4 border-b border-border shadow-md">
        <div className="container mx-auto flex items-center gap-3">
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
          <h1 className="text-2xl font-bold font-headline tracking-wider">
            GyanBot
          </h1>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <ChatPanel />
      </main>
    </div>
  );
}
