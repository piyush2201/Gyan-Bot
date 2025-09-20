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

export interface DocumentInfo {
  name: string;
  dataUri: string;
}

export interface ChatState {
  messages: ChatMessage[];
  document?: DocumentInfo | null; // Keep track of the document in the chat
  error?: string;
}

export async function submitQuery(
  previousState: ChatState,
  formData: FormData | ChatState
): Promise<ChatState> {
  // When switching chats, formData is not a FormData object but the new ChatState.
  if (!(formData instanceof FormData)) {
    return formData; // Simply return the new state for the active chat
  }
  
  const query = formData.get('query') as string;
  const fileDataUri = formData.get('fileDataUri') as string;
  const fileName = formData.get('fileName') as string;

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
  
  // Determine if we have a document for this session
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
      const relevantFAQs = await retrieveRelevantFAQs(query);
      const faqContent = relevantFAQs.join('\n');
      aiResponse = await generateResponse({
        query: fullQuery,
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
      messages: [...currentMessages, assistantMessage],
      document: currentDocument, // Persist the document within this chat session's state
    };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    
    // Return the user message in the history even on error, for better UX
    return {
      messages: currentMessages,
      document: currentDocument,
      error: `Sorry, something went wrong. ${errorMessage}`,
    };
  }
}
