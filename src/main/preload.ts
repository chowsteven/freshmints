import { contextBridge, ipcRenderer } from 'electron';
import { IWallet } from 'interfaces/IWallet';

const addWallet = async (wallet: {
  [k: string]: FormDataEntryValue;
}): Promise<IWallet> => {
  const newWallet = ipcRenderer.invoke('add-wallet', wallet);
  return newWallet;
};

const deleteWallet = (wallet: { [k: string]: FormDataEntryValue }) => {
  ipcRenderer.invoke('delete-wallet', wallet);
};

const fetchWallets = async () => {
  const wallets = await ipcRenderer.invoke('fetch-wallets');
  return wallets;
};

const updateSettings = (settings: string) => {
  ipcRenderer.invoke('update-settings', settings);
};

const fetchSettings = async (): Promise<string> => {
  const settings = await ipcRenderer.invoke('fetch-settings');
  return settings;
};

const API = {
  addWallet,
  deleteWallet,
  fetchWallets,
  updateSettings,
  fetchSettings,
};

contextBridge.exposeInMainWorld('api', API);
