import { IWallet } from './IWallet';

export interface ITask {
  id: string;
  wallet: IWallet;
  contract: string;
  mintFunction: string;
  mintParameters: string;
  mode: 'Manual' | 'Automatic';
  mintPrice: string;
  maxGas: number;
  priorityFee: number;
  status: string;
}
