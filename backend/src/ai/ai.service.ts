import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private openai: OpenAI | null = null;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (apiKey) {
      this.openai = new OpenAI({ apiKey });
    }
  }

  async getFinancialAdvice(userData: any, userQuestion: string) {
    if (!this.openai) {
      return this.getMockAdvice(userData, userQuestion);
    }

    const systemPrompt = `You are Arkad, the Richest Man in Babylon. You give financial advice based on the 7 cures for a lean purse and modern financial principles.
    User data: ${JSON.stringify(userData)}.
    Keep advice wise, motivating, and simple.`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userQuestion },
      ],
    });

    return response.choices[0].message.content;
  }

  private getMockAdvice(userData: any, userQuestion: string) {
    return `[Mock AI] Arkad says: "A part of all you earn is yours to keep." Based on your data, you should focus on controlling your expenses and making your gold multiply. (OpenAI API key not configured)`;
  }

  async analyzeHabits(transactions: any[]) {
    // Logic to detect dangerous spending or suggest improvements
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    if (totalExpenses > 0) {
      return "Your gold flows away. Examine each expense to see if it is truly necessary.";
    }
    return "You manage your purse well.";
  }
}
