export function monthlyPayment(principal: number, apr: number, termMonths: number) {
  const r = apr / 100 / 12;
  if (r === 0) return principal / termMonths;
  const num = r * Math.pow(1 + r, termMonths);
  const den = Math.pow(1 + r, termMonths) - 1;
  return principal * (num / den);
}

export function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}
