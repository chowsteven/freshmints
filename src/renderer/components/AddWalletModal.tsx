import { Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { IWallet } from '../../interfaces/IWallet';

interface AddWalletModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setWallets: React.Dispatch<React.SetStateAction<IWallet[]>>;
  fetchWallets: () => Promise<IWallet[]>;
}

export const AddWalletModal = ({
  isModalOpen,
  setIsModalOpen,
  setWallets,
  fetchWallets,
}: AddWalletModalProps) => {
  const formRef = useRef<HTMLFormElement>(null);

  const handleAdd = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsModalOpen(false);

    if (formRef.current) {
      // write to wallets.json
      const data = new FormData(formRef.current);
      const newWallet = Object.fromEntries(data.entries());

      // Warning: 'await' has no effect on the type of this expression.ts(80007)
      // but need this add wallet to actually await before the fetching and updating state
      await window.api.addWallet(newWallet);

      // fetch wallets to update state
      const updatedWallets = await fetchWallets();
      setWallets(updatedWallets);
    }
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
              Add Wallet
            </Dialog.Title>
            <form ref={formRef}>
              <div className="mb-4">
                <label htmlFor="name" className="flex flex-col gap-1">
                  Name
                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Name"
                    className="p-2 border rounded-md bg-gray-100"
                  />
                </label>
              </div>
              <div className="mb-6">
                <label htmlFor="privateKey" className="flex flex-col gap-1">
                  Private Key
                  <input
                    type="text"
                    name="privateKey"
                    id="privateKey"
                    placeholder="Private Key"
                    className="p-2 border rounded-md bg-gray-100"
                  />
                </label>
              </div>
              <div className="flex gap-8">
                <button
                  type="submit"
                  onClick={handleAdd}
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
