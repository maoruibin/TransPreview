/**
 * Base interface for translation providers
 */
export interface ITranslationProvider {
  /**
   * Translate text content
   * @param content The text content to translate
   * @param targetLanguage Target language code (e.g., 'zh-CN', 'en')
   * @returns Translated text
   */
  translate(content: string, targetLanguage?: string): Promise<string>;

  /**
   * Check if the provider is properly configured
   */
  isConfigured(): boolean;
}

/**
 * Configuration for translation providers
 */
export interface TranslationConfig {
  apiKey: string;
  baseURL?: string;
  model?: string;
}

/**
 * API Response type for OpenAI-compatible endpoints
 */
interface ChatCompletionResponse {
  choices: Array<{
    message?: {
      content?: string;
    };
  }>;
}

/**
 * DeepSeek Translation Provider
 * Uses DeepSeek API for translation
 */
export class DeepSeekProvider implements ITranslationProvider {
  private config: TranslationConfig;

  constructor(config: TranslationConfig) {
    this.config = config;
  }

  isConfigured(): boolean {
    return !!this.config.apiKey;
  }

  async translate(content: string, targetLanguage = 'zh-CN'): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('DeepSeek API key is not configured');
    }

    const baseURL = this.config.baseURL || 'https://api.deepseek.com/v1';
    const model = this.config.model || 'deepseek-chat';

    const response = await fetch(`${baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: `You are a professional translator. Translate the given content to ${targetLanguage}. Only return the translated text without any explanations or additional content.`
          },
          {
            role: 'user',
            content: content
          }
        ],
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`DeepSeek API error: ${response.status} - ${error}`);
    }

    const data = await response.json() as ChatCompletionResponse;
    return data.choices[0]?.message?.content || '';
  }
}

/**
 * Zhipu AI Translation Provider
 * Uses Zhipu AI (GLM) API for translation
 */
export class ZhipuProvider implements ITranslationProvider {
  private config: TranslationConfig;

  constructor(config: TranslationConfig) {
    this.config = config;
  }

  isConfigured(): boolean {
    return !!this.config.apiKey;
  }

  async translate(content: string, targetLanguage = 'zh-CN'): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('Zhipu API key is not configured');
    }

    const baseURL = this.config.baseURL || 'https://open.bigmodel.cn/api/paas/v4';
    const model = this.config.model || 'glm-4-flash';

    const response = await fetch(`${baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: `You are a professional translator. Translate the given content to ${targetLanguage}. Only return the translated text without any explanations or additional content.`
          },
          {
            role: 'user',
            content: content
          }
        ],
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Zhipu API error: ${response.status} - ${error}`);
    }

    const data = await response.json() as ChatCompletionResponse;
    return data.choices[0]?.message?.content || '';
  }
}

/**
 * OpenAI Translation Provider
 * Uses OpenAI GPT-4o-mini for translation
 */
export class OpenAIProvider implements ITranslationProvider {
  private config: TranslationConfig;

  constructor(config: TranslationConfig) {
    this.config = config;
  }

  isConfigured(): boolean {
    return !!this.config.apiKey;
  }

  async translate(content: string, targetLanguage = 'zh-CN'): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('OpenAI API key is not configured');
    }

    const baseURL = this.config.baseURL || 'https://api.openai.com/v1';
    const model = this.config.model || 'gpt-4o-mini';

    const response = await fetch(`${baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: `You are a professional translator. Translate the given content to ${targetLanguage}. Only return the translated text without any explanations or additional content.`
          },
          {
            role: 'user',
            content: content
          }
        ],
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${error}`);
    }

    const data = await response.json() as ChatCompletionResponse;
    return data.choices[0]?.message?.content || '';
  }
}

/**
 * Qwen Translation Provider
 * Uses Alibaba Qwen (Tongyi Qianwen) API for translation
 */
export class QwenProvider implements ITranslationProvider {
  private config: TranslationConfig;

  constructor(config: TranslationConfig) {
    this.config = config;
  }

  isConfigured(): boolean {
    return !!this.config.apiKey;
  }

  async translate(content: string, targetLanguage = 'zh-CN'): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('Qwen API key is not configured');
    }

    const baseURL = this.config.baseURL || 'https://dashscope.aliyuncs.com/compatible-mode/v1';
    const model = this.config.model || 'qwen-turbo';

    const response = await fetch(`${baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: `You are a professional translator. Translate the given content to ${targetLanguage}. Only return the translated text without any explanations or additional content.`
          },
          {
            role: 'user',
            content: content
          }
        ],
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Qwen API error: ${response.status} - ${error}`);
    }

    const data = await response.json() as ChatCompletionResponse;
    return data.choices[0]?.message?.content || '';
  }
}

/**
 * Factory function to create translation provider
 */
export function createTranslationProvider(
  providerType: string,
  config: TranslationConfig
): ITranslationProvider {
  switch (providerType.toLowerCase()) {
    case 'deepseek':
      return new DeepSeekProvider(config);
    case 'zhipu':
      return new ZhipuProvider(config);
    case 'openai':
      return new OpenAIProvider(config);
    case 'qwen':
      return new QwenProvider(config);
    default:
      throw new Error(`Unknown translation provider: ${providerType}`);
  }
}
