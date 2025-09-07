
"use server";

import { moderateContent, type ModerateContentOutput } from "@/ai/flows/content-moderation-flow";

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
