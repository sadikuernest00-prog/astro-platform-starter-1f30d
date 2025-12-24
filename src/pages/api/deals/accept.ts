import type { APIRoute } from "astro";
import { uid, type Deal, type LoanRequest, type Offer } from "../../../lib/store";
import { getJSON, setJSON } from "../../../lib/db";

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json().catch(() => null);
  if (!body) return new Response("Invalid JSON", { status: 400 });

  const { requestId, offerId, governingLaw } = body;

  if (typeof requestId !== "string" || typeof offerId !== "string" || typeof governingLaw !== "string") {
    return new Response("Invalid fields", { status: 400 });
  }

  const requests = await getJSON<LoanRequest[]>("requests", []);
  const offers = await getJSON<Offer[]>("offers", []);

  const req = requests.find((r) => r.id === requestId);
  const offer = offers.find((o) => o.id === offerId && o.requestId === requestId);
  if (!req || !offer) return new Response("Request/Offer not found", { status: 404 });

  const deal: Deal = {
    id: uid("deal"),
    requestId,
    offerId,
    acceptedAt: new Date().toISOString(),
    borrower: { name: req.borrowerName, email: req.borrowerEmail },
    lender: { name: offer.lenderName, email: offer.lenderEmail },
    principal: req.amount,
    currency: req.currency,
    termMonths: req.termMonths,
    apr: offer.apr,
    originationFee: offer.originationFee,
    schedule: offer.schedule,
    governingLaw: governingLaw.trim(),
  };

  const deals = await getJSON<Deal[]>("deals", []);
  deals.unshift(deal);
  await setJSON("deals", deals);

  return new Response(JSON.stringify({ ok: true, deal }), {
    headers: { "Content-Type": "application/json" },
  });
};
