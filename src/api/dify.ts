import type { DifyResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

export const streamMessageToDify = async (
  query: string,
  conversationId: string | null,
  storyContext: string, // 参数变更为故事背景
  onDelta: (chunk: string) => void,
  onComplete: (response: DifyResponse) => void,
  onError: (error: Error) => void
) => {
  const payload = {
    inputs: {
      creative_prompt: storyContext, // 变量名与Dify中设置的 {{#sys.creative_prompt#}} 对应
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
    const decoder = new TextDecoder();
    let accumulatedAnswer = '';
    let finalConversationId = conversationId || '';

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      const textChunk = decoder.decode(value, { stream: true });
      const lines = textChunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const jsonStr = line.substring(6);
            if (jsonStr.trim() === '') continue;

            const eventData = JSON.parse(jsonStr);

            if (eventData.event === 'message') {
              onDelta(eventData.answer);
              accumulatedAnswer += eventData.answer;
            } else if (eventData.event === 'message_end') {
              finalConversationId = eventData.conversation_id;
            }
          } catch (e) {
            console.warn('Skipping non-JSON line:', line);
          }
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