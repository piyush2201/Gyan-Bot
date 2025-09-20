// src/ai/flows/generate-conversational-response.ts
'use server';

/**
 * @fileOverview Generates conversational responses using AI.
 *
 * - generateResponse - A function that generates a conversational response based on user query.
 * - GenerateResponseInput - The input type for the generateResponse function.
 * - GenerateResponseOutput - The return type for the generateResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateResponseInputSchema = z.object({
  query: z.string().describe('The user query to generate a response for.'),
});
export type GenerateResponseInput = z.infer<typeof GenerateResponseInputSchema>;

const GenerateResponseOutputSchema = z.object({
  response: z.string().describe('The AI-generated conversational response.'),
});
export type GenerateResponseOutput = z.infer<typeof GenerateResponseOutputSchema>;

export async function generateResponse(input: GenerateResponseInput): Promise<GenerateResponseOutput> {
  return generateResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateResponsePrompt',
  input: {schema: GenerateResponseInputSchema},
  output: {schema: GenerateResponseOutputSchema},
  prompt: `You are a helpful and friendly chatbot named GyanBot. Your goal is to provide accurate and informative responses to user queries. You should answer any question asked.

If the user asks who made you, you must reply with: "My master Piyush Sonkar has made me with care and lots of love ❤️✨".

Use your general knowledge to provide a comprehensive and helpful response.

User Query:
{{query}}`,
});

const generateResponseFlow = ai.defineFlow(
  {
    name: 'generateResponseFlow',
    inputSchema: GenerateResponseInputSchema,
    outputSchema: GenerateResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
