'use server';

/**
 * @fileOverview This file defines a Genkit flow for translating text to a specified language.
 *
 * - `translateText`: A function that takes text and a target language and returns the translated text.
 * - `TranslateTextInput`: The input type for the `translateText` function.
 * - `TranslateTextOutput`: The output type for the `translateText` function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TranslateTextInputSchema = z.object({
  text: z.string().describe('The text to be translated.'),
  targetLanguage: z.string().describe('The target language for translation (e.g., "Spanish", "French").'),
});
export type TranslateTextInput = z.infer<typeof TranslateTextInputSchema>;

const TranslateTextOutputSchema = z.object({
  translatedText: z.string().describe('The translated text.'),
});
export type TranslateTextOutput = z.infer<typeof TranslateTextOutputSchema>;

export async function translateText(input: TranslateTextInput): Promise<TranslateTextOutput> {
  return translateTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translateTextPrompt',
  input: { schema: TranslateTextInputSchema },
  output: { schema: TranslateTextOutputSchema },
  prompt: `Translate the following text into {{targetLanguage}}.

Text to translate:
"{{text}}"

Return only the translated text, with no additional commentary or explanation.
`,
});

const translateTextFlow = ai.defineFlow(
  {
    name: 'translateTextFlow',
    inputSchema: TranslateTextInputSchema,
    outputSchema: TranslateTextOutputSchema,
  },
  async (input) => {
    // For very short texts, sometimes the model replies with "The translation is: ..."
    // We can add a check here, but for now we'll assume it behaves correctly.
    const { output } = await prompt(input);
    return output!;
  }
);
