# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Testing with cURL

You can test the Google AI API directly from your terminal using `curl`. Make sure to replace `GEMINI_API_KEY` with your actual API key from your `.env` file.

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
