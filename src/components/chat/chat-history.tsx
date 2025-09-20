'use client';

import { Plus, MessageSquare, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { useChatHistory } from '@/hooks/use-chat-history';
import { cn } from '@/lib/utils';

export function ChatHistory() {
  const { chatHistory, activeChat, setActiveChat, createChat, deleteChat, clearHistory } = useChatHistory();

  const handleNewChat = () => {
    createChat([]); // Creates an empty chat
  };
  
  const handleDeleteChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    deleteChat(chatId);
  }

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <h2 className="text-lg font-semibold font-headline">History</h2>
        </div>
        <Button
          variant="outline"
          className="w-full justify-start h-9"
          onClick={handleNewChat}
        >
          <Plus className="mr-2" /> New Chat
        </Button>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {chatHistory.map((chat) => (
            <SidebarMenuItem key={chat.id}>
              <div className="relative group/item flex items-center">
                <SidebarMenuButton
                  className="w-full justify-start"
                  isActive={chat.id === activeChat?.id}
                  onClick={() => setActiveChat(chat.id)}
                >
                  <MessageSquare className="shrink-0" />
                  <span className="truncate flex-1">
                    {chat.messages[0]?.content ?? 'New Chat'}
                  </span>
                </SidebarMenuButton>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover/item:opacity-100"
                  onClick={(e) => handleDeleteChat(e, chat.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <Button variant="destructive" onClick={clearHistory}>
            <Trash2 className="mr-2" /> Clear History
        </Button>
      </SidebarFooter>
    </>
  );
}
