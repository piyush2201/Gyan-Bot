'use client';

import { useEffect, useRef, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Send, Bot, LoaderCircle, MapPin } from 'lucide-react';
import { submitQuery, type ChatState, type ChatMessage as ChatMessageType } from '@/app/actions';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { ChatMessage } from './chat-message';

const initialState: ChatState = {
  messages: [],
};

// Sub-component to use useFormStatus for the message list
function ChatArea({ messages }: { messages: ChatMessageType[] }) {
  const { pending } = useFormStatus();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, pending]);

  return (
    <ScrollArea className="h-full" ref={scrollAreaRef}>
      <div className="p-6 space-y-6">
        {messages.length === 0 && !pending && (
          <div className="text-center text-muted-foreground pt-16">
            <p>No messages yet. Start the conversation!</p>
          </div>
        )}
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {pending && !messages.find(m => m.id === 'loading') && (
            <ChatMessage message={{id: 'loading', role: 'assistant', content: '...', timestamp: Date.now()}} isLoading={true} />
        )}
      </div>
    </ScrollArea>
  );
}

// Sub-component to use useFormStatus for the submit button
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      size="icon"
      disabled={pending}
      aria-disabled={pending}
      className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-primary/50 group shrink-0"
    >
      {pending ? (
        <LoaderCircle className="h-5 w-5 animate-spin" />
      ) : (
        <Send className="h-5 w-5 text-primary-foreground group-hover:scale-110 transition-transform" />
      )}
      <span className="sr-only">Send message</span>
    </Button>
  );
}

export function ChatPanel() {
  const [state, formAction] = useActionState(submitQuery, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (formRef.current && state.messages.length > 0) {
        // Reset form on successful assistant response
        if (!state.error && state.messages.at(-1)?.role === 'assistant') {
            formRef.current.reset();
        }
    }
  }, [state.messages, state.error]);

  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.error,
      });
    }
  }, [state.error, state.messages.length]);

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locationQuery = `My current location is Latitude: ${latitude}, Longitude: ${longitude}. What can you tell me about this place?`;
          if (inputRef.current) {
            inputRef.current.value = locationQuery;
            formRef.current?.requestSubmit();
          }
        },
        (error) => {
          toast({
            variant: 'destructive',
            title: 'Location Error',
            description: `Could not get location: ${error.message}`,
          });
        }
      );
    } else {
      toast({
        variant: 'destructive',
        title: 'Location Error',
        description: 'Geolocation is not supported by this browser.',
      });
    }
  };

  return (
    <Card className="w-full max-w-3xl h-[80vh] flex flex-col shadow-lg shadow-black/30 border-border overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-3">
        <Bot className="w-8 h-8 text-primary drop-shadow-[0_0_4px_hsl(var(--primary))]" />
        <div>
          <CardTitle className="font-headline text-primary-foreground">GyanBot</CardTitle>
          <CardDescription>Ask me anything! I'll do my best to help.</CardDescription>
        </div>
      </CardHeader>
      <div className="flex-1 flex flex-col min-h-0">
        <form ref={formRef} action={formAction} className="flex flex-col flex-1 min-h-0">
          <CardContent className="flex-1 p-0 overflow-y-auto">
            <ChatArea messages={state.messages} />
          </CardContent>
          <CardFooter className="pt-4">
            <div className="flex w-full items-center space-x-2">
              <Input
                ref={inputRef}
                name="query"
                placeholder="Type your question here..."
                className="flex-1 bg-background text-base focus-visible:ring-primary"
                autoComplete="off"
                required
              />
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={handleLocationClick}
                className="group shrink-0"
              >
                <MapPin className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                <span className="sr-only">Get location</span>
              </Button>
              <SubmitButton />
            </div>
          </CardFooter>
        </form>
      </div>
    </Card>
  );
}
