import { MdModeEdit, MdDelete } from 'react-icons/md';

interface WalletProps {
  wallet: {
    name: string;
    privateKey: string;
  };
}

export const Wallet = ({ wallet }: WalletProps) => {
  const handleEdit = () => {
    // edit modal
    // update wallet
  };

  const handleDelete = () => {
    // confirm delete
    // remove wallet
  };

  return (
    <tr>
      <td className="py-2">{wallet.name}</td>
      <td className="py-2">{wallet.privateKey}</td>
      <td>
        <div className="flex gap-2">
          <MdModeEdit className="hover:cursor-pointer" />
          <MdDelete className="hover:cursor-pointer" />
        </div>
      </td>
    </tr>
  );
};
