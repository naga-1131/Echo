// src/ai/flows/eco-helper-flow.ts
'use server';

/**
 * @fileOverview A conversational AI flow to act as an eco-assistant.
 *
 * - ecoHelper - A function that takes a user query and provides a helpful, eco-focused response.
 * - EcoHelperInput - The input type for the ecoHelper function.
 * - EcoHelperOutput - The return type for the ecoHelper function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const EcoHelperInputSchema = z.object({
  query: z.string().describe('The user query for the eco-assistant.'),
});

export type EcoHelperInput = z.infer<typeof EcoHelperInputSchema>;

const EcoHelperOutputSchema = z.object({
  response: z
    .string()
    .describe('The helpful, eco-focused response from the assistant.'),
});

export type EcoHelperOutput = z.infer<typeof EcoHelperOutputSchema>;

export async function ecoHelper(input: EcoHelperInput): Promise<EcoHelperOutput> {
  return ecoHelperFlow(input);
}

const ecoHelperPrompt = ai.definePrompt({
  name: 'ecoHelperPrompt',
  input: {schema: EcoHelperInputSchema},
  output: {schema: EcoHelperOutputSchema},
  prompt: `You are an AI-powered "Eco Assistant" for a social network called EchoSync. Your goal is to help users with their questions about environmental topics, sustainability, and eco-friendly living.

Provide helpful, concise, and friendly answers to the user's query. You can generate ideas for social media posts, suggest hashtags, give eco-friendly lifestyle tips, or explain complex environmental topics simply.

User Query: {{{query}}}`,
});

const ecoHelperFlow = ai.defineFlow(
  {
    name: 'ecoHelperFlow',
    inputSchema: EcoHelperInputSchema,
    outputSchema: EcoHelperOutputSchema,
  },
  async input => {
    const {output} = await ecoHelperPrompt(input);
    return output!;
  }
);
