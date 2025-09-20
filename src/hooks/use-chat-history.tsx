'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { ChatMessage } from '@/app/actions';

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  createdAt: number;
}

interface ChatHistoryContextType {
  chatHistory: ChatSession[];
  activeChat: ChatSession | null;
  setActiveChat: (id: string | null) => void;
  createChat: (messages: ChatMessage[]) => void;
  updateChat: (id: string, messages: ChatMessage[]) => void;
  deleteChat: (id: string) => void;
  clearHistory: () => void;
}

const ChatHistoryContext = createContext<ChatHistoryContextType | undefined>(undefined);

const CHAT_HISTORY_STORAGE_KEY = 'gyanbot-chat-history';

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
        }
      }
    } catch (error) {
      console.error('Failed to load chat history from localStorage', error);
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

  const createChat = useCallback((messages: ChatMessage[]) => {
    const newChat: ChatSession = {
      id: crypto.randomUUID(),
      messages,
      createdAt: Date.now(),
    };
    const updatedHistory = [newChat, ...chatHistory];
    saveHistory(updatedHistory);
    setActiveChatId(newChat.id);
  }, [chatHistory, saveHistory]);

  const updateChat = useCallback((id: string, messages: ChatMessage[]) => {
    const updatedHistory = chatHistory.map(chat =>
      chat.id === id ? { ...chat, messages } : chat
    );
    saveHistory(updatedHistory);
  }, [chatHistory, saveHistory]);
  
  const deleteChat = useCallback((id: string) => {
    const updatedHistory = chatHistory.filter(chat => chat.id !== id);
    saveHistory(updatedHistory);
    if (activeChatId === id) {
        setActiveChatId(updatedHistory[0]?.id ?? null);
    }
  }, [chatHistory, activeChatId, saveHistory]);

  const clearHistory = useCallback(() => {
    saveHistory([]);
    setActiveChatId(null);
  }, [saveHistory]);

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
