import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-1 mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;