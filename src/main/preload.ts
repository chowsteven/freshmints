import { contextBridge, ipcRenderer } from 'electron';
import { ITask } from 'interfaces/ITask';
import { IWallet } from 'interfaces/IWallet';

const addTask = async (task: {
  [k: string]: FormDataEntryValue;
}): Promise<ITask> => {
  const newTask = ipcRenderer.invoke('add-task', task);
  return newTask;
};

const fetchTasks = async (): Promise<string> => {
  const tasks = await ipcRenderer.invoke('fetch-tasks');
  return tasks;
};

const addWallet = async (wallet: {
  [k: string]: FormDataEntryValue;
}): Promise<IWallet> => {
  const newWallet = ipcRenderer.invoke('add-wallet', wallet);
  return newWallet;
};

const deleteWallet = (wallet: { [k: string]: FormDataEntryValue }) => {
  ipcRenderer.invoke('delete-wallet', wallet);
};

const fetchWallets = async (): Promise<string> => {
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
  addTask,
  fetchTasks,
  addWallet,
  deleteWallet,
  fetchWallets,
  updateSettings,
  fetchSettings,
};

contextBridge.exposeInMainWorld('api', API);
