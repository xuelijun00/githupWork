import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ClipboardList,
  FolderOpen,
  History,
  AlertTriangle,
  User,
  Menu,
  X,
} from 'lucide-react';
import { users } from '../utils/helpers';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(users[0]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', icon: ClipboardList, label: '批次看板' },
    { path: '/records', icon: History, label: '流转记录' },
    { path: '/abnormal', icon: AlertTriangle, label: '异常处理' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-[Inter]">
      <header className="bg-lab-dark text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-lab-accent p-2 rounded-lg">
                <FolderOpen className="h-6 w-6 text-lab-dark" />
              </div>
              <h1 className="text-xl font-bold">实验室样本交接复核系统</h1>
            </div>

            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? 'bg-lab-accent text-lab-dark'
                      : 'hover:bg-white/10'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <select
                  value={currentUser}
                  onChange={(e) => setCurrentUser(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-lab-accent"
                >
                  {users.map((user) => (
                    <option key={user} value={user} className="text-gray-800">
                      {user}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span className="hidden sm:inline">{currentUser}</span>
              </div>

              <button
                className="md:hidden p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-lab-dark border-t border-white/10">
            <nav className="px-4 py-2 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg ${
                    location.pathname === item.path
                      ? 'bg-lab-accent text-lab-dark'
                      : 'hover:bg-white/10'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
};
