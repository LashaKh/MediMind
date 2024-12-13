import { SPEECH_CONFIG } from './config';
import { AudioConfig } from './types';

export class GoogleSpeechService {
  private readonly apiEndpoint = SPEECH_CONFIG.googleCloud.apiEndpoint;
  private readonly apiKey = SPEECH_CONFIG.googleCloud.credentials.clientSecret;

  async transcribeAudio(audioBlob: Blob): Promise<string> {
    try {
      const base64Audio = await this.blobToBase64(audioBlob);
      
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          config: {
            ...SPEECH_CONFIG.defaults,
            enableAutomaticPunctuation: true,
            useEnhanced: true
          },
          audio: {
            content: base64Audio
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to transcribe audio');
      }

      const data = await response.json();
      return data.results?.[0]?.alternatives?.[0]?.transcript || '';
    } catch (error) {
      console.error('Speech recognition error:', error);
      throw new Error('Failed to transcribe audio. Please try again.');
    }
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}