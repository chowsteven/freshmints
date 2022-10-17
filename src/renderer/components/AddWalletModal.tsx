import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

interface AddWalletModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AddWalletModal = ({
  isModalOpen,
  setIsModalOpen,
}: AddWalletModalProps) => {
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
              Add Wallet
            </Dialog.Title>
            <form>
              <label htmlFor="name" className="flex flex-col gap-1 mb-2">
                Name
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Name"
                  className="p-2 border rounded-md bg-gray-100"
                />
              </label>
              <label htmlFor="private-key" className="flex flex-col gap-1 mb-6">
                Private Key
                <input
                  type="text"
                  name="private-key"
                  id="private-key"
                  placeholder="Private Key"
                  className="p-2 border rounded-md bg-gray-100"
                />
              </label>
              <div className="flex gap-8">
                <button
                  type="submit"
                  onClick={() => setIsModalOpen(false)}
                  className="px-2 py-1 border border-gray-900 rounded-md hover:bg-black hover:text-white"
                >
                  Add
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
