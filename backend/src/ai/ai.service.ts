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
    const expenses = transactions.filter((t) => t.type === 'expense');
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);

    if (totalExpenses === 0) return 'You manage your purse well.';

    const warnings = [];

    // 1. Impulsive spending detection (many small transactions in same categories)
    const impulsiveCategories = ['Shopping', 'Entertainment', 'Fast Food'];
    const impulsiveExpenses = expenses.filter((t) => impulsiveCategories.includes(t.category));
    if (impulsiveExpenses.length > 5) {
      warnings.push('Impulsive spending detected. "Seek not to satisfy every whim that entereth thy mind."');
    }

    // 2. Unnecessary subscriptions
    const subscriptions = expenses.filter(
      (t) => t.description.toLowerCase().includes('subscription') || t.description.toLowerCase().includes('netflix'),
    );
    if (subscriptions.length > 3) {
      warnings.push('Too many subscriptions. "Examine each expense to see if it is truly necessary."');
    }

    // 3. Overconsumption
    if (totalExpenses > 5000) {
      warnings.push('Overconsumption detected. Your lifestyle may be exceeding your means.');
    }

    // 4. Dangerous debt / Credit dependency
    const debtPayments = expenses.filter(
      (t) =>
        t.description.toLowerCase().includes('credit card') ||
        t.description.toLowerCase().includes('interest') ||
        t.description.toLowerCase().includes('loan'),
    );
    if (debtPayments.length > 2) {
      warnings.push('Dependency on credit detected. "The borrower is servant to the lender."');
    }

    return warnings.length > 0 ? warnings.join(' ') : 'Your gold flows wisely.';
  }

  async analyzeExpenses(transactions: any[]) {
    const expenses = transactions.filter(
      (t) =>
        t.type === 'expense' ||
        ['nourriture', 'transport', 'logement', 'loisirs', 'sante', 'education'].includes(t.type),
    );

    const nonEssential = expenses.filter((t) => ['loisirs', 'Entertainment', 'Shopping'].includes(t.category || t.type));
    const totalNonEssential = nonEssential.reduce((sum, t) => sum + t.amount, 0);

    const analysis = [];
    if (totalNonEssential > 0) {
      analysis.push(
        `Dépenses non essentielles identifiées : ${totalNonEssential} FCFA. "Contrôlez vos dépenses afin d'avoir de l'argent pour payer vos nécessités, vos loisirs et satisfaire vos désirs dignes sans dépenser plus que les neuf dixièmes de vos gains."`,
      );
    }

    const fixed = transactions.filter((t) => t.isFixed);
    if (fixed.length > 0) {
      analysis.push(`${fixed.length} dépenses fixes détectées. Assurez-vous qu'elles ne dépassent pas 70% de vos revenus.`);
    }

    return analysis.length > 0 ? analysis.join(' ') : 'Analyse des dépenses terminée : aucun problème majeur détecté.';
  }

  async getBudgetAlerts(budgetStatus: any[]) {
    const alerts = budgetStatus
      .filter((b) => b.percentage > 90)
      .map((b) => {
        if (b.percentage >= 100) {
          return `Alerte : Budget ${b.category} dépassé (${b.percentage.toFixed(1)}%) !`;
        }
        return `Attention : Budget ${b.category} presque atteint (${b.percentage.toFixed(1)}%).`;
      });

    return alerts;
  }

  async getPsychologicalAdvice(userData: any) {
    if (!this.openai) {
      return this.getMockPsychologicalAdvice();
    }

    const systemPrompt = `You are a Financial Behavioral Coach. Analyze the user's situation and provide advice on:
    - Emotional spending patterns
    - Fear of investing
    - Impulsivity
    - Financial discipline routines
    Inspiried by Behavioral Finance. User situation: ${JSON.stringify(userData)}. Keep it professional yet empathetic.`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'system', content: systemPrompt }],
    });

    return response.choices[0].message.content;
  }

  private getMockPsychologicalAdvice() {
    return "[Mock Psych Coach] Discipline is the bridge between goals and accomplishment. Establish a routine of 'paying yourself first' to overcome the fear of investing and curb emotional spending.";
  }
}
