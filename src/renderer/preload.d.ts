import { IWallet } from 'interfaces/IWallet';

declare global {
  interface Window {
    api: {
      addWallet: (wallet: {
        [k: string]: FormDataEntryValue;
      }) => Promise<IWallet>;
      deleteWallet: (wallet: string) => void;
      fetchWallets: () => Promise<string>;
      updateSettings: (settings: string) => void;
      fetchSettings: () => Promise<string>;
    };
  }
}

export {};
