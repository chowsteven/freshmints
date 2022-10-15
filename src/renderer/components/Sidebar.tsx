import { NavLink } from 'react-router-dom';
import { BsListTask, BsWallet2 } from 'react-icons/bs';
import { MdOutlineSettings } from 'react-icons/md';

export const Sidebar = () => {
  return (
    <div className="flex flex-col items-center gap-6 w-48 h-screen pt-16 bg-gray-900 text-white">
      <NavLink
        to="/tasks"
        className={({ isActive }) =>
          isActive
            ? 'flex items-center gap-2 w-36 px-4 py-1.5 text-center text-green-500 bg-gray-700 rounded-md'
            : 'flex items-center gap-2 w-36 px-4 py-1.5 text-white'
        }
      >
        <BsListTask />
        Tasks
      </NavLink>
      <NavLink
        to="/wallets"
        className={({ isActive }) =>
          isActive
            ? 'flex items-center gap-2 w-36 px-4 py-1.5 text-green-500 bg-gray-700 rounded-md'
            : 'flex items-center gap-2 w-36 px-4 py-1.5 text-white'
        }
      >
        <BsWallet2 />
        Wallets
      </NavLink>
      <NavLink
        to="/settings"
        className={({ isActive }) =>
          isActive
            ? 'flex items-center gap-2 w-36 px-4 py-1.5 text-green-500 bg-gray-700 rounded-md'
            : 'flex items-center gap-2 w-36 px-4 py-1.5 text-white'
        }
      >
        <MdOutlineSettings />
        Settings
      </NavLink>
    </div>
  );
};
