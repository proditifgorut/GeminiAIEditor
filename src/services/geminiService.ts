import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;

  initialize(apiKey: string, modelName: string = 'gemini-pro') {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: modelName });
  }

  async generateContent(prompt: string): Promise<string> {
    if (!this.model) {
      throw new Error('Gemini API belum diinisialisasi. Silakan tambahkan API key.');
    }

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating content:', error);
      throw error;
    }
  }

  async streamGenerateContent(prompt: string, onChunk: (text: string) => void): Promise<void> {
    if (!this.model) {
      throw new Error('Gemini API belum diinisialisasi. Silakan tambahkan API key.');
    }

    try {
      const result = await this.model.generateContentStream(prompt);
      
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        onChunk(chunkText);
      }
    } catch (error) {
      console.error('Error streaming content:', error);
      throw error;
    }
  }

  isInitialized(): boolean {
    return this.model !== null;
  }
}

export const geminiService = new GeminiService();
