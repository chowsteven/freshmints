import React, { useCallback, useEffect, useState } from 'react';
import { ISettings } from 'interfaces/ISettings';
import { ISettingsContext } from 'interfaces/ISettingsContext';
import { SettingsContext } from './SettingsContext';

export const SettingsContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [alchemyApiKey, setAlchemyApiKey] = useState('');
  const [etherscanApiKey, setEtherscanApiKey] = useState('');
  const [discordWebhook, setDiscordWebhook] = useState('');

  // wrap around useCallback: https://devtrium.com/posts/async-functions-useeffect
  const fetchSettings = useCallback(async () => {
    const settingsStr = await window.api.fetchSettings();
    const settingsJSON: ISettings = JSON.parse(settingsStr);

    setAlchemyApiKey(settingsJSON.alchemyApiKey);
    setEtherscanApiKey(settingsJSON.etherscanApiKey);
    setDiscordWebhook(settingsJSON.discordWebhook);
    return settingsJSON;
  }, []);

  // fetch settings on component mount
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const value: ISettingsContext = {
    alchemyApiKey,
    setAlchemyApiKey,
    etherscanApiKey,
    setEtherscanApiKey,
    discordWebhook,
    setDiscordWebhook,
    fetchSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
