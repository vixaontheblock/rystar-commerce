import { NextResponse } from "next/server";
import type { CheckoutPayload, CheckoutResponse } from "@/types/checkout";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CheckoutPayload;

    if (!body.customer?.name || !body.customer?.email) {
      const response: CheckoutResponse = {
        ok: false,
        error: "Missing customer information.",
      };

      return NextResponse.json(response, { status: 400 });
    }

    if (!body.items?.length) {
      const response: CheckoutResponse = {
        ok: false,
        error: "The cart is empty.",
      };

      return NextResponse.json(response, { status: 400 });
    }

    if (!body.total || body.total <= 0) {
      const response: CheckoutResponse = {
        ok: false,
        error: "Invalid order total.",
      };

      return NextResponse.json(response, { status: 400 });
    }

    const orderNumber = `RY-${Date.now().toString().slice(-6)}`;

    const response: CheckoutResponse = {
      ok: true,
      orderNumber,
      redirectUrl: `/checkout/success?order=${orderNumber}`,
    };

    return NextResponse.json(response);
  } catch {
    const response: CheckoutResponse = {
      ok: false,
      error: "Could not process checkout.",
    };

    return NextResponse.json(response, { status: 500 });
  }
}