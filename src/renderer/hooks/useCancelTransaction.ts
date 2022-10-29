import { ethers, utils } from 'ethers';
import { ISettingsContext } from 'interfaces/ISettingsContext';
import { ITask } from 'interfaces/ITask';
import { useContext } from 'react';
import { SettingsContext } from 'renderer/contexts/SettingsContext';

interface UseCancelTransactionProps {
  task: ITask;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
}

export const useCancelTransaction = ({
  task,
  setStatus,
}: UseCancelTransactionProps) => {
  let provider: ethers.providers.JsonRpcProvider;
  let abiInterface: ethers.utils.Interface;
  let taskWallet: ethers.Wallet;
  let transaction: string;
  let transactionResponse: ethers.providers.TransactionResponse;
  const { alchemyApiUrl, etherscanApiKey } = useContext(
    SettingsContext
  ) as ISettingsContext;

  const initializeTask = async () => {
    setStatus('Cancelling tx');
    try {
      provider = new ethers.providers.JsonRpcProvider(alchemyApiUrl);
    } catch (err) {
      setStatus(`Initialization error: ${err}`);
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
      setStatus(`Error fetching ABI: ${err}`);
    }
  };

  const getTaskWallet = async () => {
    try {
      taskWallet = new ethers.Wallet(task.wallet.privateKey, provider);
    } catch (err) {
      setStatus(`Error connecting to wallet: ${err}`);
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
      setStatus(`Error building tx: ${err}`);
    }
  };

  const sendTx = async () => {
    try {
      setStatus('Sent cancellation tx');
      transactionResponse = await provider.sendTransaction(transaction);
    } catch (err) {
      setStatus(`Error sending tx: ${err}`);
    }
  };

  const getTxResponse = async () => {
    try {
      const transactionReceipt = await transactionResponse.wait();
      setStatus(`Cancelled in block ${transactionReceipt.blockNumber}`);
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      }
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
