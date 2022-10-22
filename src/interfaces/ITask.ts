import { IWallet } from './IWallet';

export interface ITask {
  id: string;
  wallet: IWallet;
  contract: string;
  mintFunction: string;
  mode: 'Manual' | 'Automatic';
  mintPrice: string;
  quantity: number;
  maxGas: number;
  priorityFee: number;
  status: string;
}
