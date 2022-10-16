declare global {
  interface Window {
    api: {
      updateSettings: (settings: string) => void;
      fetchSettings: () => Promise<string>;
    };
  }
}

export {};
