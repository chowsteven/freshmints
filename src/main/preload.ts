import { contextBridge, ipcRenderer } from 'electron';

const updateSettings = (settings: string) => {
  ipcRenderer.invoke('update-settings', settings);
};

const API = {
  updateSettings,
};

contextBridge.exposeInMainWorld('api', API);
