import { NextResponse } from "next/server";
import { PaymentStatus, OrderStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { createTilopayCheckout } from "@/lib/tilopay";

type CheckoutItem = {
  lineId: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: string[];
  };
  variant: {
    id: string;
    size: string;
    color?: string | null;
    stock: number;
    priceOverride?: number | null;
  };
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

type CheckoutPayload = {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: string;
  items: CheckoutItem[];
};

const SHIPPING = 350;
const FREE_SHIPPING_THRESHOLD = 10000;

function createOrderNumber() {
  return `RS-${Date.now()}`;
}

function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

function validatePayload(payload: Partial<CheckoutPayload>) {
  if (!payload.customerName) {
    return "Customer name is required.";
  }

  if (!payload.customerEmail) {
    return "Customer email is required.";
  }

  if (!payload.shippingAddress) {
    return "Shipping address is required.";
  }

  if (!payload.items || !Array.isArray(payload.items) || payload.items.length === 0) {
    return "Cart is empty.";
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Partial<CheckoutPayload>;

    const validationError = validatePayload(payload);

    if (validationError) {
      return NextResponse.json(
        {
          ok: false,
          message: validationError,
        },
        { status: 400 }
      );
    }

    const items = payload.items as CheckoutItem[];

    const subtotal = items.reduce((total, item) => {
      return total + item.lineTotal;
    }, 0);

    const shippingTotal =
      subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING;

    const total = subtotal + shippingTotal;
    const orderNumber = createOrderNumber();

    const order = await db.order.create({
      data: {
        orderNumber,
        customerName: payload.customerName as string,
        customerEmail: payload.customerEmail as string,
        customerPhone: payload.customerPhone ?? null,
        shippingAddress: payload.shippingAddress as string,
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        subtotal,
        shippingTotal,
        total,
        items: {
          create: items.map((item) => ({
            productNameSnapshot: item.product.name,
            variantSnapshot: `${item.variant.size}${
              item.variant.color ? ` / ${item.variant.color}` : ""
            }`,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            lineTotal: item.lineTotal,
          })),
        },
      },
    });

    const siteUrl = getSiteUrl();

    const tilopayResult = await createTilopayCheckout({
      orderId: order.id,
      orderNumber: order.orderNumber,
      amount: order.total,
      currency: process.env.TILOPAY_CURRENCY ?? "USD",
      description: `Rystar Studios order ${order.orderNumber}`,
      customer: {
        name: order.customerName,
        email: order.customerEmail,
        phone: order.customerPhone ?? undefined,
      },
      successUrl: `${siteUrl}/checkout/success?order=${order.orderNumber}`,
      cancelUrl: `${siteUrl}/checkout?cancelled=true&order=${order.orderNumber}`,
    });

    if (!tilopayResult.ok) {
      return NextResponse.json({
        ok: true,
        mode: "tilopay_pending_configuration",
        orderId: order.id,
        orderNumber: order.orderNumber,
        message:
          "Order created in database, but Tilopay checkout endpoint is not configured yet.",
        tilopayReason: tilopayResult.reason,
      });
    }

    await db.order.update({
      where: {
        id: order.id,
      },
      data: {
        tilopayReference: tilopayResult.reference ?? null,
      },
    });

    return NextResponse.json({
      ok: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      paymentUrl: tilopayResult.paymentUrl,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        ok: false,
        message: "Checkout failed.",
      },
      { status: 500 }
    );
  }
}