import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <header className="bg-white border-b-1 shadow-xs p-4">
      <div className="mx-auto flex justify-between items-center">
        <Link to="/" className="text-gray-700 hover:text-purple-600"><h1 className="text-xl font-extrabold text-purple-600">Form Builder</h1></Link>
      </div>
    </header>
  );
};

export default Navbar;