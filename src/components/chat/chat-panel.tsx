'use client';

import { useEffect, useRef, useActionState, useState, startTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { Send, Bot, LoaderCircle, Paperclip, X } from 'lucide-react';
import { submitQuery, type ChatState, type ChatMessage as ChatMessageType } from '@/app/actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { useChatHistory } from '@/hooks/use-chat-history';
import { ChatMessage } from './chat-message';
import { Badge } from '@/components/ui/badge';

// Sub-component to use useFormStatus for the message list
function ChatArea({ messages }: { messages: ChatMessageType[] }) {
  const { pending } = useFormStatus();
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTo({
        top: viewportRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, pending]);

  return (
    <ScrollArea className="h-full" viewportRef={viewportRef}>
      <div className="p-4 sm:p-6 space-y-6">
        {messages.length === 0 && !pending && (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground pt-16">
            <Bot className="w-16 h-16 mb-4 text-primary/50" />
            <p className="text-lg">GyanBot at your service</p>
            <p>Start a new conversation or upload a document.</p>
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
  const { activeChat, updateChat, createChat } = useChatHistory();
  
  const initialState: ChatState = activeChat ? {
    messages: activeChat.messages,
    document: activeChat.document
  } : {
    messages: [],
    document: null
  };

  const [state, formAction] = useActionState(submitQuery, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileDataUri, setFileDataUri] = useState<string | null>(null);
  
  // This effect will sync the form's state with the active chat from history
  useEffect(() => {
    const newInitialState: ChatState = { messages: activeChat?.messages ?? [], document: activeChat?.document };
    // This is a bit of a hack to reset the useActionState's internal state
    // when the active chat changes. We wrap it in startTransition to avoid the warning.
    startTransition(() => {
        formAction(newInitialState);
    });

    if (inputRef.current) {
      inputRef.current.value = '';
    }
    
    // If the active chat has a document, reflect it in the local file state
    if (activeChat?.document) {
        setFile({ name: activeChat.document.name } as File);
        setFileDataUri(activeChat.document.dataUri);
    } else {
        setFile(null);
        setFileDataUri(null);
    }
  }, [activeChat]);


  useEffect(() => {
    // When the form action returns a new state, update the history
    if (state.messages.length > (activeChat?.messages.length ?? 0)) {
        if (!activeChat || (state.messages.length === 1 && !activeChat.messages.length)) { // New chat or first message in a new chat
            createChat(state.messages, state.document);
        } else { // Existing chat
            updateChat(activeChat.id, state.messages, state.document);
        }
    }
  }, [state.messages, state.document]);


  useEffect(() => {
    if (formRef.current && state.messages.length > 0) {
        // Reset form on successful assistant response, but keep file info if a new file wasn't just uploaded.
        if (!state.error && state.messages.at(-1)?.role === 'assistant') {
            const isNewFileUpload = !!(formRef.current.querySelector('input[name="fileDataUri"]') as HTMLInputElement)?.value;
            formRef.current.reset();

            // If we are not in a new file upload, don't clear the file state
            // to allow follow-up questions.
            if(isNewFileUpload) {
              setFile(null);
              setFileDataUri(null);
            }
            if(inputRef.current) inputRef.current.focus();
        }
    }
  }, [state.messages, state.error]);

  useEffect(() => {
    if (state.error && state.messages.length > (activeChat?.messages.length ?? 0)) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.error,
      });
    }
  }, [state.error, state.messages.length, activeChat?.messages.length]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        setFileDataUri(loadEvent.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    setFile(null);
    setFileDataUri(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
    // Also update the chat history if there was an active document
    if (activeChat && activeChat.document) {
        updateChat(activeChat.id, activeChat.messages, null);
    }
  }

  // Use the file state, which could be from a new upload or from the chat history
  const currentFile = file || (state.document ? {name: state.document.name} as File : null);

  return (
    <div className="w-full max-w-4xl h-full flex flex-col bg-card rounded-lg border border-border shadow-lg shadow-black/30">
        <form ref={formRef} action={formAction} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto">
            <ChatArea messages={state.messages} />
          </div>
          <div className="p-4 border-t border-border bg-background/50 rounded-b-lg">
            {currentFile && (
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="pl-2">
                    <span className="truncate max-w-xs">{currentFile.name}</span>
                    <Button variant="ghost" size="icon" className="h-5 w-5 ml-1" onClick={removeFile}>
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove file</span>
                    </Button>
                </Badge>
              </div>
            )}
            <div className="flex w-full items-center space-x-2">
              <input type="hidden" name="fileDataUri" value={fileDataUri || ''} />
              <input type="hidden" name="fileName" value={file?.name || ''} />
              <Input
                ref={inputRef}
                name="query"
                placeholder="Type your question here..."
                className="flex-1 bg-input text-base focus-visible:ring-primary"
                autoComplete="off"
                required
              />
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="application/pdf,text/plain,.md" />
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={handleFileButtonClick}
                className="group shrink-0"
                disabled={!!currentFile} // Disable adding a new file if one is already attached
              >
                <Paperclip className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                <span className="sr-only">Attach file</span>
              </Button>
              <SubmitButton />
            </div>
          </div>
        </form>
    </div>
  );
}
