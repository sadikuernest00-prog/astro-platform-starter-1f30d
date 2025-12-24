export type UserRole = "borrower" | "lender";

export type LoanRequest = {
  id: string;
  borrowerName: string;
  borrowerEmail: string;
  amount: number; // principal
  currency: "USD" | "EUR" | "GBP" | "NOK";
  termMonths: number;
  purpose: string;
  createdAt: string;
};

export type Offer = {
  id: string;
  requestId: string;
  lenderName: string;
  lenderEmail: string;
  apr: number; // annual percentage rate
  originationFee: number; // flat amount, same currency as loan
  schedule: "monthly" | "biweekly";
  createdAt: string;
};

export type Deal = {
  id: string;
  requestId: string;
  offerId: string;
  acceptedAt: string;

  // Snapshot the terms at acceptance time
  borrower: { name: string; email: string };
  lender: { name: string; email: string };

  principal: number;
  currency: LoanRequest["currency"];
  termMonths: number;
  apr: number;
  originationFee: number;
  schedule: Offer["schedule"];

  governingLaw: string; // e.g. "Norway" or "England and Wales"
};

// Use a global singleton so it survives hot-reloads in dev
const g = globalThis as any;

if (!g.__amicbridge_store) {
  g.__amicbridge_store = {
    requests: [] as LoanRequest[],
    offers: [] as Offer[],
    deals: [] as Deal[],
  };
}

export const store = g.__amicbridge_store as {
  requests: LoanRequest[];
  offers: Offer[];
  deals: Deal[];
};

export function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}
