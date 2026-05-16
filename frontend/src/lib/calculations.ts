/**
 * Financial calculation utilities
 */

/**
 * Compound interest with monthly contributions
 */
export function calculateProjection(
  initialAmount: number,
  monthlyContribution: number,
  annualReturnRate: number,
  years: number,
  inflationRate: number = 0
) {
  const adjustedReturn = (1 + annualReturnRate / 100) / (1 + inflationRate / 100) - 1;
  const monthlyReturn = Math.pow(1 + adjustedReturn, 1 / 12) - 1;
  const months = years * 12;

  let currentBalance = initialAmount;
  const history = [];

  for (let m = 1; m <= months; m++) {
    currentBalance = currentBalance * (1 + monthlyReturn) + monthlyContribution;
    if (m % 12 === 0) {
      history.push({
        year: m / 12,
        value: Math.round(currentBalance)
      });
    }
  }

  return {
    finalValue: Math.round(currentBalance),
    history
  };
}

/**
 * 4% Rule for FIRE
 */
export function calculateFIRE(annualExpenses: number, currentNetWorth: number) {
  const fireNumber = annualExpenses * 25;
  const progress = (currentNetWorth / fireNumber) * 100;
  return {
    fireNumber,
    progress: Math.min(Math.round(progress), 100),
    isReached: currentNetWorth >= fireNumber
  };
}

/**
 * Portfolio risk and rebalancing logic
 */
export function analyzePortfolio(assets: { type: string, value: number, riskLevel: number }[]) {
  const totalValue = assets.reduce((sum, a) => sum + a.value, 0);
  if (totalValue === 0) return { riskScore: 0, recommendations: [] };

  const weightedRisk = assets.reduce((sum, a) => sum + (a.riskLevel * (a.value / totalValue)), 0);

  // Basic rebalancing advice
  const recommendations = [];
  const allocationByType = assets.reduce((acc, a) => {
    acc[a.type] = (acc[a.type] || 0) + (a.value / totalValue) * 100;
    return acc;
  }, {} as Record<string, number>);

  if ((allocationByType['Crypto'] || 0) > 15) {
    recommendations.push("Your gold is in risky ventures. Consider moving some crypto to safer havens like gold or land.");
  }

  if ((allocationByType['Cash'] || 0) < 10) {
    recommendations.push("Ensure thy purse hath a few coins for emergencies. Increase your cash reserves.");
  }

  return {
    riskScore: Math.round(weightedRisk * 10) / 10,
    recommendations
  };
}
