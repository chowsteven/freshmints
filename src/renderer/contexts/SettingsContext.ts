import { createContext } from 'react';
import { ISettingsContext } from 'interfaces/ISettingsContext';

export const SettingsContext = createContext<ISettingsContext | null>(null);
