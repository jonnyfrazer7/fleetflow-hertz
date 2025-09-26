import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { 
  Car, 
  LayoutDashboard, 
  ClipboardList, 
  BarChart3,
  Settings,
  Bell,
  LogOut,
  User
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Vehicles', href: '/vehicles', icon: Car },
  { name: 'Workflows', href: '/workflows', icon: ClipboardList },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
];

export function Navbar() {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-hertz-navy border-b border-hertz-dark-blue">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-hertz-yellow rounded-lg flex items-center justify-center"
                   style={{ background: 'var(--gradient-hertz)' }}>
                <Car className="w-5 h-5 text-hertz-navy" />
              </div>
              <div className="flex flex-col">
                <span className="text-hertz-yellow font-heading font-bold text-lg">
                  Hertz Fleet
                </span>
                <span className="text-hertz-light-blue text-xs font-medium">
                  Management System
                </span>
              </div>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:ml-10 md:flex md:space-x-1">
              {navigation.map((item) => {
                const isActive = isActivePath(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-hertz-yellow text-hertz-navy shadow-lg'
                        : 'text-white hover:bg-hertz-dark-blue hover:text-hertz-yellow'
                    )}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="text-white hover:text-hertz-yellow hover:bg-hertz-dark-blue">
              <Bell className="w-4 h-4" />
              <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs bg-status-error text-white">
                3
              </Badge>
            </Button>

            {/* Settings */}
            <Button variant="ghost" size="sm" className="text-white hover:text-hertz-yellow hover:bg-hertz-dark-blue">
              <Settings className="w-4 h-4" />
            </Button>

            {/* User & Sign Out */}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => signOut()}
              className="text-white hover:text-hertz-yellow hover:bg-hertz-dark-blue flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:block">{user?.email}</span>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}