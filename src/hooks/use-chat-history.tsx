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

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(CHAT_HISTORY_STORAGE_KEY);
      if (storedHistory) {
        const parsedHistory = JSON.parse(storedHistory) as ChatSession[];
        setChatHistory(parsedHistory);
        if (parsedHistory.length > 0) {
            // Set the most recent chat as active by default
            setActiveChatId(parsedHistory[0].id);
        } else {
            // If history is empty, create a new empty chat
            createChat([]);
        }
      } else {
        createChat([]);
      }
    } catch (error) {
      console.error('Failed to load chat history from localStorage', error);
      createChat([]);
    }
  }, []);

  const saveHistory = useCallback((history: ChatSession[]) => {
    try {
      // Sort by creation date, newest first
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

  const createChat = useCallback((messages: ChatMessage[], document?: DocumentInfo | null) => {
    // If there's already an empty chat and we are trying to create another empty one, just set it as active.
    if (chatHistory.length > 0 && chatHistory[0].messages.length === 0 && messages.length === 0) {
        setActiveChatId(chatHistory[0].id);
        return;
    }
      
    const newChat: ChatSession = {
      id: crypto.randomUUID(),
      messages,
      createdAt: Date.now(),
      document,
    };
    
    let updatedHistory = [...chatHistory];
    const active = chatHistory.find(c => c.id === activeChatId);

    if (active && active.messages.length === 0) {
        // If the current active chat is empty, replace it.
        updatedHistory = chatHistory.map(c => c.id === activeChatId ? newChat : c);
    } else {
        updatedHistory.unshift(newChat);
    }
    
    saveHistory(updatedHistory);
    setActiveChatId(newChat.id);
  }, [chatHistory, activeChatId, saveHistory]);

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
            // If no chats are left, create a new empty one
            createChat([]);
        }
    }
  }, [chatHistory, activeChatId, saveHistory, createChat]);

  const clearHistory = useCallback(() => {
    try {
      localStorage.removeItem(CHAT_HISTORY_STORAGE_KEY);
      setChatHistory([]);
      setActiveChatId(null);
      // After clearing, create a new empty chat to start with.
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
