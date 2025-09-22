'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { ChatMessage, DocumentInfo } from '@/app/actions';

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  createdAt: number;
  document?: DocumentInfo | null;
}

interface ChatHistoryContextType {
  chatHistory: ChatSession[];
  activeChat: ChatSession | null;
  setActiveChat: (id: string | null) => void;
  createChat: (messages: ChatMessage[], document?: DocumentInfo | null) => void;
  updateChat: (id: string, messages: ChatMessage[], document?: DocumentInfo | null) => void;
  deleteChat: (id: string) => void;
  clearHistory: () => void;
}

const ChatHistoryContext = createContext<ChatHistoryContextType | undefined>(undefined);

const CHAT_HISTORY_STORAGE_KEY = 'querybot-chat-history';

export const ChatHistoryProvider = ({ children }: { children: ReactNode }) => {
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const createChat = useCallback((messages: ChatMessage[], document?: DocumentInfo | null) => {
    // This function is defined here but also referenced in useEffect, so we need to use useCallback and manage its dependencies.
    // It's defined before the `saveHistory` it uses, so we'll need to make sure `saveHistory` is also using useCallback.
    const newChat: ChatSession = {
      id: crypto.randomUUID(),
      messages,
      createdAt: Date.now(),
      document,
    };
    
    setChatHistory(prevHistory => {
        let updatedHistory = [...prevHistory];
        const active = prevHistory.find(c => c.id === activeChatId);

        if (active && active.messages.length === 0) {
            updatedHistory = prevHistory.map(c => c.id === activeChatId ? newChat : c);
        } else {
            updatedHistory.unshift(newChat);
        }
        
        // This is a good place to save the history
        try {
          const sortedHistory = [...updatedHistory].sort((a, b) => b.createdAt - a.createdAt);
          localStorage.setItem(CHAT_HISTORY_STORAGE_KEY, JSON.stringify(sortedHistory));
        } catch (error) {
          console.error('Failed to save chat history to localStorage', error);
        }
        
        return updatedHistory;
    });

    setActiveChatId(newChat.id);
  }, [activeChatId]);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(CHAT_HISTORY_STORAGE_KEY);
      if (storedHistory) {
        const parsedHistory = JSON.parse(storedHistory) as ChatSession[];
        setChatHistory(parsedHistory);
        if (parsedHistory.length > 0) {
            setActiveChatId(parsedHistory[0].id);
        } else {
            createChat([]);
        }
      } else {
        createChat([]);
      }
    } catch (error) {
      console.error('Failed to load chat history from localStorage', error);
      createChat([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  const saveHistory = useCallback((history: ChatSession[]) => {
    try {
      const sortedHistory = [...history].sort((a, b) => b.createdAt - a.createdAt);
      localStorage.setItem(CHAT_HISTORY_STORAGE_KEY, JSON.stringify(sortedHistory));
      setChatHistory(sortedHistory);
    } catch (error) {
      console.error('Failed to save chat history to localStorage', error);
    }
  }, []);

  const setActiveChat = useCallback((id: string | null) => {
    setActiveChatId(id);
  }, []);

  const updateChat = useCallback((id: string, messages: ChatMessage[], document?: DocumentInfo | null) => {
    const updatedHistory = chatHistory.map(chat =>
      chat.id === id ? { ...chat, messages, document: document !== undefined ? document : chat.document } : chat
    );
    saveHistory(updatedHistory);
  }, [chatHistory, saveHistory]);
  
  const deleteChat = useCallback((id: string) => {
    const updatedHistory = chatHistory.filter(chat => chat.id !== id);
    saveHistory(updatedHistory);
    if (activeChatId === id) {
        const newActiveId = updatedHistory[0]?.id ?? null;
        setActiveChatId(newActiveId);
        if (!newActiveId) {
            createChat([]);
        }
    }
  }, [chatHistory, activeChatId, saveHistory, createChat]);

  const clearHistory = useCallback(() => {
    try {
      localStorage.removeItem(CHAT_HISTORY_STORAGE_KEY);
      setChatHistory([]);
      setActiveChatId(null);
      createChat([]);
    } catch (error) {
      console.error('Failed to clear chat history from localStorage', error);
    }
  }, [createChat]);

  const activeChat = chatHistory.find(chat => chat.id === activeChatId) || null;

  return (
    <ChatHistoryContext.Provider value={{ chatHistory, activeChat, setActiveChat, createChat, updateChat, deleteChat, clearHistory }}>
      {children}
    </ChatHistoryContext.Provider>
  );
};

export const useChatHistory = (): ChatHistoryContextType => {
  const context = useContext(ChatHistoryContext);
  if (context === undefined) {
    throw new Error('useChatHistory must be used within a ChatHistoryProvider');
  }
  return context;
};
