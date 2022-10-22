import { IWallet } from './IWallet';

export interface INewTask {
  selectedWallets: IWallet[];
  mode: 'Manual' | 'Automatic';
  contract: string;
  mintFunction: string;
  mintPrice: string;
  quantity: string;
  maxGas: string;
  priorityFee: string;
}
