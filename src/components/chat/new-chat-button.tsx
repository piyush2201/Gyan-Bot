'use client';

import { useChatHistory } from '@/hooks/use-chat-history';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function NewChatButton() {
  const { createChat } = useChatHistory();
  return (
    <Button
      variant="outline"
      className="h-9"
      onClick={() => createChat([])}
    >
      <Plus className="mr-2" /> New Chat
    </Button>
  )
}
