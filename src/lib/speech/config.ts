export const SPEECH_CONFIG = {
  // Google Cloud Speech-to-Text configuration
  googleCloud: {
    apiEndpoint: 'https://speech.googleapis.com/v1/speech:recognize',
    credentials: {
      clientId: '929489993964-3rh3str208jm8ijcchod6jl2h0bnqk9c.apps.googleusercontent.com',
      clientSecret: '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'
    }
  },
  // Default speech recognition settings
  defaults: {
    encoding: 'LINEAR16' as const,
    sampleRateHertz: 16000,
    languageCode: 'ka-GE',
    model: 'default'
  }
} as const;