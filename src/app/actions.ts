
"use server";

import { moderateContent, type ModerateContentOutput } from "@/ai/flows/content-moderation-flow";
import { ecoHelper, type EcoHelperInput, type EcoHelperOutput } from "@/ai/flows/eco-helper-flow";

export async function moderateContentAction(
  prevState: ModerateContentOutput | { flagged: null | boolean, reason: string },
  formData: FormData
): Promise<ModerateContentOutput> {
  const text = formData.get("text") as string;
  const mediaUrl = formData.get("mediaUrl") as string | undefined;

  if (!text) {
    return {
      flagged: true,
      reason: "Text content is required for moderation.",
    };
  }
  
  try {
    const result = await moderateContent({ text, mediaUrl: mediaUrl || undefined });
    return result;
  } catch (error) {
    console.error("Error during content moderation:", error);
    return {
      flagged: true,
      reason: "An unexpected error occurred during moderation.",
    };
  }
}


export async function askEcoHelperAction(input: EcoHelperInput): Promise<EcoHelperOutput> {
  if (!input.query) {
    return {
      response: "Please provide a query.",
    };
  }
  
  try {
    const result = await ecoHelper(input);
    return result;
  } catch (error) {
    console.error("Error during eco helper query:", error);
    return {
      response: "Sorry, I encountered an error while processing your request.",
    };
  }
}
