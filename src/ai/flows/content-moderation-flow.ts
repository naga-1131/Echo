// src/ai/flows/content-moderation-flow.ts
'use server';

/**
 * @fileOverview AI-powered content moderation flow to identify and flag posts violating community guidelines.
 *
 * - moderateContent - A function that moderates content and flags posts that violate guidelines.
 * - ModerateContentInput - The input type for the moderateContent function.
 * - ModerateContentOutput - The return type for the moderateContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ModerateContentInputSchema = z.object({
  text: z
    .string()
    .describe('The text content of the post to be moderated.'),
  mediaUrl: z
    .string()
    .optional()
    .describe('The URL of the media (photo/video) associated with the post, if any.'),
});

export type ModerateContentInput = z.infer<typeof ModerateContentInputSchema>;

const ModerateContentOutputSchema = z.object({
  flagged: z.boolean().describe('Whether the content is flagged as violating community guidelines.'),
  reason: z.string().describe('The reason for flagging the content, if applicable.'),
});

export type ModerateContentOutput = z.infer<typeof ModerateContentOutputSchema>;

export async function moderateContent(input: ModerateContentInput): Promise<ModerateContentOutput> {
  return moderateContentFlow(input);
}

const moderateContentPrompt = ai.definePrompt({
  name: 'moderateContentPrompt',
  input: {schema: ModerateContentInputSchema},
  output: {schema: ModerateContentOutputSchema},
  prompt: `You are a content moderator for an eco-social networking platform. Your task is to review user-generated content and determine if it violates community guidelines related to harmful environmental practices or misinformation.

Community Guidelines:
- Content promoting deforestation, illegal logging, or unsustainable agriculture is prohibited.
- Content spreading misinformation about climate change or other environmental issues is not allowed.
- Content that incites violence or hatred towards individuals or groups based on their environmental advocacy is unacceptable.

Review the following content and determine if it violates any of the above guidelines. Provide a detailed reason if the content is flagged.

Content: {{{text}}}
{{#if mediaUrl}}
Media: {{media url=mediaUrl}}
{{/if}}`,
});

const moderateContentFlow = ai.defineFlow(
  {
    name: 'moderateContentFlow',
    inputSchema: ModerateContentInputSchema,
    outputSchema: ModerateContentOutputSchema,
  },
  async input => {
    const {output} = await moderateContentPrompt(input);
    return output!;
  }
);
