import React from 'react';
import { Sidebar } from './Sidebar';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="w-screen pt-16 pl-12 bg-gray-800 text-white">
        {children}
      </div>
    </div>
  );
};
