import type { APIRoute } from "astro";
import { uid, type Offer, type LoanRequest } from "../../../lib/store";
import { getJSON, setJSON } from "../../../lib/db";

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json().catch(() => null);
  if (!body) return new Response("Invalid JSON", { status: 400 });

  const { requestId, lenderName, lenderEmail, apr, originationFee, schedule } = body;

  if (
    typeof requestId !== "string" ||
    typeof lenderName !== "string" ||
    typeof lenderEmail !== "string" ||
    typeof apr !== "number" ||
    typeof originationFee !== "number" ||
    !["monthly", "biweekly"].includes(schedule)
  ) {
    return new Response("Invalid fields", { status: 400 });
  }

  const requests = await getJSON<LoanRequest[]>("requests", []);
  const exists = requests.find((r) => r.id === requestId);
  if (!exists) return new Response("Request not found", { status: 404 });

  const offer: Offer = {
    id: uid("off"),
    requestId,
    lenderName: lenderName.trim(),
    lenderEmail: lenderEmail.trim().toLowerCase(),
    apr,
    originationFee,
    schedule,
    createdAt: new Date().toISOString(),
  };

  const offers = await getJSON<Offer[]>("offers", []);
  offers.unshift(offer);
  await setJSON("offers", offers);

  return new Response(JSON.stringify({ ok: true, offer }), {
    headers: { "Content-Type": "application/json" },
  });
};
