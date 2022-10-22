import { useContext, useState } from 'react';
import { Wallet } from 'renderer/components/Wallet';
import { AddWalletModal } from 'renderer/components/AddWalletModal';
import { WalletContext } from 'renderer/contexts/WalletContext';
import { IWallet } from 'interfaces/IWallet';
import { IWalletContext } from 'interfaces/IWalletContext';

export const Wallets = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { wallets } = useContext(WalletContext) as IWalletContext;

  return (
    <div>
      <div className="flex justify-between">
        <div className="text-2xl mb-8">Wallets</div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 mr-16 mb-4 border rounded-md hover:bg-gray-600"
        >
          Add Wallet
        </button>
      </div>
      <table className="w-full text-left">
        <thead className="uppercase">
          <tr>
            <th className="w-1/3 py-3">Name</th>
            <th className="w-1/2 py-3">Wallet Address</th>
            <th className="w-1/6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {wallets.map((wallet: IWallet) => (
            <Wallet key={wallet.address} wallet={wallet} />
          ))}
        </tbody>
      </table>
      <AddWalletModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  );
};
