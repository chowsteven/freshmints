import React, { useCallback, useState } from 'react';
import { IWallet } from 'interfaces/IWallet';
import { IWalletContext } from 'interfaces/IWalletContext';
import { WalletContext } from './WalletContext';

export const WalletContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [wallets, setWallets] = useState<IWallet[]>([]);
  const [isDeleteWallet, setIsDeleteWallet] = useState(false);

  // wrap around useCallback: https://devtrium.com/posts/async-functions-useeffect
  const fetchWallets = useCallback(async () => {
    const walletsArrStr: string = await window.api.fetchWallets();
    const walletsArr: IWallet[] = JSON.parse(walletsArrStr);

    setWallets(walletsArr);
    return walletsArr;
  }, []);

  const value: IWalletContext = {
    wallets,
    setWallets,
    isDeleteWallet,
    setIsDeleteWallet,
    fetchWallets,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};
