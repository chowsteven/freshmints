import { useRef, useState } from 'react';

export const Settings = () => {
  const formRef = useRef<HTMLFormElement>(null);

  const [globalRpc, setGlobalRpc] = useState('');
  const [etherscanKey, setEtherscanKey] = useState('');
  const [discordWebhook, setDiscordWebhook] = useState('');

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (formRef.current) {
      const data = new FormData(formRef.current);
      const settings = JSON.stringify(Object.fromEntries(data.entries()));
      window.api.updateSettings(settings);
    }
  };

  return (
    <div>
      <div className="text-2xl mb-8">Settings</div>
      <form ref={formRef}>
        <div className="mb-4">
          <label htmlFor="rpc" className="flex flex-col gap-1">
            Global RPC
            <input
              type="text"
              name="rpc"
              id="rpc"
              placeholder="RPC Link"
              value={globalRpc}
              onChange={(e) => setGlobalRpc(e.target.value)}
              className="w-[512px] h-8 p-2 mr-2 rounded-md bg-gray-600 hover:bg-gray-500 focus:bg-gray-500"
            />
          </label>
        </div>
        <div className="mb-4">
          <label htmlFor="etherscan" className="flex flex-col gap-1">
            Etherscan API Key
            <input
              type="text"
              name="etherscan"
              id="etherscan"
              placeholder="API Key"
              value={etherscanKey}
              onChange={(e) => setEtherscanKey(e.target.value)}
              className="w-[512px] h-8 p-2 mr-2 rounded-md bg-gray-600 hover:bg-gray-500 focus:bg-gray-500"
            />
          </label>
        </div>
        <div className="mb-4">
          <label htmlFor="webhook" className="flex flex-col gap-1">
            Discord Webhook
            <input
              type="text"
              name="webhook"
              id="webhook"
              placeholder="Discord Webhook URL"
              value={discordWebhook}
              onChange={(e) => setDiscordWebhook(e.target.value)}
              className="w-[512px] h-8 p-2 mr-2 rounded-md bg-gray-600 hover:bg-gray-500 focus:bg-gray-500"
            />
          </label>
        </div>
        <button
          type="submit"
          onClick={handleSubmit}
          className="border rounded-md px-4 py-1.5 hover:bg-gray-600"
        >
          Save
        </button>
      </form>
    </div>
  );
};
