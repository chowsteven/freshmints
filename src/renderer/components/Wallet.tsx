import { IWallet } from 'interfaces/IWallet';
import { MdDelete } from 'react-icons/md';

interface WalletProps {
  wallet: IWallet;
  isDeleteWallet: boolean;
  setIsDeleteWallet: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Wallet = ({
  wallet,
  isDeleteWallet,
  setIsDeleteWallet,
}: WalletProps) => {
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
