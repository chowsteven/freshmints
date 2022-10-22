import { IWallet } from 'interfaces/IWallet';
import { IWalletContext } from 'interfaces/IWalletContext';
import { useContext } from 'react';
import { MdDelete } from 'react-icons/md';
import { WalletContext } from 'renderer/contexts/WalletContext';

interface WalletProps {
  wallet: IWallet;
}

export const Wallet = ({ wallet }: WalletProps) => {
  const { isDeleteWallet, setIsDeleteWallet } = useContext(
    WalletContext
  ) as IWalletContext;

  const handleDelete = async () => {
    await window.api.deleteWallet(wallet.address);
    setIsDeleteWallet(!isDeleteWallet);
  };

  return (
    <tr>
      <td className="py-2">{wallet.name}</td>
      <td className="py-2">{wallet.address}</td>
      <td>
        <div className="flex gap-2">
          <MdDelete onClick={handleDelete} className="hover:cursor-pointer" />
        </div>
      </td>
    </tr>
  );
};
