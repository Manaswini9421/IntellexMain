'use server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Array of API keys
const API_KEYS = [
  process.env.GOOGLE_API_KEY_1,
  process.env.GOOGLE_API_KEY_2,
  process.env.GOOGLE_API_KEY_3,
  process.env.GOOGLE_API_KEY_4,
  process.env.GOOGLE_API_KEY_5,
  process.env.GOOGLE_API_KEY_6,
  process.env.GOOGLE_API_KEY_7,
  process.env.GOOGLE_API_KEY_9,
  process.env.GOOGLE_API_KEY_10,
].filter(Boolean) as string[];

let currentKeyIndex = 0;
function getNextApiKey() {
  if (!API_KEYS.length) throw new Error('No valid API keys available');
  const key = API_KEYS[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
  return key;
}

export interface VideoEvent {
  description: string;
  isDangerous: boolean;
  timestamp: string;
}

export async function detectEvents(
  imageBlob: Blob
): Promise<{ events: VideoEvent[]; rawResponse: string }> {
  if (!imageBlob) throw new Error('No image data provided');

  const API_KEY = getNextApiKey();
  console.log(`Using API key index: ${currentKeyIndex}`);

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const bytes = new Uint8Array(await imageBlob.arrayBuffer());
  console.log(`Image size in bytes: ${bytes.length}`);

  const base64Image = Buffer.from(bytes).toString('base64');

  // Wait for API response - no timeout, just wait until resolved
  const result = await model.generateContent([
    {
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64Image,
      },
    },
    `Analyze this frame in detail and describe what you see. ALWAYS provide at least one event describing the scene.

Check for dangerous situations:
1. Medical emergencies, falls, injuries
2. Distress signals, panic
3. Violence, threats, weapons
4. Suspicious activities

Return EXACTLY this JSON format (MUST have at least one event):
{
  "events": [
    {
      "timestamp": "00:00",
      "description": "very short Detailed description of what's visible in the frame (not more than 150 characters)",
      "isDangerous": true/false
    }
  ]
}

IMPORTANT: Even if nothing dangerous is happening, describe what you see (e.g., "Person standing normally", "Empty room", "Outdoor scene with trees", etc.)`,
  ]);

  const text = result.response.text();
  console.log('Gemini says:', text);

  // Parse JSON response
  let jsonStr = text;
  const codeMatch = text.match(/```(?:json)?\s*({[\s\S]*?})\s*```/);
  if (codeMatch) {
    jsonStr = codeMatch[1];
  } else {
    const objMatch = text.match(/\{[\s\S]*\}/);
    if (objMatch) jsonStr = objMatch[0];
  }

  try {
    const parsed = JSON.parse(jsonStr);
    const events = parsed.events ?? [];

    // If no events returned, create a default one with the raw text
    if (events.length === 0) {
      return {
        events: [{
          description: text,
          isDangerous: false,
          timestamp: '',
        }],
        rawResponse: text,
      };
    }

    const eventsWithTimestamps: VideoEvent[] = events.map((e: any) => ({
      description: e.description || text,
      isDangerous: e.isDangerous || false,
      timestamp: '',
    }));

    return { events: eventsWithTimestamps, rawResponse: text };
  } catch (error) {
    console.error('Failed to parse JSON, returning raw text:', error);
    // If JSON parsing fails, return the raw text as description
    return {
      events: [{
        description: text,
        isDangerous: false,
        timestamp: '',
      }],
      rawResponse: text,
    };
  }
}