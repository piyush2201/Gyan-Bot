'use server';

/**
 * @fileOverview This file defines a Genkit flow for answering questions based on a provided document.
 *
 * - `answerFromDocument`: A function that takes a user query and a document (as a data URI) and returns an answer.
 * - `AnswerFromDocumentInput`: The input type for the `answerFromDocument` function.
 * - `AnswerFromDocumentOutput`: The output type for the `answerFromDocument` function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnswerFromDocumentInputSchema = z.object({
  query: z.string().describe('The user query to answer based on the document.'),
  documentDataUri: z.string().describe("The document to analyze, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type AnswerFromDocumentInput = z.infer<typeof AnswerFromDocumentInputSchema>;

const AnswerFromDocumentOutputSchema = z.object({
  answer: z.string().describe('The AI-generated answer based on the document content.'),
});
export type AnswerFromDocumentOutput = z.infer<typeof AnswerFromDocumentOutputSchema>;

export async function answerFromDocument(input: AnswerFromDocumentInput): Promise<AnswerFromDocumentOutput> {
  return answerFromDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerFromDocumentPrompt',
  input: { schema: AnswerFromDocumentInputSchema },
  output: { schema: AnswerFromDocumentOutputSchema },
  prompt: `You are an expert at analyzing documents and answering questions based on their content.

You will be given a document and a user query. Your task is to carefully read the document and provide a concise and accurate answer to the user's query based *only* on the information present in the document.

If the answer cannot be found in the document, state that clearly. Do not use any external knowledge.

Document:
{{media url=documentDataUri}}

User Query:
"{{query}}"
`,
});

const answerFromDocumentFlow = ai.defineFlow(
  {
    name: 'answerFromDocumentFlow',
    inputSchema: AnswerFromDocumentInputSchema,
    outputSchema: AnswerFromDocumentOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
