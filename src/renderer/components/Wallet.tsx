import { IWallet } from 'interfaces/IWallet';
import { MdDelete } from 'react-icons/md';

interface WalletProps {
  wallet: IWallet;
}

export const Wallet = ({ wallet }: WalletProps) => {
  const handleDelete = () => {
    // confirm delete
    // remove wallet
  };

  return (
    <tr>
      <td className="py-2">{wallet.name}</td>
      <td className="py-2">{wallet.address}</td>
      <td>
        <div className="flex gap-2">
          <MdDelete className="hover:cursor-pointer" />
        </div>
      </td>
    </tr>
  );
};
