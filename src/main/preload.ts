import { contextBridge, ipcRenderer } from 'electron';

const addWallet = async (wallet: { [k: string]: FormDataEntryValue }) => {
  const newWallet = ipcRenderer.invoke('add-wallet', wallet);
  return newWallet;
};

const fetchWallets = async () => {
  const wallets = await ipcRenderer.invoke('fetch-wallets');
  return wallets;
};

const updateSettings = (settings: string) => {
  ipcRenderer.invoke('update-settings', settings);
};

const fetchSettings = async () => {
  const settings = await ipcRenderer.invoke('fetch-settings');
  return settings;
};

const API = {
  addWallet,
  fetchWallets,
  updateSettings,
  fetchSettings,
};

contextBridge.exposeInMainWorld('api', API);
