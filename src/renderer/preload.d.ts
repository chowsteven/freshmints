declare global {
  interface Window {
    api: {
      updateSettings: (settings: string) => void;
    };
  }
}

export {};
