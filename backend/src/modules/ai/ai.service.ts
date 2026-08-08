import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AIRouter, PlanType, UserSubscriptionInfo } from './ai.router';
import { AICostCalculator } from './ai.cost-calculator';

export enum AIRequestType {
  CHAT = 'CHAT',
  MATH_SOLVER = 'MATH_SOLVER',
  QUIZ_GENERATOR = 'QUIZ_GENERATOR',
  STUDY_ASSISTANT = 'STUDY_ASSISTANT',
  FLASHCARDS = 'FLASHCARDS',
  EXPLANATION = 'EXPLANATION',
  SUMMARY = 'SUMMARY',
}

export interface AIRequestDTO {
  message: string;
  type?: AIRequestType;
  model?: string;
  context?: any;
}

export interface AIResponse {
  content: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  cost: number;
  usageRemaining: {
    daily: number;
    monthly: number;
  };
}

@Injectable()
export class AIService {
  private readonly apiKey: string;

  constructor(
    private configService: ConfigService,
    private aiRouter: AIRouter,
    private costCalculator: AICostCalculator,
  ) {
    this.apiKey = this.configService.get<string>('anthropic.apiKey');
    
    if (!this.apiKey) {
      console.warn('⚠️ ANTHROPIC_API_KEY not configured. AI features will be limited.');
    }
  }

  /**
   * Main entry point for AI requests
   * Routes to appropriate model based on user subscription
   */
  async processRequest(
    userId: string,
    request: AIRequestDTO,
    subscriptionInfo: UserSubscriptionInfo,
  ): Promise<AIResponse> {
    // Check usage limits first
    const limitsCheck = this.aiRouter.checkLimits(subscriptionInfo);
    if (!limitsCheck.allowed) {
      throw new ForbiddenException({
        message: limitsCheck.reason,
        upgradeTo: limitsCheck.upgradeSuggestion,
      });
    }

    // Select appropriate model (server-side routing)
    const selectedModel = this.aiRouter.selectModel(subscriptionInfo, request.model);

    // Get max tokens for user's plan
    const maxTokens = this.aiRouter.getMaxTokens(subscriptionInfo.plan);

    // Validate request size
    if (request.message.length > maxTokens.input * 4) {
      throw new BadRequestException('Message too long for your plan');
    }

    // Build system prompt based on request type
    const systemPrompt = this.buildSystemPrompt(request.type || AIRequestType.CHAT);

    // Make API call to Anthropic
    const apiResponse = await this.callAnthropicAPI({
      model: selectedModel,
      messages: [{ role: 'user', content: request.message }],
      system: systemPrompt,
      max_tokens: maxTokens.output,
    });

    // Calculate cost
    const cost = this.costCalculator.calculateCost({
      inputTokens: apiResponse.usage.input_tokens,
      outputTokens: apiResponse.usage.output_tokens,
      model: selectedModel,
    });

    // Return response with usage info
    return {
      content: apiResponse.content[0].text,
      model: selectedModel,
      inputTokens: apiResponse.usage.input_tokens,
      outputTokens: apiResponse.usage.output_tokens,
      totalTokens: apiResponse.usage.input_tokens + apiResponse.usage.output_tokens,
      cost,
      usageRemaining: {
        daily: subscriptionInfo.dailyUsage + 1,
        monthly: subscriptionInfo.monthlyUsage + 1,
      },
    };
  }

  /**
   * Build educational system prompts based on request type
   */
  private buildSystemPrompt(type: AIRequestType): string {
    const basePrompt = 'أنت مساعد تعليمي خبير في الرياضيات لمنصة "إحسب بذكاء". ';
    const basePromptEn = 'You are an expert educational assistant for mathematics on the "Ihsb Bthka\'a" platform. ';

    switch (type) {
      case AIRequestType.MATH_SOLVER:
        return basePrompt + `
          عند حل مسألة رياضية:
          1. افهم السؤال جيدًا واستخرج المعطيات
          2. حدد القانون أو القاعدة المناسبة
          3. عوّض بالقيم
          4. احسب النتيجة خطوة بخطوة
          5. اشرح كل خطوة بوضوح
          6. تحقق من صحة الإجابة
          
          لا تعطِ الإجابة فقط، بل علّم الطالب كيفية الحل.
          شجّع الطالب على الفهم بدلاً من الحفظ.
        `;

      case AIRequestType.QUIZ_GENERATOR:
        return basePrompt + `
          قم بإنشاء أسئلة تدريبية بناءً على الموضوع المطلوب.
          لكل سؤال:
          - صيغة واضحة ومفهومة
          - درجات صعوبة متدرجة
          - إجابات نموذجية مع شرح
          
          بعد كل مجموعة أسئلة، اسأل الطالب إذا كان يريد المزيد من التدريب.
        `;

      case AIRequestType.STUDY_ASSISTANT:
        return basePrompt + `
          ساعد الطالب في المذاكرة والفهم.
          - بسّط المفاهيم المعقدة
          - استخدم أمثلة واقعية
          - ربط المفاهيم الجديدة بالمعلومات السابقة
          - شجّع على الأسئلة والاستفسار
        `;

      case AIRequestType.FLASHCARDS:
        return basePrompt + `
          أنشئ بطاقات تعليمية (Flashcards) للموضوع المطلوب.
          كل بطاقة تحتوي على:
          - سؤال أو مفهوم على الوجه الأمامي
          - إجابة أو شرح على الوجه الخلفي
          
          اجعل البطاقات واضحة ومركزة.
        `;

      case AIRequestType.EXPLANATION:
        return basePrompt + `
          اشرح المفهوم المطلوب بطريقة مبسطة وشاملة.
          - ابدأ بتعريف بسيط
          - أضف أمثلة توضيحية
          - ذكر التطبيقات العملية
          - أوضح الأخطاء الشائعة
        `;

      case AIRequestType.SUMMARY:
        return basePrompt + `
          لخص المحتوى المطلوب في نقاط واضحة.
          - احتفظ بالمعلومات الأساسية
          - استخدم لغة بسيطة
          - نظّم المعلومات بشكل منطقي
        `;

      default:
        return basePrompt + 'ساعد الطالب في فهم الرياضيات بطريقة تعليمية وودية.';
    }
  }

  /**
   * Call Anthropic Claude API
   */
  private async callAnthropicAPI(payload: any): Promise<any> {
    if (!this.apiKey) {
      // Mock response for development without API key
      return this.mockAnthropicResponse(payload);
    }

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Anthropic API error: ${error.error?.message || 'Unknown error'}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Anthropic API call failed:', error);
      throw error;
    }
  }

  /**
   * Mock response for development/testing
   */
  private mockAnthropicResponse(payload: any): any {
    return {
      id: 'mock_' + Date.now(),
      type: 'message',
      role: 'assistant',
      content: [{ type: 'text', text: 'هذا رد تجريبي للتطوير. يرجى إضافة مفتاح API للاختبار الحقيقي.' }],
      model: payload.model,
      stop_reason: 'end_turn',
      usage: {
        input_tokens: 100,
        output_tokens: 50,
      },
    };
  }
}
