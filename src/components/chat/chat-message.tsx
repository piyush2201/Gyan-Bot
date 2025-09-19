'use client';

import { Bot, User, LoaderCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { ChatMessage as ChatMessageType } from '@/app/actions';

interface ChatMessageProps {
  message: ChatMessageType;
  isLoading?: boolean;
}

export function ChatMessage({ message, isLoading = false }: ChatMessageProps) {
  const isAi = message.role === 'assistant';

  return (
    <div
      className={cn('flex items-start gap-4', {
        'justify-end': !isAi,
      })}
    >
      {isAi && (
        <Avatar className="h-8 w-8 border-primary/50">
          <AvatarFallback className="bg-primary/20">
            <Bot className="h-5 w-5 text-primary drop-shadow-[0_0_4px_hsl(var(--primary))]" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          'max-w-[75%] space-y-2 rounded-lg px-4 py-3 shadow-md',
          isAi
            ? 'bg-secondary text-secondary-foreground'
            : 'bg-primary text-primary-foreground'
        )}
      >
        {isLoading ? (
            <div className="flex items-center space-x-2">
                <LoaderCircle className="w-4 h-4 animate-spin" />
                <span>Thinking...</span>
            </div>
        ) : (
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        )}
      </div>
      {!isAi && (
        <Avatar className="h-8 w-8 border-primary/50">
          <AvatarFallback className="bg-primary/20">
            <User className="h-5 w-5 text-primary drop-shadow-[0_0_4px_hsl(var(--primary))]" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
