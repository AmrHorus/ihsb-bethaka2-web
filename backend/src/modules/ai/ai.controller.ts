import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { AIService, AIRequestDTO, AIRequestType } from './ai.service';
import { UsersService } from '../users/users.service';

@Controller('ai')
export class AIController {
  constructor(
    private aiService: AIService,
    private usersService: UsersService,
  ) {}

  @Post('chat')
  async chat(@Request() req, @Body() body: AIRequestDTO) {
    const user = req.user;
    const subscriptionInfo = await this.usersService.getSubscriptionInfo(user.userId);
    
    return this.aiService.processRequest(user.userId, {
      ...body,
      type: AIRequestType.CHAT,
    }, subscriptionInfo);
  }

  @Post('solve')
  async solveMath(@Request() req, @Body() body: AIRequestDTO) {
    const user = req.user;
    const subscriptionInfo = await this.usersService.getSubscriptionInfo(user.userId);
    
    return this.aiService.processRequest(user.userId, {
      ...body,
      type: AIRequestType.MATH_SOLVER,
    }, subscriptionInfo);
  }

  @Post('quiz')
  async generateQuiz(@Request() req, @Body() body: AIRequestDTO) {
    const user = req.user;
    const subscriptionInfo = await this.usersService.getSubscriptionInfo(user.userId);
    
    return this.aiService.processRequest(user.userId, {
      ...body,
      type: AIRequestType.QUIZ_GENERATOR,
    }, subscriptionInfo);
  }

  @Post('study')
  async studyAssistant(@Request() req, @Body() body: AIRequestDTO) {
    const user = req.user;
    const subscriptionInfo = await this.usersService.getSubscriptionInfo(user.userId);
    
    return this.aiService.processRequest(user.userId, {
      ...body,
      type: AIRequestType.STUDY_ASSISTANT,
    }, subscriptionInfo);
  }

  @Post('flashcards')
  async generateFlashcards(@Request() req, @Body() body: AIRequestDTO) {
    const user = req.user;
    const subscriptionInfo = await this.usersService.getSubscriptionInfo(user.userId);
    
    return this.aiService.processRequest(user.userId, {
      ...body,
      type: AIRequestType.FLASHCARDS,
    }, subscriptionInfo);
  }

  @Get('usage')
  async getUsage(@Request() req) {
    const user = req.user;
    return this.usersService.getAIUsage(user.userId);
  }
}
