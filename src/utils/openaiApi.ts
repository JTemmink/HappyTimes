const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export const generateMassageDescription = async (
  placeName: string,
  wantsTreatment: boolean
): Promise<string> => {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not found. Set VITE_OPENAI_API_KEY in .env');
  }

  const systemPrompt = wantsTreatment
    ? `You are a witty and humorous writer creating a funny, cheeky description for a Thai massage place. Make it entertaining and playful, with subtle innuendos about the "Happy New Years treatment". Keep it lighthearted and fun, around 2-3 sentences.`
    : `You are a witty and humorous writer creating a funny description for a Thai massage place. The customer has EXPLICITLY DECLINED the "Happy New Years treatment" multiple times. Write a humorous description that playfully acknowledges this refusal, perhaps starting with something like "CERTAINLY NOT looking for a happy treatment..." and then list things they might encounter with those things wrapped in <strike> tags like <strike>this</strike> to show they're crossed out. Be witty and fun, around 2-3 sentences.`;

  const userPrompt = `Create a funny, entertaining description for a Thai massage place called "${placeName}". ${wantsTreatment ? 'The customer wants the "Happy New Years treatment" so be playful about it.' : 'The customer has repeatedly said NO to the "Happy New Years treatment". Write a humorous description that acknowledges this refusal, maybe starting with "CERTAINLY NOT..." and list things they might encounter (wrap those in <strike> tags). Make it clear they only want a regular massage.'}`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.8,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to generate description');
    }

    const data: OpenAIResponse = await response.json();
    return data.choices[0]?.message?.content || 'This Thai massage place offers traditional relaxation services.';
  } catch (error) {
    console.error('Error generating description:', error);
    throw error;
  }
};

// Helper function to parse text and return array with strikethrough markers
// The actual rendering with JSX will happen in the component
export interface TextPart {
  text: string;
  strikethrough: boolean;
}

export const parseStrikethroughText = (text: string): TextPart[] => {
  const parts: TextPart[] = [];
  const regex = /<strike>(.*?)<\/strike>/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push({
        text: text.substring(lastIndex, match.index),
        strikethrough: false,
      });
    }
    // Add strikethrough text
    parts.push({
      text: match[1],
      strikethrough: true,
    });
    lastIndex = regex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push({
      text: text.substring(lastIndex),
      strikethrough: false,
    });
  }

  return parts.length > 0 ? parts : [{ text, strikethrough: false }];
};

