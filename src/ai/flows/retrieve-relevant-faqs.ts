'use server';

/**
 * @fileOverview This file defines a Genkit flow to retrieve relevant FAQs based on a user query.
 *
 * - `retrieveRelevantFAQs`: A function that takes a user query as input and returns a list of relevant FAQs.
 * - `RetrieveRelevantFAQsInput`: The input type for the `retrieveRelevantFAQs` function, which is a simple string.
 * - `RetrieveRelevantFAQsOutput`: The output type for the `retrieveRelevantFAQs` function, which is a list of FAQ strings.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RetrieveRelevantFAQsInputSchema = z.string().describe('The user query to retrieve relevant FAQs for.');
export type RetrieveRelevantFAQsInput = z.infer<typeof RetrieveRelevantFAQsInputSchema>;

const RetrieveRelevantFAQsOutputSchema = z.array(z.string()).describe('A list of relevant FAQs based on the user query.');
export type RetrieveRelevantFAQsOutput = z.infer<typeof RetrieveRelevantFAQsOutputSchema>;

export async function retrieveRelevantFAQs(query: RetrieveRelevantFAQsInput): Promise<RetrieveRelevantFAQsOutput> {
  return retrieveRelevantFAQsFlow(query);
}

const retrieveRelevantFAQsPrompt = ai.definePrompt({
  name: 'retrieveRelevantFAQsPrompt',
  input: {schema: RetrieveRelevantFAQsInputSchema},
  output: {schema: RetrieveRelevantFAQsOutputSchema},
  prompt: `You are an expert at retrieving relevant FAQs based on user queries.

  Given the following user query:
  {{query}}

  Return a list of relevant FAQs that can help answer the query.
  Each FAQ should be a string in the list.
  The FAQs should be comprehensive and cover all aspects of the query.
  If no FAQs are relevant, return an empty list.
  Do not include any preamble or postamble text, just the list of FAQs.
  Example:
  [
    "FAQ 1: How do I reset my password?",
    "FAQ 2: What are the supported payment methods?",
    "FAQ 3: How do I contact customer support?"
  ]
  `,
});

const retrieveRelevantFAQsFlow = ai.defineFlow(
  {
    name: 'retrieveRelevantFAQsFlow',
    inputSchema: RetrieveRelevantFAQsInputSchema,
    outputSchema: RetrieveRelevantFAQsOutputSchema,
  },
  async query => {
    const {output} = await retrieveRelevantFAQsPrompt(query);
    return output!;
  }
);
