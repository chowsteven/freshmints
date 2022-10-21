import { ITask } from 'interfaces/ITask';
import { IWallet } from 'interfaces/IWallet';

declare global {
  interface Window {
    api: {
      addTask: (task: { [k: string]: FormDataEntryValue }) => Promise<ITask>;
      // editTask: (task: { [k: string]: FormDataEntryValue }) => Promise<ITask>;
      deleteTask: (taskId: string) => Promise<void>;
      fetchTasks: () => Promise<string>;
      deleteTasks: () => Promise<void>;
      addWallet: (wallet: {
        [k: string]: FormDataEntryValue;
      }) => Promise<IWallet>;
      deleteWallet: (wallet: string) => void;
      fetchWallets: () => Promise<string>;
      updateSettings: (settings: string) => void;
      fetchSettings: () => Promise<string>;
    };
  }
}

export {};
