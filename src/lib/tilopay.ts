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
  webhookUrl?: string;
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

type TilopayTokenResult =
  | {
      ok: true;
      token: string;
      tokenType: string;
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

function getUrlOrigin(url: string) {
  try {
    return new URL(url).origin;
  } catch {
    return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  }
}

function getPaymentUrlFromResponse(data: unknown) {
  if (!data || typeof data !== "object") return null;

  const response = data as Record<string, unknown>;
  const result = response.result as Record<string, unknown> | undefined;
  const dataObject = response.data as Record<string, unknown> | undefined;

  const possibleUrl =
    response.url ??
    response.paymentUrl ??
    response.payment_url ??
    response.checkoutUrl ??
    response.checkout_url ??
    response.link ??
    result?.url ??
    result?.paymentUrl ??
    result?.payment_url ??
    result?.checkoutUrl ??
    result?.checkout_url ??
    result?.link ??
    dataObject?.url ??
    dataObject?.paymentUrl ??
    dataObject?.payment_url ??
    dataObject?.checkoutUrl ??
    dataObject?.checkout_url ??
    dataObject?.link;

  return typeof possibleUrl === "string" ? possibleUrl : null;
}

function getReferenceFromResponse(data: unknown) {
  if (!data || typeof data !== "object") return undefined;

  const response = data as Record<string, unknown>;
  const result = response.result as Record<string, unknown> | undefined;
  const dataObject = response.data as Record<string, unknown> | undefined;

  const possibleReference =
    response.reference ??
    response.id ??
    response.link_payment_id ??
    response.linkPaymentId ??
    result?.reference ??
    result?.id ??
    result?.link_payment_id ??
    result?.linkPaymentId ??
    dataObject?.reference ??
    dataObject?.id ??
    dataObject?.link_payment_id ??
    dataObject?.linkPaymentId;

  if (typeof possibleReference === "string") return possibleReference;
  if (typeof possibleReference === "number") return String(possibleReference);

  return undefined;
}

async function getTilopayBearerToken(): Promise<TilopayTokenResult> {
  const tokenEndpoint = process.env.TILOPAY_TOKEN_ENDPOINT;

  if (!tokenEndpoint) {
    return {
      ok: false,
      reason:
        "TILOPAY_TOKEN_ENDPOINT is missing. Use https://app.tilopay.com/api/v1/login",
    };
  }

  const apiUser = getRequiredEnv("TILOPAY_API_USER");
  const apiPassword = getRequiredEnv("TILOPAY_API_PASSWORD");

  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      apiuser: apiUser,
      password: apiPassword,
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    return {
      ok: false,
      reason:
        (data as { message?: string; error?: string } | null)?.message ??
        (data as { message?: string; error?: string } | null)?.error ??
        `Tilopay token request failed with status ${response.status}`,
    };
  }

  const token =
    (data as { access_token?: string; token?: string } | null)?.access_token ??
    (data as { access_token?: string; token?: string } | null)?.token;

  const tokenType =
    (data as { token_type?: string } | null)?.token_type ?? "bearer";

  if (!token) {
    return {
      ok: false,
      reason: `Tilopay token response did not include access_token. Response: ${JSON.stringify(
        data
      )}`,
    };
  }

  return {
    ok: true,
    token,
    tokenType,
  };
}

export function getTilopayConfigStatus() {
  return {
    hasApiKey: Boolean(process.env.TILOPAY_API_KEY),
    hasApiUser: Boolean(process.env.TILOPAY_API_USER),
    hasApiPassword: Boolean(process.env.TILOPAY_API_PASSWORD),
    hasTokenEndpoint: Boolean(process.env.TILOPAY_TOKEN_ENDPOINT),
    hasPaymentLinkEndpoint: Boolean(process.env.TILOPAY_PAYMENT_LINK_ENDPOINT),
    env: process.env.TILOPAY_ENV ?? "sandbox",
  };
}

export async function createTilopayCheckout(
  input: CreateTilopayCheckoutInput
): Promise<TilopayCheckoutResult> {
  const apiKey = getRequiredEnv("TILOPAY_API_KEY");
  const paymentLinkEndpoint = process.env.TILOPAY_PAYMENT_LINK_ENDPOINT;

  if (!paymentLinkEndpoint) {
    return {
      ok: false,
      reason:
        "TILOPAY_PAYMENT_LINK_ENDPOINT is missing. Use https://app.tilopay.com/api/v1/createLinkPayment",
    };
  }

  const tokenResult = await getTilopayBearerToken();

  if (!tokenResult.ok) {
    return {
      ok: false,
      reason: tokenResult.reason,
    };
  }

  const siteUrl = getUrlOrigin(input.successUrl);
  const webhookUrl = input.webhookUrl ?? `${siteUrl}/api/webhooks/tilopay`;

  const body = {
    key: apiKey,
    amount: (input.amount / 100).toFixed(2),
    currency: input.currency,
    reference: input.orderNumber,
    type: 0,
    description: input.description,
    client: input.customer.name,
    callback_url: input.successUrl,
    webhook_url: webhookUrl,
  };

  const response = await fetch(paymentLinkEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${tokenResult.tokenType} ${tokenResult.token}`,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    return {
      ok: false,
      reason:
        (data as { message?: string; error?: string } | null)?.message ??
        (data as { message?: string; error?: string } | null)?.error ??
        `Tilopay payment link request failed with status ${response.status}`,
    };
  }

  const paymentUrl = getPaymentUrlFromResponse(data);

  if (!paymentUrl) {
    return {
      ok: false,
      reason: `Tilopay response did not include a payment URL. Response: ${JSON.stringify(
        data
      )}`,
    };
  }

  return {
    ok: true,
    paymentUrl,
    reference: getReferenceFromResponse(data) ?? input.orderNumber,
  };
}