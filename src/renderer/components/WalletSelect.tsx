import { Listbox } from '@headlessui/react';
import { IWallet } from 'interfaces/IWallet';

interface WalletSelectProps {
  fetchedWallets: IWallet[];
  // if edit task modal is open, wallet select should only allow one wallet choice
  selectedWallet?: IWallet;
  setSelectedWallet?: React.Dispatch<React.SetStateAction<IWallet>>;

  // if add task modal is open, wallet select should allow multiple wallet choices
  selectedWallets?: IWallet[];
  setSelectedWallets?: React.Dispatch<React.SetStateAction<IWallet[]>>;
}

export const WalletSelect = ({
  fetchedWallets,
  selectedWallet,
  setSelectedWallet,
  selectedWallets,
  setSelectedWallets,
}: WalletSelectProps) => {
  if (selectedWallets && setSelectedWallets) {
    // add task modal is open
    return (
      <Listbox
        value={selectedWallets}
        onChange={setSelectedWallets}
        name="wallets"
        multiple
      >
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left">
            <span className="block truncate">
              {selectedWallets.length > 0
                ? selectedWallets.map((wallet) => wallet.name).join(', ')
                : 'Select one or more wallets'}
            </span>
          </Listbox.Button>
          <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg">
            {fetchedWallets.map((wallet) => (
              <Listbox.Option
                key={wallet.address}
                className={({ active, selected }) =>
                  `relative cursor-default select-none py-2 pl-2 pr-4 hover:bg-gray-300 ${
                    active ? 'bg-gray-300' : 'text-gray-900'
                  } ${selected ? 'bg-gray-300' : 'bg-white'}`
                }
                value={wallet}
              >
                {wallet.name}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    );
  }

  // edit task modal is open
  return (
    // remove multiple attribute
    <Listbox value={selectedWallet} onChange={setSelectedWallet} name="wallets">
      <div className="relative mt-1">
        <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left">
          {/* this will be defined but added ? to satisfy type check */}
          {/* only show wallet name instead of 'Select one or more wallets' / join with commas */}
          <span className="block truncate">{selectedWallet?.name}</span>
        </Listbox.Button>
        <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg">
          {fetchedWallets.map((wallet) => (
            <Listbox.Option
              key={wallet.address}
              className={({ active, selected }) =>
                `relative cursor-default select-none py-2 pl-2 pr-4 hover:bg-gray-300 ${
                  active ? 'bg-gray-300' : 'text-gray-900'
                } ${selected ? 'bg-gray-300' : 'bg-white'}`
              }
              value={wallet}
            >
              {wallet.name}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
};

WalletSelect.defaultProps = {
  selectedWallet: null,
  setSelectedWallet: null,
  selectedWallets: null,
  setSelectedWallets: null,
};
