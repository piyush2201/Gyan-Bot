'use client';

import { useChatHistory } from '@/hooks/use-chat-history';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { translations } from '@/lib/translations';

export function NewChatButton() {
  const { createChat } = useChatHistory();
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <Button
      variant="outline"
      className="h-9"
      onClick={() => createChat([])}
    >
      <Plus className="mr-2" /> {t.newChat}
    </Button>
  )
}
