import { ethers, utils } from 'ethers';
import { ISettingsContext } from 'interfaces/ISettingsContext';
import { ITask } from 'interfaces/ITask';
import { IWebhook } from 'interfaces/IWebhook';
import { useContext } from 'react';
import { SettingsContext } from 'renderer/contexts/SettingsContext';

interface UseStartTaskProps {
  task: ITask;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
  setIsTaskStarted: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useStartTask = ({
  task,
  setStatus,
  setIsTaskStarted,
}: UseStartTaskProps) => {
  let provider: ethers.providers.JsonRpcProvider;
  let abiInterface: ethers.utils.Interface;
  let taskWallet: ethers.Wallet;
  let transaction: string;
  let transactionResponse: ethers.providers.TransactionResponse;
  const { alchemyApiUrl, etherscanApiKey, discordWebhook } = useContext(
    SettingsContext
  ) as ISettingsContext;

  /* NOTE: window.api.editTask is used to persist task status state.
   * To prevent excessive file read/writes, it is only called on errors or
   * when task is past point of no return (sendTx and getTxResponse).
   * Previous states/non-errors don't need to be persisted because the
   * user can start task again and there will be no issues.
   * Persisted error status will let user know not to restart the task,
   * and when a tx is sent, the user will know not to re-send.
   */

  const initializeTask = async () => {
    setIsTaskStarted(true);
    setStatus('Initializing');

    try {
      provider = new ethers.providers.JsonRpcProvider(alchemyApiUrl);
      setStatus('Initialized task');
    } catch (err) {
      const status = `Initialization error: ${err}`;
      setStatus(status);
      const updatedTask = { ...task, status };
      window.api.editTask(updatedTask);
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
      const status = `Error fetching ABI: ${err}`;
      setStatus(status);
      const updatedTask = { ...task, status };
      window.api.editTask(updatedTask);
    }
  };

  const getTaskWallet = async () => {
    setStatus('Connecting to wallet');
    try {
      taskWallet = new ethers.Wallet(task.wallet.privateKey, provider);
      setStatus('Connected to wallet');
    } catch (err) {
      const status = `Error connecting to wallet: ${err}`;
      setStatus(status);
      const updatedTask = { ...task, status };
      window.api.editTask(updatedTask);
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

      const estimatedGas = await provider.estimateGas({
        from: taskWallet.address,
        to: task.contract,
        data: encodedPayload,
        value: txOptions.value,
      });

      // should multiply by 1.2 for safety
      txOptions.gasLimit = estimatedGas;

      transaction = await taskWallet.signTransaction(txOptions);
      setStatus('Built new tx');
    } catch (err) {
      const status = `Error building tx: ${err}`;
      setStatus(status);
      const updatedTask = { ...task, status };
      window.api.editTask(updatedTask);
    }
  };

  const sendTx = async () => {
    setStatus('Sending tx');
    try {
      transactionResponse = await provider.sendTransaction(transaction);
      const status = `Sent tx ${transactionResponse.hash}`;
      setStatus(status);
      const updatedTask = { ...task, status };
      window.api.editTask(updatedTask);
    } catch (err: any) {
      if (err.code === 'INSUFFICIENT_FUNDS') {
        const status = 'Insufficient funds';
        setStatus(status);
        const updatedTask = { ...task, status };
        window.api.editTask(updatedTask);
      } else {
        const status = `Error sending tx: ${err}`;
        setStatus(status);
        const updatedTask = { ...task, status };
        window.api.editTask(updatedTask);
      }
    }
  };

  const getTxResponse = async () => {
    // initialize webhook
    const webhookJSON: IWebhook = {
      content: null,
      embeds: [
        {
          title: '',
          color: 0,
          fields: [
            {
              name: 'Contract Address',
              value: `[Etherscan](https://goerli.etherscan.io/address/${task.contract})`,
            },
            {
              name: 'Transaction Hash',
              value: '',
            },
            {
              name: 'Wallet Name',
              value: `${task.wallet.name}`,
            },
            {
              name: 'Price',
              value: '',
            },
          ],
        },
      ],
      username: 'Freshmints',
      avatar_url: 'https://cdn-icons-png.flaticon.com/512/4087/4087025.png',
    };

    try {
      const transactionReceipt = await transactionResponse.wait();
      const status = `Included in block ${transactionReceipt.blockNumber}`;
      setStatus(status);
      const updatedTask = { ...task, status };
      window.api.editTask(updatedTask);
      setIsTaskStarted(false);

      // add to webhook
      webhookJSON.embeds[0].title = 'Successful Transaction';
      webhookJSON.embeds[0].color = 6668912;
      webhookJSON.embeds[0].fields[1].value = `[Etherscan](https://goerli.etherscan.io/tx/${transactionReceipt.transactionHash})`;
      webhookJSON.embeds[0].fields[3].value = `${task.mintPrice}E`;

      // send webhook
      fetch(discordWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(webhookJSON),
      });
    } catch (err: any) {
      if (err.cancelled) {
        // add to webhook
        webhookJSON.embeds[0].title = 'Transaction Cancelled';
        webhookJSON.embeds[0].color = 12596790;
        webhookJSON.embeds[0].fields[1].value = `[Etherscan](https://goerli.etherscan.io/tx/${err.replacement.hash})`;
        webhookJSON.embeds[0].fields[3].value = '0E';

        // send webhook
        fetch(discordWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(webhookJSON),
        });
      } else if (err.code === 'INSUFFICIENT_FUNDS') {
        const status = 'Insufficient funds';
        setStatus(status);
        const updatedTask = { ...task, status };
        window.api.editTask(updatedTask);
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
