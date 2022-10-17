declare global {
  interface Window {
    api: {
      addWallet: (wallet: { [k: string]: FormDataEntryValue }) => void;
      fetchWallets: () => Promise<string>;
      updateSettings: (settings: string) => void;
      fetchSettings: () => Promise<string>;
    };
  }
}

export {};
