import { PageInfo } from ".";

export interface OrderResponse {
  id: number;
  user: {
    id: number;
    name: string;
  };
  pharmacy: {
    id: number;
    name: string;
    slug: string;
  };
  payment: {
    id: number;
    invoice_number: string;
  };
  shipment_method: {
    id: number;
    name: string;
  };

  address: string;
  coordinate: {
    lon: number;
    lat: number;
  };

  n_items: number;
  subtotal: number;
  shipment_fee: number;
  total: number;

  status: string;
  ordered_at: string;
  finished_at?: string;

  items?: OrderItemResponse[];
}

export const defaultOrderResponse: OrderResponse = {
  id: 0,
  user: {
    id: 0,
    name: "",
  },
  pharmacy: {
    id: 0,
    name: "",
    slug: "",
  },
  payment: {
    id: 0,
    invoice_number: "",
  },
  shipment_method: {
    id: 0,
    name: "",
  },

  address: "",
  coordinate: {
    lon: 0,
    lat: 0,
  },

  n_items: 0,
  subtotal: 0,
  shipment_fee: 0,
  total: 0,

  status: "",
  ordered_at: "",
  finished_at: "",

  items: [],
};

export interface OrderItemResponse {
  id: number;
  product: {
    id: number;
    name: string;
    slug: string;
    photo_url: string;
    classification: string;
  };
  price: number;
  amount: number;
}

export interface OrdersResponse {
  orders: OrderResponse[];
  total: number;
}

export const defaultOrdersResponse = {
  orders: [],
  total: 0,
};

export interface OrderPaginatedResponse {
  orders: OrderResponse[];
  page_info: PageInfo;
}

export const defaultOrderPaginatedResponse: OrderPaginatedResponse = {
  orders: [],
  page_info: {
    current_page: 0,
    item_count: 0,
    items_per_page: 0,
    page_count: 0,
  },
};

export interface OrderItem {
  id: number;
  product: {
    id: number;
    slug: string;
    name: string;
  };
  price: number;
  amount: number;
}

export interface Order {
  id: number;
  user: {
    id: number;
    name: string;
  };
  pharmacy: {
    id: number;
    slug: string;
    name: string;
  };
  shipment_method: {
    id: number;
    name: string;
  };
  address: string;
  coordinate: {
    lat: number;
    lon: number;
  };
  n_items: number;
  subtotal: number;
  shipment_fee: number;
  total: number;
  status: string;
  ordered_at: string;
  finished_at: string;
  items: OrderItem[];
}

export interface CartInfo {
  orders: Order[];
  total: number;
}

export interface PaginatedOrder {
  page_info: PageInfo;
  orders: Order[];
}
