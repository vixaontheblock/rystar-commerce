type TilopayCustomer = {
  name: string;
  email: string;
  phone?: string;
};

type CreateTilopayCheckoutInput = {
  orderId: string;
  orderNumber: string;
  amount: number;
  currency: string;
  description: string;
  customer: TilopayCustomer;
  successUrl: string;
  cancelUrl: string;
};

type TilopayCheckoutResult =
  | {
      ok: true;
      paymentUrl: string;
      reference?: string;
    }
  | {
      ok: false;
      reason: string;
    };

function getRequiredEnv(key: string) {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }

  return value;
}

export function getTilopayConfigStatus() {
  return {
    hasApiKey: Boolean(process.env.TILOPAY_API_KEY),
    hasApiUser: Boolean(process.env.TILOPAY_API_USER),
    hasApiPassword: Boolean(process.env.TILOPAY_API_PASSWORD),
    hasCheckoutEndpoint: Boolean(process.env.TILOPAY_CHECKOUT_ENDPOINT),
    env: process.env.TILOPAY_ENV ?? "sandbox",
  };
}

export async function createTilopayCheckout(
  input: CreateTilopayCheckoutInput
): Promise<TilopayCheckoutResult> {
  const apiKey = getRequiredEnv("TILOPAY_API_KEY");
  const apiUser = getRequiredEnv("TILOPAY_API_USER");
  const apiPassword = getRequiredEnv("TILOPAY_API_PASSWORD");

  const checkoutEndpoint = process.env.TILOPAY_CHECKOUT_ENDPOINT;

  if (!checkoutEndpoint) {
    return {
      ok: false,
      reason:
        "TILOPAY_CHECKOUT_ENDPOINT is missing. Tilopay credentials exist, but the checkout API endpoint/request format is still pending.",
    };
  }

  /*
    IMPORTANTE:
    Este request es un adaptador preparado, pero el body exacto depende
    del endpoint oficial/Postman que Tilopay te entregue.

    Cuando tengas la documentación real, aquí ajustamos:
    - URL
    - headers
    - body
    - nombre del campo de paymentUrl
    - referencia/transaction id
  */

  const response = await fetch(checkoutEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
      Authorization: `Basic ${Buffer.from(`${apiUser}:${apiPassword}`).toString(
        "base64"
      )}`,
    },
    body: JSON.stringify({
      order_id: input.orderId,
      order_number: input.orderNumber,
      amount: input.amount / 100,
      currency: input.currency,
      description: input.description,
      customer: input.customer,
      success_url: input.successUrl,
      cancel_url: input.cancelUrl,
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    return {
      ok: false,
      reason:
        data?.message ??
        data?.error ??
        `Tilopay request failed with status ${response.status}`,
    };
  }

  const paymentUrl =
    data?.payment_url ?? data?.paymentUrl ?? data?.checkout_url ?? data?.url;

  if (!paymentUrl) {
    return {
      ok: false,
      reason:
        "Tilopay response did not include a payment URL. Check the official response format.",
    };
  }

  return {
    ok: true,
    paymentUrl,
    reference: data?.reference ?? data?.transaction_id ?? data?.id,
  };
}