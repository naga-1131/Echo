# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Enabling API Keys

For the AI and map features to work, you must provide your own API keys and ensure the corresponding services are enabled in your Google Cloud project.

### Gemini AI API Key

1.  **Get a Key:** Obtain a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  **Add Key to Project:** Paste the key into the `.env` file, replacing the placeholder for `GEMINI_API_KEY`.
3.  **Enable the Service:**
    *   Go to the [Google Cloud API Library](https://console.cloud.google.com/apis/library).
    *   Search for **"Generative Language API"** and click on it.
    *   Click the **"Enable"** button. If it's already enabled, the issue might be with your project's billing setup.

### Google Maps API Key

1.  **Get a Key:** Obtain an API key from the [Google Cloud Console](https://console.cloud.google.com/google/maps-apis/overview).
2.  **Add Key to Project:** Paste the key into the `src/lib/google-maps-api-key.ts` file, replacing the placeholder.
3.  **Enable the Service:**
    *   In the [Google Cloud API Library](https://console.cloud.google.com/apis/library), search for and enable the **"Maps JavaScript API"**.
    *   Ensure your Google Cloud project has a billing account enabled. Google requires this for the Maps API, even for the free tier.

## Testing with cURL

You can test the Google AI API directly from your terminal using `curl`.

This command securely reads your API key from the `.env` file and sends a test prompt to the `gemini-pro` model. Make sure you have added your key to the `.env` file and enabled the Generative Language API.

```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent" \
  -H 'Content-Type: application/json' \
  -H "X-goog-api-key: $(grep -E '^GEMINI_API_KEY=' .env | cut -d '=' -f2)" \
  -X POST \
  -d '{
    "contents": [
      {
        "parts": [
          {
            "text": "Explain how AI works in a few words"
          }
        ]
      }
    ]
  }'
```
