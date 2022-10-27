import { ISettings } from './ISettings';

export interface ISettingsContext {
  alchemyApiUrl: string;
  setAlchemyApiUrl: React.Dispatch<React.SetStateAction<string>>;
  etherscanApiKey: string;
  setEtherscanApiKey: React.Dispatch<React.SetStateAction<string>>;
  discordWebhook: string;
  setDiscordWebhook: React.Dispatch<React.SetStateAction<string>>;
  fetchSettings: () => Promise<ISettings>;
}
