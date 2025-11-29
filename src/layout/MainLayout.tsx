// // src/layout/MainLayout.tsx
// import React from 'react';
// import { Link, Outlet } from 'react-router-dom';
// import useAuth from '../hooks/useAuth';
// import { Button } from '../components/Button';

// interface MainLayoutProps {
//   children?: React.ReactNode;
// }

// const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
//   const { isAuthenticated, logout } = useAuth();

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <nav className="bg-white shadow-md p-4">
//         <div className="container mx-auto flex justify-between items-center">
//           <Link to="/" className="text-xl font-bold text-gray-800">
//             ArtisanConnect
//           </Link>
//           <div>
//             {isAuthenticated ? (
//               <div className="flex items-center space-x-4">
//                 <Link to="/dashboard" className="text-gray-600 hover:text-blue-500">
//                   Dashboard
//                 </Link>
//                 <Link to="/dashboard/posts" className="text-gray-600 hover:text-blue-500">
//                   My Posts
//                 </Link>
//                 <Link to="/dashboard/skills" className="text-gray-600 hover:text-blue-500">
//                   My Skills
//                 </Link>
//                 <Button onClick={logout} variant="secondary" size="small">
//                   Logout
//                 </Button>
//               </div>
//             ) : (
//               <div className="space-x-4">
//                 <Link to="/login">
//                   <Button variant="primary" size="small">Login</Button>
//                 </Link>
//                 <Link to="/register">
//                   <Button variant="secondary" size="small">Register</Button>
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>
//       </nav>
//       <main className="container mx-auto p-4">
//         {children || <Outlet />}
//       </main>
//       <footer className="bg-gray-800 text-white p-4 text-center mt-8">
//         <p>&copy; 2025 ArtisanConnect. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// };

// export default MainLayout;


// src/layout/MainLayout.tsx
import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Button } from '../components/Button';

interface MainLayoutProps {
  children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-gray-800">
            ArtisanConnect
          </Link>

          <div className="space-x-4">
            <Link to="/login">
              <Button variant="primary" size="small">Login</Button>
            </Link>
            <Link to="/register">
              <Button variant="secondary" size="small">Register</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto p-4">
        {children || <Outlet />}
      </main>

      <footer className="bg-gray-800 text-white p-4 text-center mt-8">
        <p>&copy; 2025 ArtisanConnect. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MainLayout;
