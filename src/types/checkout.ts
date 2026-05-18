export type CheckoutLine = {
  productId: string;
  variantId: string;
  productName: string;
  variantName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type CheckoutPayload = {
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: CheckoutLine[];
  subtotal: number;
  shippingTotal: number;
  total: number;
};

export type CheckoutResponse =
  | {
      ok: true;
      orderNumber: string;
      redirectUrl: string;
    }
  | {
      ok: false;
      error: string;
    };