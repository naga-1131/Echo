// src/ai/flows/waste-analysis-flow.ts
'use server';

/**
 * @fileOverview An AI flow to analyze photos of waste and suggest proper disposal methods.
 *
 * - analyzeWaste - A function that takes a photo of waste and returns an analysis.
 * - WasteAnalysisInput - The input type for the analyzeWaste function.
 * - WasteAnalysisOutput - The return type for the analyzeWaste function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WasteAnalysisInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a waste pile or item, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type WasteAnalysisInput = z.infer<typeof WasteAnalysisInputSchema>;

const WasteAnalysisOutputSchema = z.object({
  wasteType: z
    .string()
    .describe(
      'The primary type of waste identified in the photo (e.g., "E-Waste", "Plastic Bottles", "Organic Waste", "Construction Debris").'
    ),
  suggestion: z
    .string()
    .describe(
      'A concise, actionable suggestion for how to properly dispose of or handle the identified waste.'
    ),
});
export type WasteAnalysisOutput = z.infer<typeof WasteAnalysisOutputSchema>;

export async function analyzeWaste(input: WasteAnalysisInput): Promise<WasteAnalysisOutput> {
  return wasteAnalysisFlow(input);
}

const wasteAnalysisPrompt = ai.definePrompt({
  name: 'wasteAnalysisPrompt',
  input: {schema: WasteAnalysisInputSchema},
  output: {schema: WasteAnalysisOutputSchema},
  prompt: `You are an environmental expert specializing in waste management.
Analyze the provided photo of waste.
Identify the main type of waste visible.
Then, provide a brief, actionable suggestion for its proper disposal. For example, if it is e-waste, suggest taking it to a certified e-waste recycler. If it is plastic, suggest a recycling center.

Photo: {{media url=photoDataUri}}`,
});

const wasteAnalysisFlow = ai.defineFlow(
  {
    name: 'wasteAnalysisFlow',
    inputSchema: WasteAnalysisInputSchema,
    outputSchema: WasteAnalysisOutputSchema,
  },
  async (input) => {
    const {output} = await wasteAnalysisPrompt(input);
    return output!;
  }
);
