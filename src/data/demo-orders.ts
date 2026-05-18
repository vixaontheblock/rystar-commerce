export type DemoOrderStatus =
  | "pending"
  | "paid"
  | "preparing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type DemoOrder = {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  total: number;
  status: DemoOrderStatus;
  createdAt: string;
  items: {
    name: string;
    variant: string;
    quantity: number;
    price: number;
  }[];
};

export const demoOrders: DemoOrder[] = [
  {
    id: "RY-104291",
    customerName: "Carlos Pérez",
    customerEmail: "carlos@email.com",
    customerPhone: "+507 6000-0000",
    total: 7150,
    status: "paid",
    createdAt: "Today",
    items: [
      {
        name: "Rystar Signature Tee",
        variant: "M / Black",
        quantity: 1,
        price: 3500,
      },
      {
        name: "Rystar Logo Cap",
        variant: "One Size / Black",
        quantity: 1,
        price: 2800,
      },
    ],
  },
  {
    id: "RY-104292",
    customerName: "Andrea Gómez",
    customerEmail: "andrea@email.com",
    customerPhone: "+507 6111-2222",
    total: 7150,
    status: "preparing",
    createdAt: "Yesterday",
    items: [
      {
        name: "Rystar Core Hoodie",
        variant: "L / Gray",
        quantity: 1,
        price: 6800,
      },
    ],
  },
  {
    id: "RY-104293",
    customerName: "Miguel Torres",
    customerEmail: "miguel@email.com",
    customerPhone: "+507 6222-3333",
    total: 4950,
    status: "pending",
    createdAt: "May 18",
    items: [
      {
        name: "Rystar Utility Shorts",
        variant: "M / Black",
        quantity: 1,
        price: 4600,
      },
    ],
  },
];