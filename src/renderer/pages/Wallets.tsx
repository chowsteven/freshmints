import { useCallback, useEffect, useState } from 'react';
import { Wallet } from 'renderer/components/Wallet';
import { AddWalletModal } from 'renderer/components/AddWalletModal';
import { IWallet } from 'interfaces/IWallet';

export const Wallets = () => {
  const [wallets, setWallets] = useState<IWallet[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // wrap around useCallback: https://devtrium.com/posts/async-functions-useeffect
  const fetchWallets = useCallback(async () => {
    const walletsArrStr: string = await window.api.fetchWallets();
    const walletsArr: IWallet[] = JSON.parse(walletsArrStr);

    setWallets(walletsArr);
    return walletsArr;
  }, []);

  // fetch wallets on component mount
  useEffect(() => {
    fetchWallets();
  }, [fetchWallets]);

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
          {wallets.map((wallet) => (
            <Wallet key={wallet.address} wallet={wallet} />
          ))}
        </tbody>
      </table>
      <AddWalletModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        setWallets={setWallets}
        fetchWallets={fetchWallets}
      />
    </div>
  );
};
