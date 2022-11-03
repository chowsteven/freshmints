import { ethers, utils } from 'ethers';
import { ISettingsContext } from 'interfaces/ISettingsContext';
import { ITask } from 'interfaces/ITask';
import { useContext } from 'react';
import { SettingsContext } from 'renderer/contexts/SettingsContext';

interface UseCancelTransactionProps {
  task: ITask;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
  setIsTaskStarted: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useCancelTransaction = ({
  task,
  setStatus,
  setIsTaskStarted,
}: UseCancelTransactionProps) => {
  let provider: ethers.providers.JsonRpcProvider;
  let abiInterface: ethers.utils.Interface;
  let taskWallet: ethers.Wallet;
  let transaction: string;
  let transactionResponse: ethers.providers.TransactionResponse;
  const { alchemyApiUrl, etherscanApiKey } = useContext(
    SettingsContext
  ) as ISettingsContext;

  /* NOTE: window.api.editTask is used to persist task status state.
   * To prevent excessive file read/writes, it is only called on errors or
   * when task is past point of no return (sendTx and getTxResponse).
   * Previous states/non-errors don't need to be persisted because the
   * user can cancel task again and there will be no issues.
   * Persisted error status will let user know not to restart the task,
   * and when a tx is sent, the user will know not to re-send.
   */

  const initializeTask = async () => {
    setStatus('Cancelling tx');
    try {
      provider = new ethers.providers.JsonRpcProvider(alchemyApiUrl);
    } catch (err) {
      const status = `Initialization error: ${err}`;
      setStatus(status);
      const updatedTask = { ...task, status };
      window.api.editTask(updatedTask);
    }
  };

  const getContractABI = async () => {
    try {
      // const res = await fetch(
      //   'https://api.etherscan.io/api?module=contract&action=getabi&address=${task.contract}&apikey=${etherscanApiKey}'
      // );
      const res = await fetch(
        `https://api-goerli.etherscan.io/api?module=contract&action=getabi&address=${task.contract}&apikey=${etherscanApiKey}`
      );
      const abiJSON = await res.json();
      abiInterface = new ethers.utils.Interface(abiJSON.result);
    } catch (err) {
      const status = `Error fetching ABI: ${err}`;
      setStatus(status);
      const updatedTask = { ...task, status };
      window.api.editTask(updatedTask);
    }
  };

  const getTaskWallet = async () => {
    try {
      taskWallet = new ethers.Wallet(task.wallet.privateKey, provider);
    } catch (err) {
      const status = `Error connecting to wallet: ${err}`;
      setStatus(status);
      const updatedTask = { ...task, status };
      window.api.editTask(updatedTask);
    }
  };

  const buildTx = async () => {
    try {
      const taskParams =
        task.mintParameters === '' ? [] : task.mintParameters.split(';');

      const encodedPayload = abiInterface.encodeFunctionData(
        task.mintFunction,
        taskParams
      );
      const nonce = await provider.getTransactionCount(taskWallet.address);

      const txOptions: ethers.providers.TransactionRequest = {
        nonce,
        from: taskWallet.address,
        to: taskWallet.address,
        maxFeePerGas: utils.parseUnits(
          Math.ceil(task.maxGas * 1.1).toString(),
          'gwei'
        ),
        maxPriorityFeePerGas: utils.parseUnits(
          Math.ceil(task.priorityFee * 1.1).toString(),
          'gwei'
        ),
        type: 2,
        value: 0,
        chainId: 5,
      };

      // const estimatedGas = await provider.estimateGas({
      //   to: task.contract,
      //   data: encodedPayload,
      //   value: utils.parseEther(task.mintPrice),
      // });
      // should multiply by 1.2 for safety + 1000
      // txOptions.gasLimit = estimatedGas;
      txOptions.gasLimit = 200000;

      transaction = await taskWallet.signTransaction(txOptions);
    } catch (err) {
      const status = `Error building tx: ${err}`;
      setStatus(status);
      const updatedTask = { ...task, status };
      window.api.editTask(updatedTask);
    }
  };

  const sendTx = async () => {
    try {
      transactionResponse = await provider.sendTransaction(transaction);
      const status = `Sent cancellation tx ${transactionResponse.hash}`;
      setStatus(status);
      const updatedTask = { ...task, status };
      window.api.editTask(updatedTask);
    } catch (err) {
      const status = `Error sending tx: ${err}`;
      setStatus(status);
      const updatedTask = { ...task, status };
      window.api.editTask(updatedTask);
    }
  };

  const getTxResponse = async () => {
    try {
      const transactionReceipt = await transactionResponse.wait();
      setIsTaskStarted(false);
      const status = `Cancelled in block ${transactionReceipt.blockNumber}`;
      setStatus(status);
      const updatedTask = { ...task, status };
      window.api.editTask(updatedTask);
    } catch (err) {
      const status = `Error: ${err}`;
      setStatus(status);
      const updatedTask = { ...task, status };
      window.api.editTask(updatedTask);
    }
  };

  const cancelTransaction = async () => {
    await initializeTask();
    await getContractABI();
    await getTaskWallet();
    await buildTx();
    await sendTx();
    await getTxResponse();
  };

  return { cancelTransaction };
};
