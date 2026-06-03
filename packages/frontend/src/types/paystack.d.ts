export interface PaystackSuccessResponse {
  reference: string;
  status: string;
  trans: string;
  transaction: string;
  trxref: string;
}

export interface PaystackHandler {
  openIframe: () => void;
}

export interface PaystackPopSetupOptions {
  key: string;
  email: string;
  amount: number;
  currency?: string;
  ref: string;
  metadata?: {
    custom_fields: Array<{
      display_name: string;
      variable_name: string;
      value: string;
    }>;
  };
  onClose?: () => void;
  onSuccess?: (response: PaystackSuccessResponse) => void;
}

export interface PaystackPop {
  setup: (options: PaystackPopSetupOptions) => PaystackHandler;
}

declare global {
  interface Window {
    PaystackPop: PaystackPop;
  }
}

export {};
