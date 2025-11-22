import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, User, History, Home } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? "text-fuchsia-400" : "text-slate-400 hover:text-slate-200";
  };

  return (
    <div className="min-h-screen bg-mystic-900 flex flex-col items-center relative overflow-x-hidden">
      {/* Ambient Background Effects */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-fuchsia-900/20 rounded-full blur-[80px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Main Content */}
      <main className="w-full max-w-md flex-1 z-10 pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full max-w-md bg-mystic-900/80 backdrop-blur-lg border-t border-white/10 z-50 pb-safe">
        <div className="flex justify-around items-center p-4">
          <Link to="/" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/')}`}>
            <Home size={24} />
            <span className="text-[10px] uppercase tracking-widest">Home</span>
          </Link>
          <Link to="/read" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/read')}`}>
            <div className="bg-fuchsia-600 p-3 rounded-full mt-[-24px] shadow-lg shadow-fuchsia-900/50 border border-fuchsia-400">
              <Sparkles size={24} color="white" />
            </div>
            <span className="text-[10px] uppercase tracking-widest mt-1">Read</span>
          </Link>
          <Link to="/history" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/history')}`}>
            <History size={24} />
            <span className="text-[10px] uppercase tracking-widest">History</span>
          </Link>
          <Link to="/profile" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/profile')}`}>
            <User size={24} />
            <span className="text-[10px] uppercase tracking-widest">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Layout;
