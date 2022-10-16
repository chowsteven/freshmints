import { contextBridge, ipcRenderer } from 'electron';

const updateSettings = (settings: string) => {
  ipcRenderer.invoke('update-settings', settings);
};

const fetchSettings = async () => {
  const settings = await ipcRenderer.invoke('fetch-settings');
  return settings;
};

const API = {
  updateSettings,
  fetchSettings,
};

contextBridge.exposeInMainWorld('api', API);
