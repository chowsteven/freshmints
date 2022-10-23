import { ISettings } from './ISettings';

export interface ISettingsContext {
  alchemyApiKey: string;
  setAlchemyApiKey: React.Dispatch<React.SetStateAction<string>>;
  etherscanApiKey: string;
  setEtherscanApiKey: React.Dispatch<React.SetStateAction<string>>;
  discordWebhook: string;
  setDiscordWebhook: React.Dispatch<React.SetStateAction<string>>;
  fetchSettings: () => Promise<ISettings>;
}
