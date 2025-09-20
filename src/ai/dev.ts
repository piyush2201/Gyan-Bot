import { config } from 'dotenv';
config();

import '@/ai/flows/retrieve-relevant-faqs.ts';
import '@/ai/flows/generate-conversational-response.ts';
import '@/ai/flows/answer-from-document.ts';