import type { DifyResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

export const streamMessageToDify = async (
  query: string,
  conversationId: string | null,
  storyContext: string,
  onDelta: (chunk: string) => void,
  onComplete: (response: DifyResponse) => void,
  onError: (error: Error) => void
) => {
  const payload = {
    inputs: {
      creative_prompt: storyContext,
    },
    query,
    user: 'player-01',
    response_mode: 'streaming',
    conversation_id: conversationId || undefined,
  };

  try {
    const response = await fetch(`${API_URL}/chat-messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    if (!response.body) {
      throw new Error('Response body is null');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    let accumulatedAnswer = '';
    let finalConversationId = conversationId || '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');

      // The last line might be incomplete, so we keep it in the buffer
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.trim() === '' || !line.startsWith('data:')) {
          continue;
        }

        try {
          const jsonStr = line.substring(6);
          const eventData = JSON.parse(jsonStr);

          if (eventData.event === 'message') {
            onDelta(eventData.answer);
            accumulatedAnswer += eventData.answer;
          } else if (eventData.event === 'message_end') {
            finalConversationId = eventData.conversation_id;
          }
        } catch (e) {
          console.warn('Skipping non-JSON line:', line, e);
        }
      }
    }

    onComplete({
      answer: accumulatedAnswer,
      conversation_id: finalConversationId,
    });

  } catch (error) {
    console.error('Streaming Error:', error);
    onError(error as Error);
  }
};