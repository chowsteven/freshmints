import { IWallet } from './IWallet';

export interface IWalletContext {
  wallets: IWallet[];
  setWallets: React.Dispatch<React.SetStateAction<IWallet[]>>;
  isDeleteWallet: boolean;
  setIsDeleteWallet: React.Dispatch<React.SetStateAction<boolean>>;
  fetchWallets: () => Promise<IWallet[]>;
}
