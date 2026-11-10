export const getBudgetBalanceTone = (
  totalBudget: number,
  remainingBudget: number,
): 'primary' | 'success' | 'warning' | 'error' => {
  if (totalBudget <= 0) return 'primary';
  if (remainingBudget <= 0) return 'error';
  if (remainingBudget / totalBudget <= 0.15) return 'warning';
  return 'success';
};
