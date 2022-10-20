import { IWallet } from './IWallet';

export interface ITask {
  wallet: IWallet;
  contract: string;
  mintFunction: string;
  mintPrice: string;
  quantity: number;
  maxGas: number;
  priorityFee: number;
}
