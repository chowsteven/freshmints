export interface ITask {
  id: string;
  privateKey: string;
  walletAddress: string;
  contract: string;
  mintFunction: string;
  mode: 'Manual' | 'Automatic';
  mintPrice: string;
  quantity: number;
  maxGas: number;
  priorityFee: number;
  status: string;
}
