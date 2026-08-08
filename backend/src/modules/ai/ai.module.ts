import { Module } from '@nestjs/common';
import { AIController } from './ai.controller';
import { AIService } from './ai.service';
import { AIRouter } from './ai.router';
import { AICostCalculator } from './ai.cost-calculator';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [AIController],
  providers: [AIService, AIRouter, AICostCalculator],
  exports: [AIService, AIRouter, AICostCalculator],
})
export class AIModule {}
