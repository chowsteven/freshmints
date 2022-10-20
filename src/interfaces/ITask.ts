export interface ITask {
  privateKey: string;
  contract: string;
  mintFunction: string;
  mintPrice: string;
  quantity: number;
  maxGas: number;
  priorityFee: number;
}
