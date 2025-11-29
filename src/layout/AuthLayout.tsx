// src/layout/AuthLayout.tsx
import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-blue-100">
      <header className="absolute top-0 left-0 right-0 p-4">
        <Link to="/" className="text-2xl font-bold text-gray-800">
          ArtisanConnect
        </Link>
      </header>
      <main className="flex items-center justify-center min-h-screen">
        <Outlet /> {/* This will render the Login or Register page */}
      </main>
    </div>
  );
};

export default AuthLayout;
