import React, { useEffect, Fragment, useContext, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { WalletContext } from 'renderer/contexts/WalletContext';
import { IWalletContext } from 'interfaces/IWalletContext';
import { WalletSelect } from './WalletSelect';
import { TaskModeSelect } from './TaskModeSelect';
import { ITask } from '../../interfaces/ITask';
import { IWallet } from '../../interfaces/IWallet';

interface EditTaskModalProps {
  tasks: ITask[];
  taskNumber: number;
  isEditTask: boolean;
  setIsEditTask: React.Dispatch<React.SetStateAction<boolean>>;
  isEditTaskModalOpen: boolean;
  setIsEditTaskModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  fetchTasks: () => Promise<ITask[]>;
}

interface EditTaskFormProps {
  contract: string;
  mintFunction: string;
  mintPrice: string;
  quantity: number;
  maxGas: number;
  priorityFee: number;
}

export const EditTaskModal = ({
  tasks,
  taskNumber,
  isEditTask,
  setIsEditTask,
  isEditTaskModalOpen,
  setIsEditTaskModalOpen,
  fetchTasks,
}: EditTaskModalProps) => {
  // get target task
  const task = tasks[taskNumber];

  // get wallets from context
  const { wallets } = useContext(WalletContext) as IWalletContext;

  // set initial input states
  const [editTaskForm, setEditTaskForm] = useState<EditTaskFormProps>({
    contract: task?.contract,
    mintFunction: task?.mintFunction,
    mintPrice: task?.mintPrice,
    quantity: task?.quantity,
    maxGas: task?.maxGas,
    priorityFee: task?.priorityFee,
  });

  // set initial select states
  const [selectedWallet, setSelectedWallet] = useState<IWallet>(task?.wallet);
  const [mode, setMode] = useState<'Manual' | 'Automatic'>(task?.mode);

  // update states if a different task is being edited
  useEffect(() => {
    setEditTaskForm({
      contract: task?.contract,
      mintFunction: task?.mintFunction,
      mintPrice: task?.mintPrice,
      quantity: task?.quantity,
      maxGas: task?.maxGas,
      priorityFee: task?.priorityFee,
    });
    setSelectedWallet(task?.wallet);
    setMode(task?.mode);
  }, [task]);

  // handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditTaskForm({ ...editTaskForm, [e.target.id]: e.target.value });
  };

  const handleEdit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    // prepare for integration with ITask - change from string to number
    editTaskForm.quantity = Number(editTaskForm.quantity);
    editTaskForm.maxGas = Number(editTaskForm.maxGas);
    editTaskForm.priorityFee = Number(editTaskForm.priorityFee);

    // create updated task object
    const updatedTask: ITask = {
      ...task,
      ...editTaskForm,
      wallet: selectedWallet,
      mode,
    };

    // TODO: validate data

    // reset states
    setIsEditTaskModalOpen(false);
    setEditTaskForm({
      contract: updatedTask.contract,
      mintFunction: updatedTask.mintFunction,
      mintPrice: updatedTask.mintPrice,
      quantity: updatedTask.quantity,
      maxGas: updatedTask.maxGas,
      priorityFee: updatedTask.priorityFee,
    });

    // write to tasks.json
    await window.api.editTask(updatedTask);

    // fetch tasks to update state
    await fetchTasks();
    setIsEditTask(!isEditTask);
  };

  return (
    <Transition appear show={isEditTaskModalOpen} as={Fragment}>
      <Dialog
        open={isEditTaskModalOpen}
        onClose={() => setIsEditTaskModalOpen(false)}
        className="relative z-50"
      >
        {/* backdrop */}
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        {/* modal */}
        <div className="fixed inset-0 flex items-center justify-center">
          <Dialog.Panel className="w-full p-8 max-w-sm rounded-2xl bg-gray-200">
            <Dialog.Title className="mb-4 text-xl font-semibold">
              Edit Task
            </Dialog.Title>
            <form>
              <div className="pb-4 mb-4 border-b border-b-gray-800">
                <div>
                  <p className="mb-1">Select Wallet(s)</p>
                  <WalletSelect
                    fetchedWallets={wallets}
                    selectedWallet={selectedWallet}
                    setSelectedWallet={setSelectedWallet}
                  />
                </div>
              </div>
              <div className="pb-4 mb-4 border-b border-b-gray-800">
                <label htmlFor="contract" className="flex flex-col gap-1 mb-1">
                  Contract Address
                  <input
                    type="text"
                    name="contract"
                    id="contract"
                    value={editTaskForm.contract}
                    onChange={handleChange}
                    placeholder="Contract Address"
                    className="p-2 border rounded-md bg-gray-100"
                  />
                </label>
                <label
                  htmlFor="mintFunction"
                  className="flex flex-col gap-1 mb-1"
                >
                  Mint Function
                  <input
                    type="text"
                    name="mintFunction"
                    id="mintFunction"
                    value={editTaskForm.mintFunction}
                    onChange={handleChange}
                    placeholder="Mint Function"
                    className="p-2 border rounded-md bg-gray-100"
                  />
                </label>
                <div>
                  <p className="mb-1">Select Mode</p>
                  <TaskModeSelect mode={mode} setMode={setMode} />
                </div>
              </div>
              {/* TODO: automatic mode inputs */}
              <div className="flex gap-4 pb-4 mb-4 border-b border-b-gray-800">
                <label htmlFor="mintPrice" className="flex flex-col gap-1">
                  Price
                  <input
                    type="text"
                    name="mintPrice"
                    id="mintPrice"
                    value={editTaskForm.mintPrice}
                    onChange={handleChange}
                    placeholder="Price"
                    className="w-28 p-2 border rounded-md bg-gray-100"
                  />
                </label>
                <label htmlFor="quantity" className="flex flex-col gap-1">
                  Quantity
                  <input
                    type="text"
                    name="quantity"
                    id="quantity"
                    value={editTaskForm.quantity}
                    onChange={handleChange}
                    placeholder="Quantity"
                    className="w-28 p-2 border rounded-md bg-gray-100"
                  />
                </label>
              </div>
              <div className="flex gap-4 mb-8">
                <label htmlFor="maxGas" className="flex flex-col gap-1">
                  Max Gas
                  <input
                    type="text"
                    name="maxGas"
                    id="maxGas"
                    value={editTaskForm.maxGas}
                    onChange={handleChange}
                    placeholder="Max Gas"
                    className="w-28 p-2 border rounded-md bg-gray-100"
                  />
                </label>
                <label htmlFor="priorityFee" className="flex flex-col gap-1">
                  Priority Fee
                  <input
                    type="text"
                    name="priorityFee"
                    id="priorityFee"
                    value={editTaskForm.priorityFee}
                    onChange={handleChange}
                    placeholder="Priority Fee"
                    className="w-28 p-2 border rounded-md bg-gray-100"
                  />
                </label>
              </div>
              <div className="flex gap-8">
                <button
                  type="submit"
                  onClick={handleEdit}
                  className="px-2 py-1 border border-gray-900 rounded-md hover:bg-black hover:text-white"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditTaskModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
};
