import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Tasks } from './pages/Tasks';
import { Wallets } from './pages/Wallets';
import { Settings } from './pages/Settings';
import { SettingsContextProvider } from './contexts/SettingsContextProvider';
import { WalletContextProvider } from './contexts/WalletContextProvider';
import 'tailwindcss/tailwind.css';

export default function App() {
  return (
    <Router>
      <Layout>
        <SettingsContextProvider>
          <WalletContextProvider>
            <Routes>
              <Route path="/" element={<Tasks />} />
              <Route path="/wallets" element={<Wallets />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </WalletContextProvider>
        </SettingsContextProvider>
      </Layout>
    </Router>
  );
}
