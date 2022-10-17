import { useState } from 'react';
import { Wallet } from 'renderer/components/Wallet';

export const Wallets = () => {
  const [wallets, setWallets] = useState([
    { name: 'test1', address: 'test2' },
    { name: 'test3', address: 'test4' },
  ]);

  const handleAdd = () => {
    // add modal
    // add wallet
  };

  return (
    <div>
      <div className="flex justify-between">
        <div className="text-2xl mb-8">Wallets</div>
        <button
          type="button"
          onClick={handleAdd}
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
    </div>
  );
};
