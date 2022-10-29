import { ethers, utils } from 'ethers';
import { ISettingsContext } from 'interfaces/ISettingsContext';
import { ITask } from 'interfaces/ITask';
import { useContext } from 'react';
import { SettingsContext } from 'renderer/contexts/SettingsContext';

interface UseStartTaskProps {
  task: ITask;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
}

export const useStartTask = ({ task, setStatus }: UseStartTaskProps) => {
  let provider: ethers.providers.JsonRpcProvider;
  let abiInterface: ethers.utils.Interface;
  let taskWallet: ethers.Wallet;
  let transaction: string;
  let transactionResponse: ethers.providers.TransactionResponse;
  const { alchemyApiUrl, etherscanApiKey } = useContext(
    SettingsContext
  ) as ISettingsContext;

  const initializeTask = async () => {
    setStatus('Initializing');
    try {
      provider = new ethers.providers.JsonRpcProvider(alchemyApiUrl);
      setStatus('Initialized task');
    } catch (err) {
      setStatus(`Initialization error: ${err}`);
    }
  };

  const getContractABI = async () => {
    setStatus('Fetching ABI');
    try {
      // const res = await fetch(
      //   'https://api.etherscan.io/api?module=contract&action=getabi&address=${task.contract}&apikey=${etherscanApiKey}'
      // );
      const res = await fetch(
        `https://api-goerli.etherscan.io/api?module=contract&action=getabi&address=${task.contract}&apikey=${etherscanApiKey}`
      );
      const abiJSON = await res.json();
      abiInterface = new ethers.utils.Interface(abiJSON.result);
      setStatus('Fetched ABI');
    } catch (err) {
      setStatus(`Error fetching ABI: ${err}`);
    }
  };

  const getTaskWallet = async () => {
    setStatus('Connecting to wallet');
    try {
      taskWallet = new ethers.Wallet(task.wallet.privateKey, provider);
      setStatus('Connected to wallet');
    } catch (err) {
      setStatus(`Error connecting to wallet: ${err}`);
    }
  };

  const buildTx = async () => {
    setStatus('Building new tx');
    try {
      // empty array if not payable
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
        to: task.contract,
        maxFeePerGas: utils.parseUnits(task.maxGas.toString(), 'gwei'),
        maxPriorityFeePerGas: utils.parseUnits(
          task.priorityFee.toString(),
          'gwei'
        ),
        type: 2,
        value: utils.parseEther(task.mintPrice),
        chainId: 5,
        data: encodedPayload,
      };

      // const estimatedGas = await provider.estimateGas({
      //   to: task.contract,
      //   data: encodedPayload,
      //   value: txOptions.value,
      // });

      // should multiply by 1.2 for safety
      // txOptions.gasLimit = estimatedGas;
      txOptions.gasLimit = 200000;

      transaction = await taskWallet.signTransaction(txOptions);
      setStatus('Built new tx');
    } catch (err) {
      setStatus(`Error building tx: ${err}`);
    }
  };

  const sendTx = async () => {
    setStatus('Sending tx');
    try {
      transactionResponse = await provider.sendTransaction(transaction);
      setStatus('Sent tx');
    } catch (err) {
      setStatus(`Error sending tx: ${err}`);
    }
  };

  const getTxResponse = async () => {
    try {
      const transactionReceipt = await transactionResponse.wait();
      setStatus(`Included in block ${transactionReceipt.blockNumber}`);
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      }
    }
  };

  const startTask = async () => {
    await initializeTask();
    await getContractABI();
    await getTaskWallet();
    await buildTx();
    await sendTx();
    await getTxResponse();
  };

  return { startTask };
};
