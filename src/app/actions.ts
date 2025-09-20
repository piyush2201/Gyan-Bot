'use server';

import { generateResponse } from '@/ai/flows/generate-conversational-response';
import { retrieveRelevantFAQs } from '@/ai/flows/retrieve-relevant-faqs';
import { answerFromDocument } from '@/ai/flows/answer-from-document';


export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatState {
  messages: ChatMessage[];
  error?: string;
}

export async function submitQuery(
  previousState: ChatState,
  formData: FormData
): Promise<ChatState> {
  const query = formData.get('query') as string;
  const fileDataUri = formData.get('fileDataUri') as string;

  if (!query) {
    return {
      messages: previousState.messages,
      error: 'Please enter a query.',
    };
  }

  const userMessage: ChatMessage = {
    id: crypto.randomUUID(),
    role: 'user',
    content: query,
    timestamp: Date.now(),
  };

  try {
    let aiResponse;

    if (fileDataUri) {
      aiResponse = await answerFromDocument({
        query,
        documentDataUri: fileDataUri,
      });
    } else {
      const relevantFAQs = await retrieveRelevantFAQs(query);
      const faqContent = relevantFAQs.join('\n');
      aiResponse = await generateResponse({
        query,
        faqContent,
      });
    }
    
    const responseContent = (aiResponse as any).response || (aiResponse as any).answer;

    if (!responseContent) {
      throw new Error('AI failed to generate a response.');
    }

    const assistantMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: responseContent,
      timestamp: Date.now(),
    };
    
    return {
      messages: [...previousState.messages, userMessage, assistantMessage],
    };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    
    // Return the user message in the history even on error, for better UX
    return {
      messages: [...previousState.messages, userMessage],
      error: `Sorry, something went wrong. ${errorMessage}`,
    };
  }
}
