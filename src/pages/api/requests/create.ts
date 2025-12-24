import type { APIRoute } from "astro";
import { store, uid, type LoanRequest } from "../../../lib/store";

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json().catch(() => null);
  if (!body) return new Response("Invalid JSON", { status: 400 });

  const { borrowerName, borrowerEmail, amount, currency, termMonths, purpose } = body;

  if (
    typeof borrowerName !== "string" ||
    typeof borrowerEmail !== "string" ||
    typeof amount !== "number" ||
    !["USD", "EUR", "GBP", "NOK"].includes(currency) ||
    typeof termMonths !== "number" ||
    typeof purpose !== "string"
  ) {
    return new Response("Invalid fields", { status: 400 });
  }

  const req: LoanRequest = {
    id: uid("req"),
    borrowerName: borrowerName.trim(),
    borrowerEmail: borrowerEmail.trim().toLowerCase(),
    amount,
    currency,
    termMonths,
    purpose: purpose.trim(),
    createdAt: new Date().toISOString(),
  };

  store.requests.unshift(req);

  return new Response(JSON.stringify({ ok: true, request: req }), {
    headers: { "Content-Type": "application/json" },
  });
};
