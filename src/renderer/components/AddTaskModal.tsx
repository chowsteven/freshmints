import { Fragment, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { WalletSelect } from './WalletSelect';
import { IWallet } from '../../interfaces/IWallet';
import { TaskModeSelect } from './TaskModeSelect';

interface AddTaskModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const tempWallets: IWallet[] = [
  { name: 'a', privateKey: 'a', address: 'a' },
  { name: '2', privateKey: '2', address: '2' },
  { name: '3', privateKey: '3', address: '3' },
];

export const AddTaskModal = ({
  isModalOpen,
  setIsModalOpen,
}: AddTaskModalProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedWallets, setSelectedWallets] = useState<IWallet[]>([]);
  const [mode, setMode] = useState<'Manual' | 'Automatic'>('Manual');

  const handleAdd = async (e: React.SyntheticEvent) => {
    e.preventDefault();
  };

  return (
    <Transition appear show={isModalOpen} as={Fragment}>
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
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
            <form ref={formRef}>
              <div className="pb-4 mb-4 border-b border-b-gray-800">
                <div>
                  <p className="mb-1">Select Wallet(s)</p>
                  <WalletSelect
                    fetchedWallets={tempWallets}
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
                    placeholder="Contract Address"
                    className="p-2 border rounded-md bg-gray-100"
                  />
                </label>
                <label htmlFor="function" className="flex flex-col gap-1 mb-1">
                  Mint Function
                  <input
                    type="text"
                    name="function"
                    id="function"
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
                <label htmlFor="price" className="flex flex-col gap-1">
                  Price
                  <input
                    type="text"
                    name="price"
                    id="price"
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
                <button type="button" onClick={() => setIsModalOpen(false)}>
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
