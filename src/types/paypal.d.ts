// global.d.ts

declare global {
  interface Window {
    paypal: {
      Buttons: (options: {
        createOrder?: (data?: unknown, actions?: PayPalButtonActions) => Promise<string>;
        onApprove?: (data: any, actions: PayPalButtonActions) => Promise<void>;
        onError?: (err: any) => void;
      }) => PayPalButtons;
    };
  }
}

export {}; // This file needs to be a module
