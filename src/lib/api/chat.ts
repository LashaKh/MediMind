import { API_ENDPOINTS } from './constants';
import { APIResponse } from './types';
import { APIError } from './errors';

export async function fetchAIResponse(message: string, sessionId: string): Promise<APIResponse> {
  try {
    const response = await fetch(API_ENDPOINTS.FLOWISE_BOT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: message,
        overrideConfig: {
          sessionId: sessionId // Include sessionId in the request
        }
      }),
    });

    if (!response.ok) {
      throw new APIError(`HTTP error! status: ${response.status}`, response.status);
    }

    const data = await response.json();
    
    if (!data || !data.text) {
      throw new APIError('Invalid response format from AI service');
    }

    return data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(
      error instanceof Error ? error.message : 'Failed to fetch AI response'
    );
  }
}