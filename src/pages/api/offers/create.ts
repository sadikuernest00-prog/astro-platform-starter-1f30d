import type { APIRoute } from "astro";
import { store, uid, type Offer } from "../../../lib/store";

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

  const exists = store.requests.find((r) => r.id === requestId);
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

  store.offers.unshift(offer);

  return new Response(JSON.stringify({ ok: true, offer }), {
    headers: { "Content-Type": "application/json" },
  });
};
