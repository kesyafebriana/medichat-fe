export interface PaymentResponse {
  id: number;
  invoice_number: string;
  user: {
    id: number;
    name: string;
  };
  file_url?: string;
  is_confirmed: boolean;
  amount: number;
}

export const defaultPaymentResponse: PaymentResponse = {
  id: 0,
  invoice_number: "",
  user: {
    id: 0,
    name: "",
  },
  file_url: "",
  is_confirmed: false,
  amount: 0,
};
