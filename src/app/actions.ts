'use server';

import { generateResponse } from '@/ai/flows/generate-conversational-response';
import { answerFromDocument } from '@/ai/flows/answer-from-document';
import { translateText } from '@/ai/flows/translate-text';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface DocumentInfo {
  name: string;
  dataUri: string;
}

export interface ChatState {
  messages: ChatMessage[];
  document?: DocumentInfo | null;
  error?: string;
}

export async function submitQuery(
  previousState: ChatState,
  formData: FormData | ChatState
): Promise<ChatState> {
  if (!(formData instanceof FormData)) {
    return formData;
  }
  
  const query = formData.get('query') as string;
  const fileDataUri = formData.get('fileDataUri') as string;
  const fileName = formData.get('fileName') as string;
  const language = (formData.get('language') as string) || 'English';

  if (!query) {
    return {
      ...previousState,
      error: 'Please enter a query.',
    };
  }

  const userMessage: ChatMessage = {
    id: crypto.randomUUID(),
    role: 'user',
    content: query,
    timestamp: Date.now(),
  };
  
  const currentMessages = [...previousState.messages, userMessage];
  
  let currentDocument = previousState.document;
  if (fileDataUri && fileName) {
    currentDocument = { name: fileName, dataUri: fileDataUri };
  }


  try {
    let aiResponse;
    const history = currentMessages.map(m => `${m.role}: ${m.content}`).join('\n');
    const fullQuery = `CONVERSATION HISTORY:\n${history}\n\nCURRENT QUERY: ${query}`;


    if (currentDocument?.dataUri) {
      aiResponse = await answerFromDocument({
        query: fullQuery,
        documentDataUri: currentDocument.dataUri,
      });
    } else {
      aiResponse = await generateResponse({
        query: fullQuery,
      });
    }
    
    let responseContent = (aiResponse as any).answer || (aiResponse as any).response;

    if (!responseContent) {
      throw new Error('AI failed to generate a response.');
    }
    
    if (language !== 'English') {
      const translatedResponse = await translateText({ text: responseContent, targetLanguage: language });
      responseContent = translatedResponse.translatedText;
    }

    const assistantMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: responseContent,
      timestamp: Date.now(),
    };
    
    return {
      messages: [...currentMessages, assistantMessage],
      document: currentDocument,
    };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    
    return {
      messages: currentMessages,
      document: currentDocument,
      error: `Sorry, something went wrong. ${errorMessage}`,
    };
  }
}
