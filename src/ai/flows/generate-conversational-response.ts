// src/ai/flows/generate-conversational-response.ts
'use server';

/**
 * @fileOverview Generates conversational responses using AI, incorporating relevant FAQs.
 *
 * - generateResponse - A function that generates a conversational response based on user query and FAQs.
 * - GenerateResponseInput - The input type for the generateResponse function.
 * - GenerateResponseOutput - The return type for the generateResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateResponseInputSchema = z.object({
  query: z.string().describe('The user query to generate a response for.'),
  faqContent: z.string().describe('Relevant FAQ content to incorporate into the response.'),
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
  prompt: `You are a helpful chatbot answering user queries. Use the following FAQ content to provide an accurate and informative response to the user's query.

FAQ Content:
{{faqContent}}

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
