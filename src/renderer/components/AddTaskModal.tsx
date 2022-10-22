import React, { Fragment, useContext, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { WalletContext } from 'renderer/contexts/WalletContext';
import { IWalletContext } from 'interfaces/IWalletContext';
import { INewTask } from 'interfaces/INewTask';
import { WalletSelect } from './WalletSelect';
import { TaskModeSelect } from './TaskModeSelect';
import { ITask } from '../../interfaces/ITask';
import { IWallet } from '../../interfaces/IWallet';

interface AddTaskModalProps {
  isAddTaskModalOpen: boolean;
  setIsAddTaskModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  fetchTasks: () => Promise<ITask[]>;
}

interface AddTaskFormProps {
  contract: string;
  mintFunction: string;
  mintPrice: string;
  quantity: string;
  maxGas: string;
  priorityFee: string;
}

export const AddTaskModal = ({
  isAddTaskModalOpen,
  setIsAddTaskModalOpen,
  fetchTasks,
}: AddTaskModalProps) => {
  const { wallets } = useContext(WalletContext) as IWalletContext;
  const [addTaskForm, setAddTaskForm] = useState<AddTaskFormProps>({
    contract: '',
    mintFunction: '',
    mintPrice: '',
    quantity: '',
    maxGas: '',
    priorityFee: '',
  });

  const [selectedWallets, setSelectedWallets] = useState<IWallet[]>([]);
  const [mode, setMode] = useState<'Manual' | 'Automatic'>('Manual');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddTaskForm({ ...addTaskForm, [e.target.id]: e.target.value });
  };

  const handleAdd = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const newTask: INewTask = { ...addTaskForm, selectedWallets, mode };

    // TODO: validate data

    // reset states
    setIsAddTaskModalOpen(false);
    setAddTaskForm({
      contract: '',
      mintFunction: '',
      mintPrice: '',
      quantity: '',
      maxGas: '',
      priorityFee: '',
    });
    setSelectedWallets([]);
    setMode('Manual');

    // write to tasks.json
    await window.api.addTask(newTask);

    // fetch tasks to update state
    await fetchTasks();
  };

  return (
    <Transition appear show={isAddTaskModalOpen} as={Fragment}>
      <Dialog
        open={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        className="relative z-50"
      >
        {/* backdrop */}
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        {/* modal */}
        <div className="fixed inset-0 flex items-center justify-center">
          <Dialog.Panel className="w-full p-8 max-w-sm rounded-2xl bg-gray-200">
            <Dialog.Title className="mb-4 text-xl font-semibold">
              Add Task
            </Dialog.Title>
            <form>
              <div className="pb-4 mb-4 border-b border-b-gray-800">
                <div>
                  <p className="mb-1">Select Wallet(s)</p>
                  <WalletSelect
                    fetchedWallets={wallets}
                    selectedWallets={selectedWallets}
                    setSelectedWallets={setSelectedWallets}
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
                    value={addTaskForm.contract}
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
                    value={addTaskForm.mintFunction}
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
                    value={addTaskForm.mintPrice}
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
                    value={addTaskForm.quantity}
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
                    value={addTaskForm.maxGas}
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
                    value={addTaskForm.priorityFee}
                    onChange={handleChange}
                    placeholder="Priority Fee"
                    className="w-28 p-2 border rounded-md bg-gray-100"
                  />
                </label>
              </div>
              <div className="flex gap-8">
                <button
                  type="submit"
                  onClick={handleAdd}
                  className="px-2 py-1 border border-gray-900 rounded-md hover:bg-black hover:text-white"
                >
                  Create Task
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddTaskModalOpen(false)}
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
