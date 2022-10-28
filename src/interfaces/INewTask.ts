import { IWallet } from './IWallet';

export interface INewTask {
  selectedWallets: IWallet[];
  mode: 'Manual' | 'Automatic';
  contract: string;
  mintFunction: string;
  mintParameters: string;
  mintPrice: string;
  maxGas: string;
  priorityFee: string;
}
