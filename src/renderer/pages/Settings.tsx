import { ISettings } from 'interfaces/ISettings';
import { useEffect, useRef, useState } from 'react';

export const Settings = () => {
  const formRef = useRef<HTMLFormElement>(null);

  const [alchemyApiKey, setAlchemyApiKey] = useState('');
  const [etherscanApiKey, setEtherscanApiKey] = useState('');
  const [discordWebhook, setDiscordWebhook] = useState('');
  const [buttonText, setButtonText] = useState('Save');

  // on component mount, fetch settings
  useEffect(() => {
    let settings: string;

    // async function, so make separate function
    const fetchSettings = async () => {
      settings = await window.api.fetchSettings();
      const settingsJSON: ISettings = JSON.parse(settings);

      // set states
      setAlchemyApiKey(settingsJSON.alchemyApiKey);
      setEtherscanApiKey(settingsJSON.etherscanApiKey);
      setDiscordWebhook(settingsJSON.discordWebhook);
    };

    fetchSettings();
  }, []);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (formRef.current) {
      // get form data and save to settings.json
      const data = new FormData(formRef.current);
      const settings = JSON.stringify(Object.fromEntries(data.entries()));
      window.api.updateSettings(settings);
      setButtonText('Saved!');
    }
  };

  return (
    <div>
      <div className="text-2xl mb-8">Settings</div>
      <form ref={formRef}>
        <div className="mb-4">
          <label htmlFor="alchemyApiKey" className="flex flex-col gap-1">
            Alchemy API Key
            <input
              type="text"
              name="alchemyApiKey"
              id="alchemyApiKey"
              placeholder="Alchemy API Key"
              value={alchemyApiKey}
              onChange={(e) => {
                setAlchemyApiKey(e.target.value);
                setButtonText('Save');
              }}
              className="w-[512px] h-8 p-2 mr-2 rounded-md bg-gray-600 hover:bg-gray-500 focus:bg-gray-500"
            />
          </label>
        </div>
        <div className="mb-4">
          <label htmlFor="etherscanApiKey" className="flex flex-col gap-1">
            Etherscan API Key
            <input
              type="text"
              name="etherscanApiKey"
              id="etherscanApiKey"
              placeholder="Etherscan API Key"
              value={etherscanApiKey}
              onChange={(e) => {
                setEtherscanApiKey(e.target.value);
                setButtonText('Save');
              }}
              className="w-[512px] h-8 p-2 mr-2 rounded-md bg-gray-600 hover:bg-gray-500 focus:bg-gray-500"
            />
          </label>
        </div>
        <div className="mb-4">
          <label htmlFor="discordWebhook" className="flex flex-col gap-1">
            Discord Webhook
            <input
              type="text"
              name="discordWebhook"
              id="discordWebhook"
              placeholder="Discord Webhook URL"
              value={discordWebhook}
              onChange={(e) => {
                setDiscordWebhook(e.target.value);
                setButtonText('Save');
              }}
              className="w-[512px] h-8 p-2 mr-2 rounded-md bg-gray-600 hover:bg-gray-500 focus:bg-gray-500"
            />
          </label>
        </div>
        <button
          type="submit"
          onClick={handleSubmit}
          className="border rounded-md px-4 py-1.5 hover:bg-gray-600"
        >
          {buttonText}
        </button>
      </form>
    </div>
  );
};
